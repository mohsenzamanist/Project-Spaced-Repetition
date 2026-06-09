import { getUserIds } from "./common.mjs";
import { addData, clearData, getData } from "./storage.mjs";
import {
  calculateSpaces,
  formatReadableDate,
  emptyStorageOnFirstLoad,
  flattenStoredAgendas,
  sortFlattenedAgendas,
} from "./utils/utils.mjs";

const userSelect = document.getElementById("user-select");
const contentSection = document.getElementById("content-section");
const form = document.getElementById("agenda-form");
const dateInput = document.getElementById("date");
const inputDiv = document.querySelector(".input-div");
const clearBtn = document.getElementById("clear-button");
const errorMsg = document.querySelector(".error-msg");

// handlers
const clearButtonHandler = function () {
  const userId = userSelect.value;
  if (!userId) {
    contentSection.textContent = "Select a user";
    return;
  }
  clearData(userId);
  renderAgendas();
};

const formSubmitHandler = function (e) {
  e.preventDefault();
  const formData = new FormData(form);
  const userId = userSelect.value;
  const { topic, date } = Object.fromEntries(formData);

  const trimmedTopic = topic.trim();
  if (!trimmedTopic) {
    errorMsg.textContent = "Topic cannot be empty.";
    return;
  }
  errorMsg.textContent = "";

  // calculates revision dates and returns only dates
  const revisionDates = calculateSpaces(date);

  addData(userId, { [trimmedTopic]: revisionDates });
  form.reset();

  renderAgendas();
};

const formResetHandler = function () {
  setTimeout(setDefaultInputDate, 0);
};

const userSelectChangeHandler = function (e) {
  const userId = e.target.value;
  if (!userId) {
    inputDiv.classList.add("hidden");
    contentSection.textContent = "";
    return;
  }

  inputDiv.classList.remove("hidden");
  renderAgendas();
};

// eventListeners
clearBtn.addEventListener("click", clearButtonHandler);

form.addEventListener("submit", formSubmitHandler);

form.addEventListener("reset", formResetHandler);

userSelect.addEventListener("change", userSelectChangeHandler);

// functions
function renderAgendas() {
  const userId = userSelect.value;
  contentSection.textContent = "";
  const userAgendas = getData(userId) || [];
  if (userAgendas.length === 0) {
    contentSection.textContent = "No agenda to display.";
    return;
  }

  const flattenedAgendas = flattenStoredAgendas(userAgendas);

  const sortedAgendas = sortFlattenedAgendas(flattenedAgendas);

  const paragraphs = sortedAgendas.map((agenda) => {
    const p = document.createElement("p");
    const readableDate = formatReadableDate(agenda.date);
    p.textContent = `${agenda.topic} : ${readableDate}`;

    return p;
  });

  contentSection.append(...paragraphs);
}

function populateUsersDropDown(list) {
  const options = list.map((l) => {
    const option = document.createElement("option");
    option.value = l;
    option.textContent = l;
    return option;
  });
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Select a user";
  userSelect.append(defaultOption, ...options);
}

function setDefaultInputDate() {
  dateInput.value = new Date().toISOString().split("T")[0];
}

document.addEventListener("DOMContentLoaded", function () {
  const users = getUserIds();
  if (users.length === 0) {
    contentSection.textContent = "No user to display.";
    return;
  }

  emptyStorageOnFirstLoad(users);
  populateUsersDropDown(users);
  setDefaultInputDate();
});

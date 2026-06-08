import { getUserIds } from "./common.mjs";
import { addData, clearData, getData } from "./storage.mjs";
import {
  calculateSpaces,
  formatReadableDate,
  formatOrdinalDay,
  emptyStorageOnFirstLoad,
  flattenStoredAgendas,
  sortFlattenedAgendas,
} from "./utils/utils.mjs";

const userSelect = document.getElementById("user-select");
const contentSection = document.getElementById("content-section");
const form = document.querySelector("form");
const topicInput = document.getElementById("topic");
const dateInput = document.getElementById("date");
const inputDiv = document.querySelector(".input-div");
const clearBtn = document.getElementById("clear-button");
const errorMsg = document.querySelector(".error-msg");

// handlers
const clearButtonHandler = function () {
  const userId = userSelect.value;
  if (!userId) {
    contentSection.innerHTML = "<p>Select a user.</p>";
    return;
  }
  clearData(userId);
  renderAgendas();
};

const formSubmitHandler = function (e) {
  e.preventDefault();
  const userId = userSelect.value;
  const topic = topicInput.value;
  const date = dateInput.value;
  console.log(date);

  if (topic.trim() === "") {
    errorMsg.textContent = "Topic can not be empty.";
    return;
  }
  errorMsg.textContent = "";
  // calculates revision dates and returns only dates
  const repetitionSpacesDates = calculateSpaces(date);

  addData(userId, { [topic]: repetitionSpacesDates });
  resetFormInputs();

  renderAgendas();
};

const formResetHandler = function () {
  setTimeout(() => {
    setDefaultInputDate();
  }, 0);
};

const userSelectChangeHandler = function (e) {
  const userId = e.target.value;
  if (!userId) {
    inputDiv.classList.add("hidden");
    return;
  }

  renderAgendas();
  inputDiv.classList.remove("hidden");
};

// eventListeners
clearBtn.addEventListener("click", clearButtonHandler);

form.addEventListener("submit", formSubmitHandler);

form.addEventListener("reset", formResetHandler);

userSelect.addEventListener("change", userSelectChangeHandler);

// functions
function renderAgendas() {
  const userId = userSelect.value;
  contentSection.innerHTML = "";
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

function resetFormInputs() {
  topicInput.value = "";
  setDefaultInputDate();
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
  const users = getUserIds() || [];
  if (users.length === 0) {
    contentSection.textContent = "No user to display.";
    return;
  }

  emptyStorageOnFirstLoad(users);
  populateUsersDropDown(users);
  setDefaultInputDate();
});

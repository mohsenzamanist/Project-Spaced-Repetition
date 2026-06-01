// This is a placeholder file which shows how you can access functions defined in other files.
// It can be loaded into index.html.
// You can delete the contents of the file once you have understood how it works.
// Note that when running locally, in order to open a web page which uses modules, you must serve the directory over HTTP e.g. with https://www.npmjs.com/package/http-server
// You can't open the index.html file using a file:// URL.

import { getUserIds } from "./common.mjs";
import {
  calculateSpaces,
  formatReadableDate,
  formatOrdinalDay,
} from "./utils/utils.mjs";
import { addData, clearData, getData } from "./storage.mjs";

const userSelect = document.getElementById("user-select");
const contentSection = document.getElementById("content-section");
const form = document.getElementById("topic-form");
const topicInput = document.getElementById("topic");
const dateInput = document.getElementById("date");
const content = document.getElementById("content");
const clearBtn = document.getElementById("clear-button");

// eventListeners

clearBtn.addEventListener("click", function () {
  const userId = userSelect.value;
  if (!userId) {
    contentSection.innerHTML = "<p>Select a user.</p>";
    return;
  }
  clearData(userId);
  renderAgendas();
});

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const userId = userSelect.value;

  const topic = topicInput.value;
  const date = dateInput.value;
  // calculates revision dates and returns only dates
  const repetitionSpacesDates = calculateSpaces(date);

  addData(userId, { [topic]: repetitionSpacesDates });

  renderAgendas();
});

userSelect.addEventListener("change", function (e) {
  const userId = e.target.value;
  if (!userId) {
    content.classList.add("hidden");
    return;
  }

  const userAgendas = getData(userId);
  renderAgendas(userAgendas);
  content.classList.remove("hidden");
});

// functions
function renderAgendas() {
  const userId = userSelect.value;
  contentSection.innerHTML = "";
  const userAgendas = getData(userId);
  if (!userAgendas) {
    contentSection.textContent = "No agenda to display.";
    return;
  }

  // turns {topic:[date1,date2]} into [{topic,date1},{topic,date2}]
  const todayDate = new Date().toISOString().split("T")[0];
  const agendaDatePairs = userAgendas.flatMap((agenda) =>
    Object.entries(agenda).flatMap(([topic, dates]) =>
      dates
        .filter((date) => date >= todayDate)
        .map((date) => ({ topic, date })),
    ),
  );

  agendaDatePairs.sort((a, b) => a.date.localeCompare(b.date));

  const paragraphs = agendaDatePairs.map((agenda) => {
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
  const todayDate = new Date().toISOString().split("T")[0];
  dateInput.defaultValue = todayDate;
}

document.addEventListener("DOMContentLoaded", function () {
  const navigation = performance.getEntriesByType("navigation")[0];
  const users = getUserIds();
  // makes sure on first load storage is empty
  if (navigation.type === "navigate") users.forEach((user) => clearData(user));

  if (users.length === 0) {
    contentSection.textContent = "No user to display.";
    return;
  }
  populateUsersDropDown(users);
  setDefaultInputDate();
});

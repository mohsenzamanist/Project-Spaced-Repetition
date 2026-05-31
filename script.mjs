// This is a placeholder file which shows how you can access functions defined in other files.
// It can be loaded into index.html.
// You can delete the contents of the file once you have understood how it works.
// Note that when running locally, in order to open a web page which uses modules, you must serve the directory over HTTP e.g. with https://www.npmjs.com/package/http-server
// You can't open the index.html file using a file:// URL.

import { getUserIds } from "./common.mjs";
import { addData, clearData, getData } from "./storage.mjs";

const userSelect = document.getElementById("user-select");
const contentSection = document.getElementById("content-section");
const form = document.getElementById("topic-form");
const topicInput = document.getElementById("topic");
const dateInput = document.getElementById("date");
const content = document.getElementById("content");
const clearBtn = document.getElementById("clear-button");

let selectedUser;

// eventListeners

clearBtn.addEventListener("click", function () {
  if (!selectedUser) {
    contentSection.innerHTML = "<p>Select a user.</p>";
    return;
  }
  clearData(selectedUser);
});

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const topic = topicInput.value;
  const date = dateInput.value;
  const repetitionSpaces = calculateSpaces(date);
  const repetitionSpacesDates = calculateDates(repetitionSpaces);
  addData(selectedUser, { [topic]: repetitionSpacesDates });

  renderAgendas();
});

userSelect.addEventListener("change", function (e) {
  const userId = e.target.value;
  if (!userId) {
    content.classList.add("hidden");
    return;
  }
  selectedUser = userId;
  const userAgendas = getData(userId);
  renderAgendas(userAgendas);
  content.classList.remove("hidden");
});

// functions
function renderAgendas() {
  const userAgendas = getData(selectedUser);
  if (!userAgendas) {
    contentSection.textContent = "No agenda to display.";
    return;
  }

  // turns {topic:[date1,date2]} into [{topic,date1},{topic,date2}]
  const agendaDatePairs = [];
  userAgendas.forEach((agenda) => {
    for (let [topic, dates] of Object.entries(agenda)) {
      dates.forEach((date) => agendaDatePairs.push({ topic, date }));
    }
  });

  agendaDatePairs.sort((a, b) => a.date.localeCompare(b.date));

  const paragraphs = agendaDatePairs.map((agenda) => {
    const p = document.createElement("p");
    p.textContent = `${agenda.topic} : ${agenda.date}`;

    return p;
  });

  contentSection.append(...paragraphs);
}

function createAgendaDatePairs(userAgendas) {}

function sortAgendaDatePairs(agendaDatePairs) {}

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
  dateInput.value = todayDate;
}

function calculateSpaces(date) {
  const spaces = [
    { days: 7 },
    { months: 1 },
    { months: 3 },
    { months: 6 },
    { year: 1 },
  ];
  return spaces.map((space) => {
    const base = new Date(date);
    if (space.days) base.setDate(base.getDate() + space.days);
    if (space.months) base.setMonth(base.getMonth() + space.months);
    if (space.year) base.setFullYear(base.getFullYear() + space.year);

    return base;
  });
}

function calculateDates(repetitionSpaces) {
  return repetitionSpaces.map((space) => space.toISOString().split("T")[0]);
}

document.addEventListener("DOMContentLoaded", function () {
  const users = getUserIds();
  if (users.length === 0) {
    contentSection.textContent = "No user to display.";
    return;
  }
  populateUsersDropDown(users);
  setDefaultInputDate();
});

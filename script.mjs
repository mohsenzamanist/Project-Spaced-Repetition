// This is a placeholder file which shows how you can access functions defined in other files.
// It can be loaded into index.html.
// You can delete the contents of the file once you have understood how it works.
// Note that when running locally, in order to open a web page which uses modules, you must serve the directory over HTTP e.g. with https://www.npmjs.com/package/http-server
// You can't open the index.html file using a file:// URL.

import { getUserIds } from "./common.mjs";
import { addData, getData } from "./storage.mjs";

const userSelect = document.getElementById("user-select");
const contentSection = document.getElementById("content-section");
const form = document.getElementById("topic-form");
const topicInput = document.getElementById("topic");
const dateInput = document.getElementById("date");
const content = document.getElementById("content");

let selectedUser;

function calculateSpaces(date) {
  const oneWeek = new Date(date);
  oneWeek.setDate(oneWeek.getDate() + 7);

  const oneMonth = new Date(date);
  oneMonth.setMonth(oneMonth.getMonth() + 1);

  const threeMonth = new Date(date);
  threeMonth.setMonth(threeMonth.getMonth() + 1);

  const sixMonth = new Date(date);
  sixMonth.setMonth(sixMonth.getMonth() + 1);

  const oneYear = new Date(date);
  oneYear.setFullYear(oneYear.getFullYear() + 1);
  return [date, oneWeek, oneMonth, threeMonth, sixMonth, oneYear];
}

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const topic = topicInput.value;
  const date = dateInput.value;
  const repetitionSpaces = calculateSpaces(date);
  addData(selectedUser, { [topic]: repetitionSpaces });
  const userAgendas = getData(selectedUser);
  renderAgendas(userAgendas);
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

function renderAgendas(agendas) {
  if (!agendas) {
    contentSection.textContent = "No agenda to display.";
    return;
  }
  agendas.map((agenda) => {
    console.log(Object.keys(agenda)[0]);
  });
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

window.addEventListener("DOMContentLoaded", function () {
  const users = getUserIds();
  if (users.length === 0) {
    contentSection.textContent = "No user to display.";
    return;
  }
  populateUsersDropDown(users);
});

"use strict";
const newTask = document.querySelector(".new-task");
const addTask = document.querySelector("#add-task");
const toDoList = document.querySelector(".todos-list");
const doneList = document.querySelector(".done-list");
const deleteBtn = document.querySelector(".delete-btn");
const doneBtn = document.querySelector(".done-btn");
const modal = document.querySelector(".modal");
const editedInput = document.querySelector(".edited-input");
let html, ptext;
let listItem;
//

const addNewTask = function (e) {
  e.preventDefault();
  if (newTask.value === "") alert("insert a proper task");
  if (newTask.value !== "") {
    html = `
  <li class="to-do-item">
            <input type="checkbox" class="marker"/>
            <p class="the-task">${newTask.value}</p>
            <div class="buttons">
              <button class="btn edit-btn">edit</button>
              <button class="btn delete-btn">delete</button>
            </div>
          </li>
  `;
    saveLocalTodos(newTask.value);
    newTask.value = "";
    toDoList.insertAdjacentHTML("afterbegin", html);
  }
};

const moveElement = function (task) {
  if (task.checked) {
    toDoList.removeChild(task.parentNode);
    doneList.appendChild(task.parentNode);
    console.log(task.nextSibling.nextSibling.innerText);
    updateCompletionLS(task.nextSibling.nextSibling.innerText, task.checked);
  } else {
    doneList.removeChild(task.parentNode);
    toDoList.appendChild(task.parentNode);
    console.log(task.nextSibling.nextSibling.innerText);
    updateCompletionLS(task.nextSibling.nextSibling.innerText, task.checked);
  }
};
const displayModal = function () {
  modal.classList.remove("hidden");
};
const hideModal = function () {
  modal.classList.add("hidden");
};
const updateValue = function (e) {
  e.preventDefault();
  updateTaskLS(ptext.innerText, editedInput.value);
  ptext.innerText = editedInput.value;
  hideModal();
};
const deleteItem = function (fromWhere, what) {
  if (confirm("are you sure?")) {
    deleteFromLS(what.querySelector(".the-task").innerText);
    fromWhere.removeChild(what);
  }
};
addTask.addEventListener("click", addNewTask);
toDoList.addEventListener("click", function (e) {
  if (e.target.classList.contains("marker")) {
    e.target.addEventListener("change", moveElement(e.target));
  }
  if (e.target.classList.contains("the-task")) {
    e.target.previousSibling.previousSibling.checked = true;
    e.target.previousSibling.previousSibling.addEventListener(
      "change",
      moveElement(e.target.previousSibling.previousSibling)
    );
  }
  if (e.target.classList.contains("edit-btn")) {
    displayModal();
    listItem = e.target.parentNode.parentNode;
    ptext = listItem.querySelector(".the-task");

    editedInput.value = ptext.innerText;
  }
  if (e.target.classList.contains("delete-btn")) {
    listItem = e.target.parentNode.parentNode;
    deleteItem(toDoList, listItem);
    console.log(listItem.querySelector(".the-task").innerText);
  }
});
doneList.addEventListener("click", function (e) {
  if (e.target.classList.contains("marker")) {
    e.target.addEventListener("change", moveElement(e.target));
  }
  if (e.target.classList.contains("the-task")) {
    e.target.previousSibling.previousSibling.checked = false;
    e.target.previousSibling.previousSibling.addEventListener(
      "change",
      moveElement(e.target.previousSibling.previousSibling)
    );
  }
  if (e.target.classList.contains("edit-btn")) {
    displayModal();
    listItem = e.target.parentNode.parentNode;
    ptext = listItem.querySelector(".the-task");
    editedInput.value = ptext.innerText;
  }
  if (e.target.classList.contains("delete-btn")) {
    listItem = e.target.parentNode.parentNode;
    deleteItem(doneList, listItem);
  }
});
doneBtn.addEventListener("click", updateValue);

function saveLocalTodos(taskFromUi) {
  //check
  let tasks;
  if (localStorage.getItem("tasks") === null) {
    tasks = [];
  } else {
    tasks = JSON.parse(localStorage.getItem("tasks"));
  }
  tasks.push({ task: `${taskFromUi}`, completed: false });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}
function getTodos() {
  //check
  let tasks;
  if (localStorage.getItem("tasks") === null) {
    tasks = [];
  } else {
    tasks = JSON.parse(localStorage.getItem("tasks"));
  }
  tasks.forEach((task) => {
    if (task.completed === false) {
      html = `
  <li class="to-do-item">
            <input type="checkbox" class="marker"/>
            <p class="the-task">${task.task}</p>
            <div class="buttons">
              <button class="btn edit-btn">edit</button>
              <button class="btn delete-btn">delete</button>
            </div>
          </li>
  `;
      toDoList.insertAdjacentHTML("afterbegin", html);
    }
    if (task.completed === true) {
      html = `
  <li class="to-do-item">
            <input type="checkbox" class="marker"/>
            <p class="the-task">${task.task}</p>
            <div class="buttons">
              <button class="btn edit-btn">edit</button>
              <button class="btn delete-btn">delete</button>
            </div>
          </li>
  `;
      doneList.insertAdjacentHTML("afterbegin", html);
      doneList.querySelector(".marker").checked = true;
    }
  });
}
getTodos();
function updateCompletionLS(value, bool) {
  //check
  let tasks;
  if (localStorage.getItem("tasks") === null) {
    tasks = [];
  } else {
    tasks = JSON.parse(localStorage.getItem("tasks"));
  }
  tasks.forEach((task) => {
    if (task.task === value) task.completed = bool;
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}
function updateTaskLS(oldTask, updatedTask) {
  let tasks;
  if (localStorage.getItem("tasks") === null) {
    tasks = [];
  } else {
    tasks = JSON.parse(localStorage.getItem("tasks"));
  }
  tasks.forEach((task) => {
    if (task.task === oldTask) task.task = updatedTask;
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}
function deleteFromLS(value) {
  let tasks;
  console.log(value);
  if (localStorage.getItem("tasks") === null) {
    tasks = [];
  } else {
    tasks = JSON.parse(localStorage.getItem("tasks"));
  }
  tasks.forEach((task) => {
    console.log(task);
    if (task.task === value) tasks.splice(tasks.indexOf(task), 1);
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

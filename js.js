let stars = document.querySelector("#stars");
let moon = document.querySelector("#moon");
let mountains_behind = document.querySelector("#mountains_behind");
let mountains_front = document.querySelector("#mountains_front");
let text = document.querySelector("#text");
let btn = document.querySelector(".btn");
let header = document.querySelector("header");

window.addEventListener("scroll", function () {
  let value = window.scrollY;
  stars.style.left = value * 0.25 + "px";
  moon.style.top = value * 1.05 + "px";
  mountains_behind.style.top = value * 0.5 + "px";
  mountains_front.style.top = value * 0 + "px";
  text.style.marginRight = value * 4 + "px";
  text.style.marginTop = value * 1.5 + "px";
  btn.style.marginTop = value * 1.5 + "px";
  header.style.top = value * 0.5 + "px";
});

document.addEventListener('DOMContentLoaded', (event) => {
  loadTasks();
});

function addTask() {
  let taskInput = document.getElementById('taskInput');
  let taskText = taskInput.value.trim();
  if (taskText === "") {
      alert("Please enter a task.");
      return;
  }

  let taskList = document.getElementById('taskList');
  let li = document.createElement('li');
  li.textContent = taskText;

  let deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  deleteButton.className = 'delete';
  deleteButton.onclick = function() {
      li.remove();
      saveTasks();
  };

  li.appendChild(deleteButton);
  taskList.appendChild(li);

  taskInput.value = '';
  saveTasks();
}

function saveTasks() {
  let tasks = [];
  let taskListItems = document.querySelectorAll('#taskList li');
  taskListItems.forEach(item => {
      tasks.push(item.textContent.replace('Delete', '').trim());
  });
  document.cookie = "tasks=" + JSON.stringify(tasks) + "; path=/";
}

function loadTasks() {
  let cookies = document.cookie.split(';');
  for (let cookie of cookies) {
      let [name, value] = cookie.split('=');
      name = name.trim();
      if (name === 'tasks') {
          let tasks = JSON.parse(decodeURIComponent(value));
          let taskList = document.getElementById('taskList');
          tasks.forEach(task => {
              let li = document.createElement('li');
              li.textContent = task;

              let deleteButton = document.createElement('button');
              deleteButton.textContent = 'Delete';
              deleteButton.className = 'delete';
              deleteButton.onclick = function() {
                  li.remove();
                  saveTasks();
              };

              li.appendChild(deleteButton);
              taskList.appendChild(li);
          });
      }
  }
}

document.addEventListener('DOMContentLoaded', (event) => {
  loadChecklistTasks();
  let checkboxes = document.querySelectorAll('#checklistTaskList input[type="checkbox"]');
  checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', function() {
          saveChecklistTasks();
      });
  });
});

function addChecklistTask() {
  let taskInput = document.getElementById('checklistTaskInput');
  let taskText = taskInput.value.trim();
  if (taskText === "") {
      alert("Please enter an item.");
      return;
  }

  let taskList = document.getElementById('checklistTaskList');
  let li = document.createElement('li');

  let checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.onclick = function() {
      li.classList.toggle('completed');
      saveChecklistTasks();
  };

  let textNode = document.createTextNode(taskText);

  let deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  deleteButton.className = 'delete';
  deleteButton.onclick = function() {
      li.remove();
      saveChecklistTasks();
  };

  li.appendChild(checkbox);
  li.appendChild(textNode);
  li.appendChild(deleteButton);
  taskList.appendChild(li);

  taskInput.value = '';
  saveChecklistTasks();
}

function saveChecklistTasks() {
  let tasks = [];
  let taskListItems = document.querySelectorAll('#checklistTaskList li');
  taskListItems.forEach(item => {
      let task = {
          text: item.childNodes[1].nodeValue.trim(),
          completed: item.querySelector('input[type="checkbox"]').checked
      };
      tasks.push(task);
  });
  document.cookie = "checklistTasks=" + JSON.stringify(tasks) + "; path=/";
}

function loadChecklistTasks() {
  let cookies = document.cookie.split(';');
  for (let cookie of cookies) {
      let [name, value] = cookie.split('=');
      name = name.trim();
      if (name === 'checklistTasks') {
          let tasks = JSON.parse(decodeURIComponent(value));
          let taskList = document.getElementById('checklistTaskList');
          tasks.forEach(task => {
              let li = document.createElement('li');
              if (task.completed) {
                  li.classList.add('completed');
              }

              let checkbox = document.createElement('input');
              checkbox.type = 'checkbox';
              checkbox.checked = task.completed;
              checkbox.onclick = function() {
                  li.classList.toggle('completed');
                  saveChecklistTasks();
              };

              let textNode = document.createTextNode(task.text);

              let deleteButton = document.createElement('button');
              deleteButton.textContent = 'Delete';
              deleteButton.className = 'delete';
              deleteButton.onclick = function() {
                  li.remove();
                  saveChecklistTasks();
              };

              li.appendChild(checkbox);
              li.appendChild(textNode);
              li.appendChild(deleteButton);
              taskList.appendChild(li);
          });
      }
  }
}

function deleteTask(button) {
  let li = button.parentElement;
  li.remove();
  saveChecklistTasks();
}


// Hungarian

function convertToHTML() {
  let text = document.getElementById("inputText").value;
  let lines = text.split("\n");

  let htmlLines = [];
  let inOrderedList = false;
  let inUnorderedList = false;

  lines.forEach((line, index) => {
    const trimmedLine = line.trim();
    const prevLine = index > 0 ? lines[index - 1].trim() : "";
    const nextLine = index < lines.length - 1 ? lines[index + 1].trim() : "";

    // Detect unordered list items
    if (trimmedLine.startsWith("• ")) {
      if (!inUnorderedList) {
        if (inOrderedList) {
          htmlLines.push("</ol>");
          htmlLines.push(""); // Add empty line after closing ordered list
          inOrderedList = false;
        }
        if (prevLine !== "") {
          htmlLines.push(""); // Add empty line before opening unordered list
        }
        htmlLines.push("<ul>");
        inUnorderedList = true;
      }
      htmlLines.push(`<li>${trimmedLine.slice(2)}</li>`);
    }
    // Detect ordered list items
    else if (/^\d+\.\s/.test(trimmedLine)) {
      if (!inOrderedList) {
        if (inUnorderedList) {
          htmlLines.push("</ul>");
          htmlLines.push(""); // Add empty line after closing unordered list
          inUnorderedList = false;
        }
        if (prevLine !== "") {
          htmlLines.push(""); // Add empty line before opening ordered list
        }
        htmlLines.push("<ol>");
        inOrderedList = true;
      }
      htmlLines.push(`<li>${trimmedLine.replace(/^\d+\.\s/, "")}</li>`);
    }
    // Detect headings with specific markers
    else if (trimmedLine.startsWith("# ")) {
      if (inOrderedList) {
        htmlLines.push("</ol>");
        htmlLines.push(""); // Add empty line after closing ordered list
        inOrderedList = false;
      }
      if (inUnorderedList) {
        htmlLines.push("</ul>");
        htmlLines.push(""); // Add empty line after closing unordered list
        inUnorderedList = false;
      }
      if (prevLine !== "") {
        htmlLines.push(""); // Add empty line before heading
      }
      htmlLines.push(`<h1>${trimmedLine.slice(2)}</h1>`);
      if (nextLine !== "") {
        htmlLines.push(""); // Add empty line after heading
      }
    }
    else if (trimmedLine.startsWith("## ")) {
      if (inOrderedList) {
        htmlLines.push("</ol>");
        htmlLines.push(""); // Add empty line after closing ordered list
        inOrderedList = false;
      }
      if (inUnorderedList) {
        htmlLines.push("</ul>");
        htmlLines.push(""); // Add empty line after closing unordered list
        inUnorderedList = false;
      }
      if (prevLine !== "") {
        htmlLines.push(""); // Add empty line before heading
      }
      htmlLines.push(`<h2>${trimmedLine.slice(3)}</h2>`);
      if (nextLine !== "") {
        htmlLines.push(""); // Add empty line after heading
      }
    }
    else if (trimmedLine.startsWith("### ")) {
      if (inOrderedList) {
        htmlLines.push("</ol>");
        htmlLines.push(""); // Add empty line after closing ordered list
        inOrderedList = false;
      }
      if (inUnorderedList) {
        htmlLines.push("</ul>");
        htmlLines.push(""); // Add empty line after closing unordered list
        inUnorderedList = false;
      }
      if (prevLine !== "") {
        htmlLines.push(""); // Add empty line before heading
      }
      htmlLines.push(`<h3>${trimmedLine.slice(4)}</h3>`);
      if (nextLine !== "") {
        htmlLines.push(""); // Add empty line after heading
      }
    }
    // Detect headings based on heuristic
    else if (/^[A-ZÁÉÍÓÖŐÚÜŰ]/.test(trimmedLine) && trimmedLine.split(" ").length <= 6 && !trimmedLine.endsWith(".")) {
      if (inOrderedList) {
        htmlLines.push("</ol>");
        htmlLines.push(""); // Add empty line after closing ordered list
        inOrderedList = false;
      }
      if (inUnorderedList) {
        htmlLines.push("</ul>");
        htmlLines.push(""); // Add empty line after closing unordered list
        inUnorderedList = false;
      }
      if (prevLine !== "") {
        htmlLines.push(""); // Add empty line before heading
      }
      htmlLines.push(`<h2>${trimmedLine}</h2>`);
      if (nextLine !== "") {
        htmlLines.push(""); // Add empty line after heading
      }
    }
    // Treat as paragraph
    else {
      if (inOrderedList) {
        htmlLines.push("</ol>");
        htmlLines.push(""); // Add empty line after closing ordered list
        inOrderedList = false;
      }
      if (inUnorderedList) {
        htmlLines.push("</ul>");
        htmlLines.push(""); // Add empty line after closing unordered list
        inUnorderedList = false;
      }
      if (trimmedLine !== "") {
        htmlLines.push(`<p>${trimmedLine}</p>`);
      }
    }
  });

  // Close any remaining open lists
  if (inOrderedList) {
    htmlLines.push("</ol>");
    htmlLines.push(""); // Add empty line after closing ordered list
  }
  if (inUnorderedList) {
    htmlLines.push("</ul>");
    htmlLines.push(""); // Add empty line after closing unordered list
  }

  let htmlText = htmlLines.join("\n");
  document.getElementById("outputHTML").textContent = htmlText;
}

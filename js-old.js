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
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

function convertToHTML() {
  let text = document.getElementById("inputText").value;
  let lines = text.split("\n");

  let htmlLines = [];
  let inOrderedList = false;
  let inUnorderedList = false;
  let isListItem = false;

  lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      const normalizedLine = trimmedLine.replace(/\s+/g, ' ');

      if (normalizedLine === "") {
          // Handle empty lines only within lists and if not preceded by a list item
          if ((inOrderedList || inUnorderedList) && !isListItem) {
              htmlLines.push(`<li></li>`);
              isListItem = true;
          }
      } else {
          // Handle unordered list items
          if (normalizedLine.startsWith("•")) {
              if (!inUnorderedList) {
                  if (inOrderedList) {
                      htmlLines.push("</ol>");
                      inOrderedList = false;
                  }
                  htmlLines.push("<ul>");
                  inUnorderedList = true;
              }
              htmlLines.push(`<li>${normalizedLine.slice(1).trim()}</li>`);
              isListItem = true;
          }
          // Handle ordered list items
          else if (/^(\d+)\.(.*)/.test(normalizedLine)) {
            if (!inOrderedList) {
                if (inUnorderedList) {
                    htmlLines.push("</ul>");
                    inUnorderedList = false;
                }
                htmlLines.push("<ol>");
                inOrderedList = true;
            }
            // Extract number and the rest of the text (glued or not)
            const match = normalizedLine.match(/^(\d+)\.(.*)/);
            const listItemText = match[2].trim(); // Get the text part after the number and period
            htmlLines.push(`<li>${listItemText}</li>`);
            isListItem = true;
        }
        
          // Handle headings with varying levels
          else if (/^#+\s/.test(normalizedLine)) {
              const headingLevel = normalizedLine.match(/^#+/)[0].length;
              htmlLines.push(`<h${headingLevel}>${normalizedLine.slice(headingLevel + 1).trim()}</h${headingLevel}>`);
              isListItem = false;
          }
          // Treat as paragraph
          else {
              // Explicitly close any open lists
              if (inOrderedList) {
                  htmlLines.push("</ol>\n"); // Add newline after closing the ordered list
                  inOrderedList = false;
              }
              if (inUnorderedList) {
                  htmlLines.push("</ul>\n"); // Add newline after closing the unordered list
                  inUnorderedList = false;
              }
              if (normalizedLine !== "") {
                  // Add paragraph tags only if it is not a heading, list item, or list tag
                  if (!/<h\d>/.test(normalizedLine) && !/<ul>|<ol>|<\/ul>|<\/ol>|<li>/.test(normalizedLine)) {
                      htmlLines.push(`<p>${normalizedLine.trim()}</p>`);
                  } else {
                      htmlLines.push(normalizedLine.trim()); // Directly push headings, list tags, and list items without wrapping
                  }
              }
              isListItem = false;
          }
      }
  });

  // Close any remaining open lists
  if (inOrderedList) {
      htmlLines.push("</ol>\n"); // Add newline after closing the ordered list
  }
  if (inUnorderedList) {
      htmlLines.push("</ul>\n"); // Add newline after closing the unordered list
  }

  // Format HTML output: ensure each element starts on a new line with one blank line between elements
  let htmlText = htmlLines.join("\n\n") // Ensure each element starts on a new line with one blank line between elements
      .replace(/>\s*([^<\s][^<]*?)\s*</g, '>$1<') // Remove extra whitespace inside tags
      .replace(/<\/li>\s*\n\s*/g, '</li>\n') // Ensure no blank line after </li>
      .replace(/\n\s*\n+(?=<p>)/g, '\n') // Ensure no blank line after </p>
      .replace(/^\s*<ul>\s*/m, '<ul>\n') // Remove blank line immediately after <ul> (if any)
      .replace(/^\s*<ol>\s*/m, '<ol>\n') // Remove blank line immediately after <ol> (if any)
      .replace(/(<li>)/g, '     $1') // Add 5 spaces before each <li> tag
      .replace(/^\s*(<ul>)/m, '\n$1') // Add blank line before <ul>
      .replace(/(<\/ul>)\s*/g, '$1\n\n') // Add blank line after </ul>
      .replace(/^\s*(<ol>)/m, '\n$1') // Add blank line before <ol>
      .replace(/(<\/ol>)\s*/g, '$1\n\n'); // Add blank line after </ol>

  // Display the resulting HTML
  document.getElementById("outputHTML").textContent = htmlText;
}


// ******************************* Copy to clipboard ******************************* // 

function copyToClipboard() {
  let outputHTML = document.getElementById("outputHTML", "outputCode");
  let range = document.createRange();
  range.selectNode(outputHTML);
  window.getSelection().removeAllRanges();
  window.getSelection().addRange(range);
  try {
    document.execCommand("copy");

    // Create a temporary element for the animation
    let copyNotification = document.createElement("div");
    copyNotification.innerText = "Copied!";
    copyNotification.style.position = "fixed";
    copyNotification.style.bottom = "20px";
    copyNotification.style.right = "20px";
    copyNotification.style.backgroundColor = "#7130c3";
    copyNotification.style.color = "white";
    copyNotification.style.padding = "10px";
    copyNotification.style.borderRadius = "5px";
    copyNotification.style.opacity = "0";
    copyNotification.style.transition = "opacity 0.5s ease";

    document.body.appendChild(copyNotification);

    // Trigger the animation
    setTimeout(() => {
      copyNotification.style.opacity = "1";
      setTimeout(() => {
        copyNotification.style.opacity = "0";
        setTimeout(() => {
          document.body.removeChild(copyNotification);
        }, 500);
      }, 2000);
    }, 0);

  } catch (err) {
    console.error("Failed to copy text", err);
  }
  window.getSelection().removeAllRanges(); // Clear selection
}

// ******************************* Remove Text ******************************* // 

function clearText() {
  document.getElementById("inputText").value = "";
}

// HTML CSS comm removing //

// Function to clear both the input and output areas
function clearInputAndOutput() {
  document.getElementById("inputCode").value = ""; // Clear input textarea
  document.getElementById("outputCode").textContent = ""; // Clear output pre element
}

// Function to remove HTML, CSS, and JavaScript comments
function removeComments() {
  const codeInput = document.getElementById('inputCode').value; // Get the input code

  // Remove HTML comments (<!-- -->)
  let cleanedCode = codeInput.replace(/<!--[\s\S]*?-->/g, '');

  // Remove CSS comments (/* */) and JavaScript multi-line comments (/* */)
  cleanedCode = cleanedCode.replace(/\/\*[\s\S]*?\*\//g, '');

  // Remove JavaScript single-line comments (//)
  // Ensure single-line comments are only removed if not inside script tags
  cleanedCode = cleanedCode.replace(/(?:^|\s)\/\/.*$/gm, '');

  // Remove extra lines left by comment removal
  cleanedCode = cleanedCode.replace(/^\s*[\r\n]/gm, '');

  // Display the cleaned code in the output area
  document.getElementById('outputCode').textContent = cleanedCode;
}
// Function to copy the cleaned code to clipboard
function copyCleanedCode() {
  const outputCode = document.getElementById('outputCode').textContent; // Get cleaned code

  navigator.clipboard.writeText(outputCode).then(function() {
    // Create a temporary element for the "Copied!" notification
    let copyNotification = document.createElement("div");
    copyNotification.innerText = "Copied!";
    copyNotification.style.position = "fixed";
    copyNotification.style.bottom = "20px";
    copyNotification.style.right = "20px";
    copyNotification.style.backgroundColor = "#7130c3";
    copyNotification.style.color = "white";
    copyNotification.style.padding = "10px";
    copyNotification.style.borderRadius = "5px";
    copyNotification.style.opacity = "0";
    copyNotification.style.transition = "opacity 0.5s ease";
    copyNotification.style.zIndex = "1000"; // Ensure it appears above other content

    document.body.appendChild(copyNotification);

    // Trigger the animation
    setTimeout(() => {
      copyNotification.style.opacity = "1";
      setTimeout(() => {
        copyNotification.style.opacity = "0";
        setTimeout(() => {
          document.body.removeChild(copyNotification);
        }, 500); // Delay for fade-out to complete
      }, 2000); // Duration for the notification to be visible
    }, 0); // Initial delay to ensure animation starts after append

  }, function() {
    alert("Failed to copy code.");
  });
}

// Removing duplicates and Query strings

// Function to remove duplicate lines and lines containing "?"
function cleanCode() {
  let text = document.getElementById("inputCode").value;
  let lines = text.split("\n");

  // Create a Set to track unique lines and filter out lines containing "?"
  let uniqueLines = new Set();

  lines.forEach(line => {
      let trimmedLine = line.trim();

        // Check if the line contains '%' and add the special comment
        if (trimmedLine.includes('%')) {
          trimmedLine += ' // Special Symbol';
      }

      // Add line to set only if it does not contain "?"
      if (!trimmedLine.includes('?')) {
          uniqueLines.add(trimmedLine);
      }
  });

  // Convert Set back to an array and join to form the cleaned text
  let cleanedText = Array.from(uniqueLines).join("\n");

  // Display the resulting cleaned text
  document.getElementById("outputCode").textContent = cleanedText;
}

// Function to clear both input and output areas
function clearInputAndOutput() {
  document.getElementById("inputCode").value = '';
  document.getElementById("outputCode").textContent = 'Your output will be displayed here !';
}
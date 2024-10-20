// Selectors

const notification = document.createElement("div");
const copyNotification = document.createElement("div");
const taskInput = document.getElementById('checklistTaskInput');
const taskList = document.getElementById('checklistTaskList');
const taskListItems = document.querySelectorAll('#checklistTaskList li');

// ******************************** Notifications ********************************** //

function showNotificationError(message) {
  notification.innerText = message;
  notification.setAttribute("role", "alert");
  notification.style.position = "fixed";
  notification.style.top = "20px";
  notification.style.left = "20px";
  notification.style.backgroundColor = "#dc3545";
  notification.style.color = "white";
  notification.style.padding = "10px 20px";
  notification.style.borderRadius = "5px";
  notification.style.opacity = "0";
  notification.style.transition = "opacity 0.5s ease, transform 0.5s ease";
  notification.style.transform = "translateY(20px)";

  document.body.appendChild(notification);

  setTimeout(() => {
      notification.style.opacity = "1";
      notification.style.transform = "translateY(0)";

      setTimeout(() => {
          notification.style.opacity = "0";
          notification.style.transform = "translateY(20px)";
          setTimeout(() => {
              document.body.removeChild(notification);
          }, 500);
      }, 2000);
  }, 0);
}

function showNotificationSuccess(message) {
    copyNotification.innerText = message;
    copyNotification.style.position = "fixed";
    copyNotification.style.top = "20px";
    copyNotification.style.left = "20px";
    copyNotification.style.backgroundColor = "#4CAF50";
    copyNotification.style.color = "white";
    copyNotification.style.padding = "10px";
    copyNotification.style.borderRadius = "5px";
    copyNotification.style.opacity = "0";
    copyNotification.style.transition = "opacity 0.5s ease";
    copyNotification.style.zIndex = "1000";

    document.body.appendChild(copyNotification);

    setTimeout(() => {
      copyNotification.style.opacity = "1";
      setTimeout(() => {
        copyNotification.style.opacity = "0";
        setTimeout(() => {
          document.body.removeChild(copyNotification);
        }, 500);
      }, 2000);
    }, 0); 
}

// =============================== Checklist Tasks ================================= //

function addChecklistTask() {
  let taskText = taskInput.value.trim();

    if (taskText === "") {
      showNotificationError("Please enter a task!");
      return;
  }

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

document.addEventListener('DOMContentLoaded', () => {
  loadChecklistTasks();
  let checkboxes = document.querySelectorAll('#checklistTaskList input[type="checkbox"]');
  checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', function() {
          saveChecklistTasks();
      });
  });
});

function deleteTask(button) {
  let li = button.parentElement;
  li.remove();
  saveChecklistTasks();
}

// *********************************** Convert to HTML ******************************************* //

function convertToHTML() {
  let text = document.getElementById("inputText").value;
  let lines = text.split("\n");

  if (text === "") {
    showNotificationError("Please enter a Text!");
    return;
} else {
  document.querySelector('.text-to-html').classList.add('hide-after');
}

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
  showNotificationSuccess('Converted!')
}


// ******************************* Copy to clipboard TEXT TO HTML ******************************* // 

function copyToClipboard() {
  let outputHTML = document.getElementById("outputHTML", "outputCode");
  if (outputHTML.textContent.trim() === "") {
    showNotificationError("Nothing to Copy!");
    return;
}
  let range = document.createRange();
  range.selectNode(outputHTML);
  window.getSelection().removeAllRanges();
  window.getSelection().addRange(range);
  try {
    document.execCommand("copy");

    showNotificationSuccess('Copied!')

  } catch (err) {
    console.error("Failed to copy text", err);
  }
  window.getSelection().removeAllRanges(); // Clear selection

}

// *********************************** Comments Removing Func ******************************************* //

function removeComments() {
  const codeInput = document.getElementById('inputCode').value; 

  if (codeInput === "") {
    showNotificationError("Nothing to Remove!");
    return;
} else {
  document.querySelector('.comms-rem').classList.add('hide-after');
}

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
  showNotificationSuccess('Removed!')
}

function copyCleanedCode() {
  const outputCode = document.getElementById('outputCode').textContent;

  if (outputCode === "") {
    showNotificationError("Nothing to Copy!");
    return;
}

  navigator.clipboard.writeText(outputCode).then(function() {
    showNotificationSuccess('Copied!')

  }, function() {
    alert("Failed to copy code.");
  });
}

// *********************************** Htaccess Function ******************************************* //

function cleanCode() {
  let text = document.getElementById("inputCode").value;

  if (text === "") {
    showNotificationError("Nothing to Clean!");
    return;
  } else {
    document.querySelector('.htaccess').classList.add('hide-after');
  }

  let lines = text.split("\n");

  // Normalize lines by trimming whitespace and ensuring consistent line breaks
  lines = lines.map(line => line.trim().replace(/\r\n|\r|\n/g, '\n'));

  // Filter out empty lines
  lines = lines.filter(line => line !== '');

  let uniqueLines = new Set();
  let queryCount = 0;
  let duplicateCount = 0;
  let specialSymbolCount = 0;
  let subdomainCount = 0;

  let lineOccurrences = {};
  let countedSpecialSymbol = new Set(); // Track unique lines with '%' already counted
  let subdomains = new Set(); // Track subdomains that were removed
  let domainCount = {}; // Track the occurrences of each domain

  // Regular expression to detect URLs and capture the slug part
  const urlRegex = /^(https?:\/\/)?(www\.)?([^\/]+)(\/.*)?/i;

  // First pass: Count domains
  lines.forEach(line => {
    const match = line.match(urlRegex);
    if (match) {
      const domain = match[3];
      if (!domainCount[domain]) {
        domainCount[domain] = 0;
      }
      domainCount[domain]++;
    }
  });

  // Find the most frequent domain (primary domain)
  const primaryDomain = Object.keys(domainCount).reduce((a, b) => domainCount[a] > domainCount[b] ? a : b);

  lines.forEach(line => {
    let trimmedLine = line.trim();

    // Check if the line contains a query string (?)
    if (trimmedLine.includes('?')) {
      queryCount++;
      return; // Skip lines containing queries
    }

    // Check for URLs and capture the slug
    const match = trimmedLine.match(urlRegex);
    if (match) {
      const domain = match[3];  // The domain (e.g., "alo.com" or "twitch.tv")
      let slug = match[4] || '/';  // The slug part (or '/' if not present)

      // If the domain is the primary domain, process the slug
      if (domain !== primaryDomain) {
        // Count different domains as subdomains
        subdomainCount++;
        subdomains.add(domain); // Track removed subdomains
        return;  // Skip lines with subdomains
      }

      // Handle URL-encoded characters and special symbols (%) in the slug
      if (/%[0-9A-Fa-f]{2}/.test(slug)) {
        try {
          let decodedSlug = decodeURIComponent(slug);
          slug = `"${decodedSlug}"`; // Wrap only the slug in double quotes

          // If this slug contains %, increment special symbol count
          if (!countedSpecialSymbol.has(slug)) {
            specialSymbolCount++;
            countedSpecialSymbol.add(slug);
          }
        } catch (e) {
          console.warn(`Failed to decode slug: ${slug}`);
        }
      }

      // Construct the final Redirect 301 line with the processed slug
      trimmedLine = `Redirect 301 ${slug} /`;
    }

    // Track line occurrences to count duplicates
    if (lineOccurrences[trimmedLine]) {
      duplicateCount++;
    } else {
      lineOccurrences[trimmedLine] = 1;
    }

    // Add the processed line to the uniqueLines set
    uniqueLines.add(trimmedLine);
  });

  // Now count duplicates correctly and populate the unique lines set
  for (let line in lineOccurrences) {
    let occurrences = lineOccurrences[line];
    if (occurrences > 1) {
      duplicateCount += occurrences - 1; // Count only additional occurrences as duplicates
    }
  }

  let cleanedText = Array.from(uniqueLines)
    .filter(line => line !== '')
    .join("\n");

  const summaryText = `
    <p class="color" style="margin-top: -45px;">Queries removed ( ? ) : <span>${queryCount}</span>.</p>
    <p class="color">Duplicates removed : <span>${duplicateCount}</span>.</p>
    <p class="color">Lines with ( % ) : <span>${specialSymbolCount}</span>.</p>
    <p class="color">Primary Domain : <span>${primaryDomain}</span></p>
    <p class="color">Subdomains removed (dups included) : <span>${subdomainCount}</span>. Subdomains: <span>${Array.from(subdomains).join(', ')}</span></p>
  `;

  document.getElementById("outputCode").innerHTML = summaryText + `<hr class="line-thru">${cleanedText}`;

  showNotificationSuccess('Formated!')
}

document.getElementById("sortButton").addEventListener("click", sortRedirectLines);

function sortRedirectLines() {
  let outputCodeElement = document.getElementById("outputCode");
  let outputHTML = outputCodeElement.innerHTML;

  if (outputHTML.trim() === "") {
    showNotificationError("Nothing to Sort!");
    return;
  }

  document.querySelector('.htaccess').classList.add('hide-after');

  let [summaryPart, redirectPart] = outputHTML.split('<hr class="line-thru">');

  if (!redirectPart) {
    showNotificationError("No Redirect 301 lines to sort!");
    return;
  }

  let redirectLines = redirectPart.split("\n");
  let sortedRedirectLines = redirectLines
  .filter(line => line.includes("Redirect 301"))
  .sort((a, b) => {
    const aPath = a.split(" ")[2].replace(/^"|"$/g, '');
    const bPath = b.split(" ")[2].replace(/^"|"$/g, '');
    return bPath.localeCompare(aPath, 'en', { sensitivity: 'base' });
  });

  let cleanedRedirectText = sortedRedirectLines.join("\n");

  outputCodeElement.innerHTML = `${summaryPart}<hr class="line-thru">${cleanedRedirectText}`;
  showNotificationSuccess('Sorted')

  let existingMessage = document.getElementById("sortMessage");
  if (existingMessage) {
    existingMessage.remove();
  }

let pTag = document.createElement("p");
pTag.id = "sortMessage";
pTag.innerHTML = `Make sure to redirect all links with a high number of referring domains to the <span class="warning">Homepage</span> if you have a <span class="warning">Sitemap</span>`;

let msgDiv = document.getElementById("msg");
msgDiv.appendChild(pTag);
}

// ******************************* Remove Text HTML ******************************* // 

function clearText() {
  let inputElement = document.getElementById("inputText");
  let outputElement = document.getElementById("outputHTML");

  document.querySelector('.text-to-html').classList.remove('hide-after');

  // Check if the input value is already empty
  if (inputElement.value === "") {
      showNotificationError("Already Clear!");
      return; 
  }

  // Clear the input value if it's not empty
  inputElement.value = "";
  outputElement.textContent = ""; 
  showNotificationSuccess('Cleared!')
}

// *********************************** Comments inputs clear ******************************************* //

function clearInputAndOutput() {
  let inputElement2 = document.getElementById("inputCode");
  let outputElement2 = document.getElementById("outputCode");


  document.querySelector('.comms-rem').classList.remove('hide-after');

  if (inputElement2.value === "") {
    showNotificationError("Already Clear!");

    return;
}
  inputElement2.value = ""; 
  outputElement2.textContent = ""; 
  showNotificationSuccess('Cleared!')
}


// *********************************** Htaccess inputs clear ******************************************* //

function clearFunc() {
  let inputElement2 = document.getElementById("inputCode");
  let outputElement2 = document.getElementById("outputCode");
  let msgDiv = document.getElementById("msg");

  document.querySelector('.htaccess').classList.remove('hide-after');

  if (inputElement2.value === "") {
    showNotificationError("Already Clear!");
    return;
  }

  inputElement2.value = ""; 
  outputElement2.innerHTML = "";

  let existingMessage = document.getElementById("sortMessage");
  if (existingMessage) {
    msgDiv.removeChild(existingMessage);
  }

  showNotificationSuccess('Cleared!');
}

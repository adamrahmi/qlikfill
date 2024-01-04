// content.js

let buttonsContainer; // Declare buttonsContainer in a wider scope

function createButtonsContainer(textarea) {
  console.log("Creating buttons container for textarea:", textarea);
  buttonsContainer = document.createElement("div");
  buttonsContainer.className = "extension-buttons-container";
  
  // Add some margin to create space between the textarea and the buttons
  buttonsContainer.style.marginTop = "10px"; // Adjust the value as needed
  
  textarea.parentNode.insertBefore(buttonsContainer, textarea.nextSibling);
  return buttonsContainer;
}

function createButtons(buttonsContainer, textarea) {
  chrome.runtime.sendMessage({ action: "getPredefinedStrings" }, function (predefinedStrings) {
    // Create buttons for main categories
    Object.keys(predefinedStrings).forEach((category) => {
      const mainCategoryButton = document.createElement("button");
      mainCategoryButton.innerText = category;
      mainCategoryButton.className = "main-category-button"; // Add a class for styling
      mainCategoryButton.addEventListener("click", () => showSubcategories(category, textarea));
      buttonsContainer.appendChild(mainCategoryButton);
    });
  });
}

function showSubcategories(category, textarea) {
  console.log("Showing subcategories for category:", category, "in textarea:", textarea);
  const buttonsContainer = textarea.nextElementSibling;

  buttonsContainer.innerHTML = ''; // Clear existing buttons

  chrome.runtime.sendMessage({ action: "getPredefinedStrings" }, function (predefinedStrings) {
    const subcategories = predefinedStrings[category];

    // Create buttons for subcategories
    Object.keys(subcategories).forEach((subcategory) => {
      const subcategoryButton = document.createElement("button");
      subcategoryButton.innerText = subcategory;
      subcategoryButton.className = "subcategory-button"; // Add a class for styling
      subcategoryButton.addEventListener("click", () => pasteTextWithActions(subcategories[subcategory], textarea));
      buttonsContainer.appendChild(subcategoryButton);
    });
  });
}

function pasteTextWithActions(text, textarea) {
  console.log("Pasting text with typing animation:", text, "in textarea:", textarea);

  // Clear the existing content
  textarea.value = "";

  // Set a typing speed (adjust as needed)
  const typingSpeed = 10; // milliseconds per character

  // Iterate through each character in the text and simulate typing
  for (let i = 0; i < text.length; i++) {
    setTimeout(() => {
      // Append the current character to the textarea
      textarea.value += text[i];

      // Scroll to the end of the textarea to keep the latest characters visible
      textarea.scrollTop = textarea.scrollHeight;
    }, i * typingSpeed);
  }

  // Replace buttons with "Looks good" and "Clear All" options
  setTimeout(() => {
    const looksGoodButton = document.createElement("button");
    looksGoodButton.innerText = "Looks good";
    looksGoodButton.className = "action-button";
    looksGoodButton.addEventListener("click", () => removeButtonsAndReplaceWithActions(textarea));

    const clearAllButton = document.createElement("button");
    clearAllButton.innerText = "Clear All";
    clearAllButton.className = "action-button";
    clearAllButton.addEventListener("click", () => clearAllAndReturnToMainCategories(textarea));

    buttonsContainer.innerHTML = ''; // Clear existing buttons
    buttonsContainer.appendChild(looksGoodButton);
    buttonsContainer.appendChild(clearAllButton);
  }, text.length * typingSpeed);

  // Clear buttons container after pasting text
  setTimeout(() => {
    buttonsContainer.innerHTML = '';
  }, (text.length + 2) * typingSpeed); // Add (2 + 2) * typingSpeed for the new lines
}

function removeButtonsAndReplaceWithActions(buttonsContainer, textarea) {
  buttonsContainer.innerHTML = ''; // Clear existing buttons
  createButtons(buttonsContainer, textarea);
}

function clearAllAndReturnToMainCategories(buttonsContainer, textarea) {
  // Clear the just pasted text
  textarea.value = '';

  // Replace buttons with main categories
  createButtons(buttonsContainer, textarea);
}

function processTextarea(textarea) {
  console.log("Processing textarea:", textarea);
  const buttonsContainer = createButtonsContainer(textarea);
  createButtons(buttonsContainer, textarea);
}

// Trigger the creation of buttons when the extension button is clicked
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "addButtons") {
    console.log("Received message to add buttons.");
    const textareas = document.querySelectorAll("textarea");
    textareas.forEach((textarea) => processTextarea(textarea));
  } else if (request.action === "removeButtons") {
    console.log("Received message to remove buttons.");
    const buttonsContainers = document.querySelectorAll(".extension-buttons-container");
    buttonsContainers.forEach((container) => container.remove());
  }
});

console.log("Content script loaded.");

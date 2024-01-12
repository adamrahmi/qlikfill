// content.js

// Global variable to store the buttons container
let buttonsContainer;

// Function to create buttons container for a given textarea
function createButtonsContainer(textarea) {
  console.log("Creating buttons container for textarea:", textarea);
  buttonsContainer = document.createElement("div");
  buttonsContainer.className = "extension-buttons-container";
  textarea.parentNode.insertBefore(buttonsContainer, textarea.nextSibling);
  return buttonsContainer;
}

// Function to create main category buttons
function createButtons(buttonsContainer, textarea, customizedText) {
  chrome.storage.sync.get("customizedtext", function (result) {
    const customizedText = result.customizedtext || {};

    // Iterate over main categories and create buttons
    Object.keys(customizedText).forEach((category) => {
      const mainCategoryButton = document.createElement("button");
      mainCategoryButton.innerText = category;
      mainCategoryButton.className = "main-category-button";
      mainCategoryButton.addEventListener("click", () => showSubcategories(category, textarea, customizedText));
      buttonsContainer.appendChild(mainCategoryButton);
    });
  });
}

// Function to show subcategory buttons based on the selected main category
function showSubcategories(category, textarea, customizedText) {
  chrome.storage.sync.get("customizedtext", function (result) {
    const customizedText = result.customizedtext || {};

    // Clear existing buttons
    const buttonsContainer = textarea.nextElementSibling;
    buttonsContainer.innerHTML = '';

    // Iterate over subcategories for the selected main category and create buttons
    const subcategories = customizedText[category] || {};
    Object.keys(subcategories).forEach((subcategory) => {
      const subcategoryButton = document.createElement("button");
      subcategoryButton.innerText = subcategory;
      subcategoryButton.className = "subcategory-button";
      subcategoryButton.addEventListener("click", () => pasteTextWithActions(subcategories[subcategory], textarea));
      buttonsContainer.appendChild(subcategoryButton);
    });
  });
}

// Function to paste text into the textarea with typing animation
function pasteTextWithActions(text, textarea) {
  console.log("Pasting text with typing animation:", text, "in textarea:", textarea);
  textarea.value = "";

  const typingSpeed = 10;
  for (let i = 0; i < text.length; i++) {
    setTimeout(() => {
      textarea.value += text[i];
      textarea.scrollTop = textarea.scrollHeight;
    }, i * typingSpeed);
  }

  // Add action buttons after typing animation completes
  setTimeout(() => {
    const looksGoodButton = document.createElement("button");
    looksGoodButton.innerText = "Looks good!";
    looksGoodButton.className = "action-button";
    looksGoodButton.addEventListener("click", () => removeButtonsAndReplaceWithActions(textarea));

    const clearAllButton = document.createElement("button");
    clearAllButton.innerText = "Clear All";
    clearAllButton.className = "action-button";
    clearAllButton.addEventListener("click", () => clearAllAndReturnToMainCategories(textarea));

    // Update buttons container with action buttons
    buttonsContainer.innerHTML = '';
    buttonsContainer.appendChild(looksGoodButton);
    buttonsContainer.appendChild(clearAllButton);
  }, text.length * typingSpeed);

  // Clear action buttons after a brief delay
  setTimeout(() => {
    // buttonsContainer.innerHTML = '';
  }, (text.length + 2) * typingSpeed);
}

// Function to remove action buttons and restore main category buttons
function removeButtonsAndReplaceWithActions(textarea) {
  chrome.storage.sync.get("customizedtext", function (result) {
    const customizedText = result.customizedtext || {};
    buttonsContainer.innerHTML = '';
    createButtons(buttonsContainer, textarea, customizedText);
  });
}

// Function to clear the textarea and restore main category buttons
function clearAllAndReturnToMainCategories(textarea) {
  chrome.storage.sync.get("customizedtext", function (result) {
    const customizedText = result.customizedtext || {};
    buttonsContainer.innerHTML = '';
    createButtons(buttonsContainer, textarea, customizedText);
  });

  // Clear the textarea
  textarea.value = '';
}

// Function to process textarea and add buttons
function processTextarea(textarea, customizedText) {
  console.log("Processing textarea:", textarea);
  const buttonsContainer = createButtonsContainer(textarea);
  createButtons(buttonsContainer, textarea, customizedText);
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "addButtons") {
    console.log("Received message to add buttons.");
    chrome.storage.sync.get("customizedtext", function (result) {
      const customizedText = result.customizedtext || {};
      const textareas = document.querySelectorAll("textarea");
      textareas.forEach((textarea) => processTextarea(textarea, customizedText));
    });
  } else if (request.action === "removeButtons") {
    console.log("Received message to remove buttons.");
    const buttonsContainers = document.querySelectorAll(".extension-buttons-container");
    buttonsContainers.forEach((container) => container.remove());
  }
});

console.log("Content script loaded.");

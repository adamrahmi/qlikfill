// content.js
let buttonsContainer;

function createButtonsContainer(textarea) {
  console.log("Creating buttons container for textarea:", textarea);
  buttonsContainer = document.createElement("div");
  buttonsContainer.className = "extension-buttons-container";
  textarea.parentNode.insertBefore(buttonsContainer, textarea.nextSibling);
  return buttonsContainer;
}

function createButtons(buttonsContainer, textarea, defaultText) {
  Object.keys(defaultText).forEach((category) => {
    const mainCategoryButton = document.createElement("button");
    mainCategoryButton.innerText = category;
    mainCategoryButton.className = "main-category-button";
    mainCategoryButton.addEventListener("click", () => showSubcategories(category, textarea, defaultText));
    buttonsContainer.appendChild(mainCategoryButton);
  });
}

function showSubcategories(category, textarea, defaultText) {
  const buttonsContainer = textarea.nextElementSibling;
  buttonsContainer.innerHTML = '';

  const subcategories = defaultText[category];
  Object.keys(subcategories).forEach((subcategory) => {
    const subcategoryButton = document.createElement("button");
    subcategoryButton.innerText = subcategory;
    subcategoryButton.className = "subcategory-button";
    subcategoryButton.addEventListener("click", () => pasteTextWithActions(subcategories[subcategory], textarea));
    buttonsContainer.appendChild(subcategoryButton);
  });
}

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

  setTimeout(() => {
    const looksGoodButton = document.createElement("button");
    looksGoodButton.innerText = "Looks good!";
    looksGoodButton.className = "action-button";
    looksGoodButton.addEventListener("click", () => removeButtonsAndReplaceWithActions(textarea));

    const clearAllButton = document.createElement("button");
    clearAllButton.innerText = "Clear All";
    clearAllButton.className = "action-button";
    clearAllButton.addEventListener("click", () => clearAllAndReturnToMainCategories(textarea));

    buttonsContainer.innerHTML = '';
    buttonsContainer.appendChild(looksGoodButton);
    buttonsContainer.appendChild(clearAllButton);
  }, text.length * typingSpeed);

  setTimeout(() => {
    // buttonsContainer.innerHTML = '';
  }, (text.length + 2) * typingSpeed);
}

function removeButtonsAndReplaceWithActions(textarea) {
  buttonsContainer.innerHTML = '';
  createButtons(buttonsContainer, textarea, defaultText);
}

function clearAllAndReturnToMainCategories(textarea) {
  textarea.value = '';
  createButtons(buttonsContainer, textarea, defaultText);
}

function processTextarea(textarea, defaultText) {
  console.log("Processing textarea:", textarea);
  const buttonsContainer = createButtonsContainer(textarea);
  createButtons(buttonsContainer, textarea, defaultText);
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "addButtons") {
    console.log("Received message to add buttons.");
    chrome.storage.sync.get("defaulttext", function (result) {
      const defaultText = result.defaulttext || {};
      const textareas = document.querySelectorAll("textarea");
      textareas.forEach((textarea) => processTextarea(textarea, defaultText));
    });
  } else if (request.action === "removeButtons") {
    console.log("Received message to remove buttons.");
    const buttonsContainers = document.querySelectorAll(".extension-buttons-container");
    buttonsContainers.forEach((container) => container.remove());
  }
});

console.log("Content script loaded.");

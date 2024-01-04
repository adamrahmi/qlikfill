// content.js
function createButtons() {
  const buttonsContainer = document.createElement("div");
  buttonsContainer.id = "extension-buttons-container";
  document.body.appendChild(buttonsContainer);

  const predefinedStrings = chrome.extension.getBackgroundPage().predefinedStrings;

  // Create buttons for main categories
  Object.keys(predefinedStrings).forEach((category) => {
    const mainCategoryButton = document.createElement("button");
    mainCategoryButton.innerText = category;
    mainCategoryButton.addEventListener("click", () => showSubcategories(category));
    buttonsContainer.appendChild(mainCategoryButton);
  });
}

function showSubcategories(category) {
  const buttonsContainer = document.getElementById("extension-buttons-container");

  buttonsContainer.innerHTML = ''; // Clear existing buttons

  const subcategories = predefinedStrings[category];

  // Create buttons for subcategories
  Object.keys(subcategories).forEach((subcategory) => {
    const subcategoryButton = document.createElement("button");
    subcategoryButton.innerText = subcategory;
    subcategoryButton.addEventListener("click", () => pasteText(subcategories[subcategory]));
    buttonsContainer.appendChild(subcategoryButton);
  });
}

function pasteText(text) {
  const activeElement = document.activeElement;
  if (activeElement.tagName === "INPUT" || activeElement.tagName === "TEXTAREA") {
    // Save the current scroll position
    const scrollTop = activeElement.scrollTop;

    // Paste the text
    activeElement.value += text;

    // Resize the textbox to fit the content
    activeElement.style.height = "auto";
    activeElement.style.height = (activeElement.scrollHeight + 2) + "px";

    // Restore the scroll position
    activeElement.scrollTop = scrollTop;
  }
}

// Trigger the creation of buttons when the extension icon is clicked
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "showButtons") {
    createButtons();
  }
});

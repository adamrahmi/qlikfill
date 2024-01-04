  
// popup.js
function createButtons() {
    const buttonsContainer = document.getElementById("buttons-container");
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
    const buttonsContainer = document.getElementById("buttons-container");
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
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: "pasteText", text: text });
    });
  }
  
  document.addEventListener("DOMContentLoaded", createButtons);
  
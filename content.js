// content.js
function createButtonsContainer(textarea) {
  const buttonsContainer = document.createElement("div");
  buttonsContainer.className = "extension-buttons-container";
  textarea.parentNode.insertBefore(buttonsContainer, textarea.nextSibling);
  return buttonsContainer;
}

function createButtons(buttonsContainer, textarea) {
  chrome.runtime.sendMessage({ action: "getPredefinedStrings" }, function (predefinedStrings) {
    // Create buttons for main categories
    Object.keys(predefinedStrings).forEach((category) => {
      const mainCategoryButton = document.createElement("button");
      mainCategoryButton.innerText = category;
      mainCategoryButton.addEventListener("click", () => showSubcategories(category, textarea));
      buttonsContainer.appendChild(mainCategoryButton);
    });
  });
}

function showSubcategories(category, textarea) {
  const buttonsContainer = textarea.nextElementSibling;

  buttonsContainer.innerHTML = ''; // Clear existing buttons

  chrome.runtime.sendMessage({ action: "getPredefinedStrings" }, function (predefinedStrings) {
    const subcategories = predefinedStrings[category];

    // Create buttons for subcategories
    Object.keys(subcategories).forEach((subcategory) => {
      const subcategoryButton = document.createElement("button");
      subcategoryButton.innerText = subcategory;
      subcategoryButton.addEventListener("click", () => pasteText(subcategories[subcategory], textarea));
      buttonsContainer.appendChild(subcategoryButton);
    });
  });
}

function pasteText(text, textarea) {
  // Save the current scroll position
  const scrollTop = textarea.scrollTop;

  // Paste the text
  textarea.value += text;

  // Resize the textarea to fit the content
  textarea.style.height = "auto";
  textarea.style.height = textarea.scrollHeight + "px";

  // Restore the scroll position
  textarea.scrollTop = scrollTop;
}

function processTextarea(textarea) {
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

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
    chrome.storage.sync.get("defaulttext", function (result) {
        const defaultText = result.defaulttext || {};

        Object.keys(defaultText).forEach((category) => {
            const mainCategoryButton = document.createElement("button");
            mainCategoryButton.innerText = category;
            mainCategoryButton.className = "main-category-button";
            mainCategoryButton.addEventListener("click", () => showSubcategories(category, textarea, defaultText));
            buttonsContainer.appendChild(mainCategoryButton);
        });
    });
}

function showSubcategories(category, textarea, defaultText) {
    chrome.storage.sync.get("defaulttext", function (result) {
        const defaultText = result.defaulttext || {};

        const buttonsContainer = textarea.nextElementSibling;
        buttonsContainer.innerHTML = '';

        const subcategories = defaultText[category] || {};
        Object.keys(subcategories).forEach((subcategory) => {
            const subcategoryButton = document.createElement("button");
            subcategoryButton.innerText = subcategory;
            subcategoryButton.className = "subcategory-button";
            subcategoryButton.addEventListener("click", () => pasteTextWithActions(category, subcategory, textarea));
            buttonsContainer.appendChild(subcategoryButton);
        });
    });
}

function pasteTextWithActions(category, subcategory, textarea) {
    chrome.storage.sync.get("defaulttext", function (result) {
        const defaultText = result.defaulttext || {};
        const text = defaultText[category] && defaultText[category][subcategory] || "";

        console.log(`Pasting text with typing animation for ${subcategory}:`, text, "in textarea:", textarea);
        textarea.value = text;

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
    });
}

function removeButtonsAndReplaceWithActions(textarea) {
    chrome.storage.sync.get("defaulttext", function (result) {
        const defaultText = result.defaulttext || {};
        buttonsContainer.innerHTML = '';
        createButtons(buttonsContainer, textarea, defaultText);
    });
}

function clearAllAndReturnToMainCategories(textarea) {
    chrome.storage.sync.get("defaulttext", function (result) {
        const defaultText = result.defaulttext || {};
        buttonsContainer.innerHTML = '';
        createButtons(buttonsContainer, textarea, defaultText);
    });

    textarea.value = '';
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === "addButtons") {
        console.log("Received message to add buttons.");
        chrome.storage.sync.get("defaulttext", function (result) {
            const defaultText = result.defaulttext || {};
            const textareas = document.querySelectorAll("textarea");
            textareas.forEach((textarea) => createButtonsContainer(textarea) && createButtons(buttonsContainer, textarea, defaultText));
        });
    } else if (request.action === "removeButtons") {
        console.log("Received message to remove buttons.");
        const buttonsContainers = document.querySelectorAll(".extension-buttons-container");
        buttonsContainers.forEach((container) => container.remove());
    }
});

console.log("Content script loaded.");

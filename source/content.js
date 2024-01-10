// content.js
console.log("Content script loaded.");

let buttonsContainer;

function createButtonsContainer(textarea) {
    console.log("Creating buttons container for textarea:", textarea);
    buttonsContainer = document.createElement("div");
    buttonsContainer.className = "extension-buttons-container";
    textarea.parentNode.insertBefore(buttonsContainer, textarea.nextSibling);
    return buttonsContainer;
}

function createButtons(buttonsContainer, textarea) {
    console.log("Creating buttons for textarea:", textarea);
    chrome.runtime.sendMessage({ action: "getMainCategories" }, function (mainCategories) {
        mainCategories.forEach((category) => {
            const mainCategoryButton = document.createElement("button");
            mainCategoryButton.innerText = category;
            mainCategoryButton.className = "main-category-button";
            mainCategoryButton.addEventListener("click", () => showSubcategories(category, textarea));
            buttonsContainer.appendChild(mainCategoryButton);
        });
    });
}

function showSubcategories(category, textarea) {
    console.log("Showing subcategories for category:", category, "in textarea:", textarea);
    const buttonsContainer = textarea.nextElementSibling;
    buttonsContainer.innerHTML = '';

    chrome.runtime.sendMessage({ action: "getSubcategories", category }, function (subcategories) {
        Object.keys(subcategories).forEach((subcategory) => {
            const subcategoryButton = document.createElement("button");
            subcategoryButton.innerText = subcategory;
            subcategoryButton.className = "subcategory-button";
            subcategoryButton.addEventListener("click", () => pasteTextWithActions(subcategories[subcategory], textarea));
            buttonsContainer.appendChild(subcategoryButton);
        });
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
    console.log("Removing buttons and replacing with actions for textarea:", textarea);
    buttonsContainer.innerHTML = '';
    createButtons(buttonsContainer, textarea);
}

function clearAllAndReturnToMainCategories(textarea) {
    console.log("Clearing all and returning to main categories for textarea:", textarea);
    textarea.value = '';
    createButtons(buttonsContainer, textarea);
}

function processTextarea(textarea) {
    console.log("Processing textarea:", textarea);
    const buttonsContainer = createButtonsContainer(textarea);
    createButtons(buttonsContainer, textarea);
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === "addButtons") {
        console.log("Received message to add buttons.");
        chrome.runtime.sendMessage({ action: "getMainCategories" }, function (mainCategories) {
            const textareas = document.querySelectorAll("textarea");
            textareas.forEach((textarea) => processTextarea(textarea));
        });
    } else if (request.action === "removeButtons") {
        console.log("Received message to remove buttons.");
        const buttonsContainers = document.querySelectorAll(".extension-buttons-container");
        buttonsContainers.forEach((container) => container.remove());
    }
});

console.log("Content script fully loaded.");

// settings.js
console.log("Settings script loaded.");

document.addEventListener("DOMContentLoaded", function () {
    console.log("Settings DOM content loaded.");

    function getSavedValue(subcategory) {
        console.log("Getting saved value for subcategory:", subcategory);
        return new Promise((resolve) => {
            chrome.storage.sync.get(["predefinedStrings", "userChanges"], function (result) {
                const mergedValues = mergeValues(result.predefinedStrings, result.userChanges);
                resolve(mergedValues[subcategory] || "");
            });
        });
    }

    function setSavedValue(subcategory, value) {
        console.log("Setting saved value for subcategory:", subcategory);
        chrome.storage.sync.get("userChanges", function (result) {
            const userChanges = result.userChanges || {};
            userChanges[subcategory] = value;
            chrome.storage.sync.set({ "userChanges": userChanges });
        });
    }

    function reloadDefaults(subcategory, defaultText) {
        console.log("Reloading defaults for subcategory:", subcategory);
        getSavedValue(subcategory).then((defaultValue) => {
            document.getElementById(subcategory).value = defaultValue;
        });
    }

    function initializeSettings(category, subcategories) {
        console.log("Initializing settings for category:", category);
        const settingsContainer = document.getElementById("settingsContainer");

        const categoryHeader = document.createElement("h2");
        categoryHeader.innerText = category;
        settingsContainer.appendChild(categoryHeader);

        subcategories.forEach((subcategory) => {
            const subcategoryContainer = document.createElement("div");
            subcategoryContainer.className = "subcategory-settings";
            const subcategoryHeader = document.createElement("h3");
            subcategoryHeader.innerText = subcategory;
            subcategoryContainer.appendChild(subcategoryHeader);

            const label = document.createElement("label");
            label.htmlFor = subcategory;
            label.innerText = `${subcategory}:`;
            subcategoryContainer.appendChild(label);

            const textarea = document.createElement("textarea");
            textarea.id = subcategory;
            textarea.rows = "6";
            textarea.cols = "13";
            subcategoryContainer.appendChild(textarea);

            const saveButton = document.createElement("button");
            saveButton.id = `save${subcategory}`;
            saveButton.innerText = "Save";
            subcategoryContainer.appendChild(saveButton);

            const reloadDefaultsButton = document.createElement("button");
            reloadDefaultsButton.id = `reloadDefaults${subcategory}`;
            reloadDefaultsButton.innerText = "Reload Defaults";
            subcategoryContainer.appendChild(reloadDefaultsButton);

            settingsContainer.appendChild(subcategoryContainer);
            initializeSettings(subcategory, defaultValues[category][subcategory]);
        });
    }

    chrome.runtime.sendMessage({ action: "getDefaultValues" }, function (defaultValues) {
        console.log("Received default values from the background script:", defaultValues);

        const categories = Object.keys(defaultValues);

        categories.forEach((category) => {
            const subcategories = Object.keys(defaultValues[category]);
            initializeSettings(category, subcategories);
        });
    });
});

console.log("Settings script fully loaded.");

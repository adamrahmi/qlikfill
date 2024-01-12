// settings.js
document.addEventListener("DOMContentLoaded", function () {
  // Function to retrieve the saved value from Chrome storage
  function getSavedValue(category, subcategory) {
    return new Promise((resolve) => {
      chrome.storage.sync.get("customizedtext", function (result) {
        const customizedText = result.customizedtext || {};
        resolve(customizedText[category] && customizedText[category][subcategory] || "");
      });
    });
  }

  // Function to set and save the value to Chrome storage
  function setSavedValue(category, subcategory, value) {
    chrome.storage.sync.get("customizedtext", function (result) {
      const customizedText = result.customizedtext || {};
      if (!customizedText[category]) {
        customizedText[category] = {};
      }
      customizedText[category][subcategory] = value;
      chrome.storage.sync.set({ customizedtext: customizedText });
    });
  }

  // Function to reload default values and update the textarea
  function reloadDefaults(category, subcategory, defaultText) {
    setSavedValue(category, subcategory, defaultText);
    document.getElementById(subcategory).value = defaultText;
  }

  // Function to initialize settings for a given category, subcategory, and default text
  function initializeSettings(category, subcategory, defaultText) {
    const saveButton = document.getElementById(`save${subcategory}`);
    const reloadDefaultsButton = document.getElementById(`reloadDefaults${subcategory}`);

    getSavedValue(category, subcategory).then((savedValue) => {
      const textarea = document.getElementById(subcategory);
      textarea.value = savedValue || defaultText;

      // Save button click event
      saveButton.addEventListener("click", () => {
        setSavedValue(category, subcategory, textarea.value);
        console.log(`Saved value for ${subcategory}: ${textarea.value}`);
      });

      // Reload defaults button click event
      reloadDefaultsButton.addEventListener("click", () => {
        reloadDefaults(category, subcategory, defaultText);
      });
    });
  }

  // Retrieve default values from Chrome storage
  chrome.storage.sync.get("customizedtext", function (result) {
    const customizedText = result.customizedtext || {};
    const categories = Object.keys(customizedText);

    // Iterate over categories and subcategories to create settings page
    categories.forEach((category) => {
      const settingsContainer = document.getElementById("settingsContainer");

      // Create category header
      const categoryHeader = document.createElement("h2");
      categoryHeader.innerText = category;
      settingsContainer.appendChild(categoryHeader);

      // Iterate over subcategories for the current category
      const subcategories = Object.keys(customizedText[category]);
      subcategories.forEach((subcategory) => {
        const subcategoryContainer = document.createElement("div");
        subcategoryContainer.className = "subcategory-settings";

        // Create subcategory header
        const subcategoryHeader = document.createElement("h3");
        subcategoryHeader.innerText = subcategory;
        subcategoryContainer.appendChild(subcategoryHeader);

        // Create label for the textarea
        const label = document.createElement("label");
        label.htmlFor = subcategory;
        label.innerText = `${subcategory}:`;
        subcategoryContainer.appendChild(label);

        // Create textarea
        const textarea = document.createElement("textarea");
        textarea.id = subcategory;
        textarea.rows = "6";
        textarea.cols = "13";
        subcategoryContainer.appendChild(textarea);

        // Create Save button
        const saveButton = document.createElement("button");
        saveButton.id = `save${subcategory}`;
        saveButton.innerText = "Save";
        subcategoryContainer.appendChild(saveButton);

        // Create Reload Defaults button
        const reloadDefaultsButton = document.createElement("button");
        reloadDefaultsButton.id = `reloadDefaults${subcategory}`;
        reloadDefaultsButton.innerText = "Reload Defaults";
        subcategoryContainer.appendChild(reloadDefaultsButton);

        // Append subcategory container to the settings container
        settingsContainer.appendChild(subcategoryContainer);

        // Initialize settings for the current subcategory
        initializeSettings(category, subcategory, customizedText[category][subcategory]);
      });
    });
  });
});

// settings.js
document.addEventListener("DOMContentLoaded", function () {
  function getSavedValue(category, subcategory) {
      return new Promise((resolve) => {
          chrome.storage.sync.get("defaulttext", function (result) {
              const defaultText = result.defaulttext || {};
              resolve(defaultText[category] && defaultText[category][subcategory] || "");
          });
      });
  }

  function setSavedValue(category, subcategory, value) {
      chrome.storage.sync.get("defaulttext", function (result) {
          const defaultText = result.defaulttext || {};
          if (!defaultText[category]) {
              defaultText[category] = {};
          }
          defaultText[category][subcategory] = value;
          chrome.storage.sync.set({ defaulttext: defaultText }, function () {
              console.log(`Saved value for ${subcategory}:`, value);
          });
      });
  }

  function reloadDefaults(category, subcategory, defaultText) {
    chrome.storage.sync.get("defaulttext", function (result) {
        const initialDefaultText = result.defaulttext || {};
        const originalValue = initialDefaultText[category] && initialDefaultText[category][subcategory] || "";
        setSavedValue(category, subcategory, originalValue);
        document.getElementById(subcategory).value = originalValue;
    });
}


function initializeSettings(category, subcategory, defaultText) {
  // Add a console log to display the current Chrome storage values
  chrome.storage.sync.get("defaulttext", function (result) {
      console.log("Current values in Chrome storage:", result.defaulttext || {});
  });

  const saveButton = document.getElementById(`save${subcategory}`);
  const reloadDefaultsButton = document.getElementById(`reloadDefaults${subcategory}`);

  getSavedValue(category, subcategory).then((savedValue) => {
      const textarea = document.getElementById(subcategory);
      textarea.value = savedValue || defaultText;

      saveButton.addEventListener("click", () => {
          setSavedValue(category, subcategory, textarea.value);
          // Add a console log to display the current value for the selected subcategory
          console.log(`Current value for ${subcategory}:`, textarea.value);
      });

      reloadDefaultsButton.addEventListener("click", () => {
          reloadDefaults(category, subcategory, defaultText);
      });
  });
}


  // Retrieve default values from Chrome storage
  chrome.storage.sync.get("defaulttext", function (result) {
      const defaultText = result.defaulttext || {};
      const categories = Object.keys(defaultText);

      categories.forEach((category) => {
          const settingsContainer = document.getElementById("settingsContainer");

          const categoryHeader = document.createElement("h2");
          categoryHeader.innerText = category;
          settingsContainer.appendChild(categoryHeader);

          const subcategories = Object.keys(defaultText[category]);
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

              // Initialize settings for the current subcategory
              initializeSettings(category, subcategory, defaultText[category][subcategory]);
          });
      });
  });
});

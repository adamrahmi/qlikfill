// settings.js
document.addEventListener("DOMContentLoaded", function () {
  function getSavedValue(subcategory) {
    return new Promise((resolve) => {
      chrome.storage.sync.get(subcategory, function (result) {
        resolve(result[subcategory] || "");
      });
    });
  }

  function setSavedValue(subcategory, value) {
    chrome.storage.sync.set({ [subcategory]: value });
  }

  function reloadDefaults(subcategory) {
    getSavedValue(subcategory).then((defaultValue) => {
      document.getElementById(subcategory).value = defaultValue;
    });
  }

  function initializeSettings(subcategory, defaultText) {
    const saveButton = document.getElementById(`save${subcategory}`);
    const reloadDefaultsButton = document.getElementById(`reloadDefaults${subcategory}`);

    getSavedValue(subcategory).then((savedValue) => {
      const textarea = document.getElementById(subcategory);
      textarea.value = savedValue || defaultText;

      saveButton.addEventListener("click", () => {
        setSavedValue(subcategory, textarea.value);
      });

      reloadDefaultsButton.addEventListener("click", () => {
        reloadDefaults(subcategory);
      });
    });
  }

  chrome.runtime.sendMessage({ action: "getPredefinedStrings" }, function (predefinedStrings) {
    const categories = Object.keys(predefinedStrings);

    categories.forEach((category) => {
      const settingsContainer = document.getElementById("settingsContainer");
      const categoryHeader = document.createElement("h2");
      categoryHeader.innerText = category;
      settingsContainer.appendChild(categoryHeader);

      const subcategories = predefinedStrings[category];
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
    });
  });
});

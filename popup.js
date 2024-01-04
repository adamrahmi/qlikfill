// popup.js

/**
 * Sends a message to the content script to add buttons to the active tab.
 */
function addButtons() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    console.log("Sending message to content script to add buttons.");
    chrome.tabs.sendMessage(tabs[0].id, { action: "addButtons" }, function (response) {
      console.log("Content script response:", response);
    });
  });
}

/**
 * Sends a message to the content script to remove buttons from the active tab.
 */
function removeButtons() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    console.log("Sending message to content script to remove buttons.");
    chrome.tabs.sendMessage(tabs[0].id, { action: "removeButtons" }, function (response) {
      console.log("Content script response:", response);
    });
  });
}

// Event listener for the "Add Buttons" menu option
document.getElementById("addButtons").addEventListener("click", addButtons);

// Event listener for the "Remove Buttons" menu option
document.getElementById("removeButtons").addEventListener("click", removeButtons);

// Trigger the "Add Buttons" action by default when the extension button is clicked
document.addEventListener("DOMContentLoaded", function () {
  console.log("Popup script loaded.");
  addButtons();
});

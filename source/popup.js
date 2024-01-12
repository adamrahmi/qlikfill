//popup.js
function addButtons() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { action: "addButtons" });
  });
}

function removeButtons() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { action: "removeButtons" });
  });
}

function openSettings() {
  chrome.tabs.create({ url: "settings.html" });
}

document.getElementById("settingsButton").addEventListener("click", function () {
  chrome.tabs.create({ url: "settings.html" });
});

document.addEventListener("DOMContentLoaded", function () {
  console.log("Popup script loaded.");

  document.getElementById("addButtons").addEventListener("click", addButtons);
  document.getElementById("removeButtons").addEventListener("click", removeButtons);
});

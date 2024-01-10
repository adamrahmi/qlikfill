// popup.js
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

document.addEventListener("DOMContentLoaded", function () {
  console.log("Popup script loaded.");

  document.getElementById("addButtons").addEventListener("click", addButtons);
  document.getElementById("removeButtons").addEventListener("click", removeButtons);
});

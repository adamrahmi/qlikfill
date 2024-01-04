// popup.js
function showButtons() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { action: "showButtons" });
  });
}

document.addEventListener("DOMContentLoaded", showButtons);

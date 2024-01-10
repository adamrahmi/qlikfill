// userchanges.js
const userChanges = {};

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "getUserChanges") {
    sendResponse(userChanges);
  }
});

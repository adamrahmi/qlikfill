// background.js

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "getUserChanges") {
    chrome.storage.sync.get("userChanges", function (result) {
      const userChanges = result.userChanges || {};
      sendResponse(userChanges);
    });
  } else if (request.action === "updateUserChanges") {
    const { subcategory, value } = request;
    chrome.storage.sync.get("userChanges", function (result) {
      const userChanges = result.userChanges || {};
      userChanges[subcategory] = value;
      chrome.storage.sync.set({ userChanges: userChanges });
    });
  }
});
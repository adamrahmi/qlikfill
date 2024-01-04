// content.js
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === "pasteText") {
      const activeElement = document.activeElement;
      if (activeElement.tagName === "INPUT" || activeElement.tagName === "TEXTAREA") {
        // Save the current scroll position
        const scrollTop = activeElement.scrollTop;
  
        // Paste the text
        activeElement.value += request.text;
  
        // Resize the textbox to fit the content
        activeElement.style.height = "auto";
        activeElement.style.height = (activeElement.scrollHeight + 2) + "px";
  
        // Restore the scroll position
        activeElement.scrollTop = scrollTop;
        console.log("hello there");
      }
    }
  });
  
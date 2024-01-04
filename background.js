// background.js
const predefinedStrings = {
    "Not product": {
      "Decrease severity": "Decrease severity string",
      "Defect pushback": "Defect pushback string",
      "Defect opened": "Defect opened string",
      "Zombie issue (RCA)": "Zombie issue (RCA) string",
      "Antivirus issue": "Antivirus issue string",
    },
    "Qlik Sense": "Qlik Sense string",
    "Qlik Alerting": "Qlik Alerting string",
    "NPrinting": "NPrinting string",
  };
  
  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log("Message received in background script:", request);
    if (request.action === "getPredefinedStrings") {
      sendResponse(predefinedStrings);
    }
  });
  
// background.js
const predefinedStrings = {
    "Not product": {
      "Decrease severity": "I hope you are doing well! Since we haven't heard from you in the last 3 hours, we need to reduce the severity level of your case. From now on, the office in your region will monitor the case, with their standard business hours. If you have any attachments pending, please upload it to us, so we can continue to work on your case.",
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
  
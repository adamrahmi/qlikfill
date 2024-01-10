// background.js
const predefinedStrings = {
    "Not product": {
      "Decrease severity": "We hope you are doing well! Since we haven't heard from you in the last 3 hours, we need to reduce the severity level of your case. From now on, the office in your region will monitor the case, with their standard business hours. If you have any attachments pending, please upload it to us, so we can continue to work on your case.",
      "Defect pushback": "We understand your request to continue to receive information over long period of time. However, we won't provide further updates regarding this case. As communicated previously, this has been accepted as a defect with our engineering teams, and it's under investigation, however, there's currently no time estimate for resolution, as there is no impact on the core product functionality. Please also note that most likely this defect will be fixed in the latest upcoming product version not any versions prior.",
      "Defect opened": "This reported issue has been raised with the internal defect ID of [_______]. This ID can be used for tracking progress directly in our Community forum.Please consider subscribing to our latest release notes and patches page. We will proceed with archiving this case. Should you have any other questions feel free to reach out to us.",
      "Zombie issue (RCA)": "A postmortem analysis takes place after a non-recurring issue has been remedied, in order to find out what caused the issue. We will request a complete set of data with which to analyze event. Once the data has been provided we will give our best effort to determine the root cause. Once the investigation is completed, the final analysis will be given to you, and the case will be closed. If the root causes impossible to determine based on the data at hand, we will state this in the final analysis, along with suggestions for additional logging, which could be useful should issue occurr again.",
      "Antivirus issue": "We cannot provide support and services for any Qlik Software, in which performance issues, port issues, installation, patching, or upgrading problems occurr, if Qlik folders and directories are not made exempt for any and all antivirus or security software solutions. We will treat these cases as best effort as these extrusions are necessary in order for Qlik software to function normally. Please contact the manufacturer of the antivirus or secutify software, in order to get help and support from them on how to exclude Qlik software.",
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
  
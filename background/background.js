import storageHelper from "./storagehelper.js";
import { formatTime } from "./utils.js";

console.log("============================")
console.log("** Service worker running **")
console.log("============================")

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // Service worker will handle logic here based on the kind of messages it receives
  console.log("Service Worker: request received -> ", request);

    switch(request.action) {
        case "startTimer":
          (async () => {
            const durationMinutes = 0.2; //CHANGE THIS TO INPUT IN THE FUTURE
            const endTime = Date.now() + durationMinutes * 60000; // time conversion to ms
            const status = "running"; // Timer status for popup display
            
            await storageHelper.setDuration(durationMinutes); // Saves duration for popup.js to fetch for time polling
            await storageHelper.setEndTime(endTime);
            await chrome.alarms.clearAll();
            chrome.alarms.create("focusTimer", {delayInMinutes: durationMinutes});
            await storageHelper.setStatus(status); //Saves current timer status
            sendResponse({ status: "Timer Running!:" + durationMinutes + " minutes."});
          })();
          break;
        
        case "pauseTimer":
          (async () => {
            const endTime = await storageHelper.getEndTime(); // ms
            const remainingTime = endTime - Date.now(); // ms
            const formattedTime = formatTime(remainingTime); // format for readability
            const status = "paused"; // Timer status for popup display

            
            await storageHelper.setRemainingTime(remainingTime);
            console.log("Remaining time stored.")
            await chrome.alarms.clearAll();
            await storageHelper.setStatus(status); //Saves current timer status
            sendResponse({ status: "Timer paused at " + formattedTime });
          })();
          break;

        case "resumeTimer":
          (async () => {
            const remainingTime = await storageHelper.getRemainingTime(); //ms
            const remainingMin = remainingTime / 60000; // mins for alarm
            const formattedTime = formatTime(remainingTime); // format for readability
            const status = "running"; // Timer status for popup display

            if (remainingTime <= 0) {
              sendResponse({ status: "Cannot resume, timer already finished." });
              return;
            }

            // Update endTime so it's accurate for the resumed timer
            const newEndTime = Date.now() + remainingTime;
            await storageHelper.setEndTime(newEndTime);
            await chrome.alarms.clearAll();
            chrome.alarms.create("focusTimer", {delayInMinutes: remainingMin});
            await storageHelper.setStatus(status); //Saves current timer status
            sendResponse({ status: "Timer resumed with:" + formattedTime + " left."});
          })();
          break;

        case "resetTimer":
          (async () => {
            const status = "idle";
            
            //added the clear to avoid resume timer abuse if somehow possible
            await storageHelper.clear();
            await chrome.alarms.clearAll();
            await storageHelper.setStatus(status); //Saves current timer status
            sendResponse({ status: "Timer reset successful!"});
          })();
          break;

        default:
          sendResponse({ status: "Unknown action. Please check spelling."});
          break;
    }
  
  return true; // Keeps channel open for Async responses
});

/*
The onAlarm is a function that triggers whenever any alarm goes off.
This one has a listener appended to it.*/
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "focusTimer") {
    console.log("Timer complete!");
    // maybe add something here like an alert to the user.
  }
});

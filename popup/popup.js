// popup/popup.js

import storageHelper from "../background/storagehelper.js";
import { formatTime } from "../background/utils.js";

/* TODO: 2-Implement button changing mechanism based on timer status.*/

let timerStatus; // variable to run status-based conditions

let popupInterval; // ID for startCountdown interval

// Updates the popup's display, so the user can see the time go down
function updateDisplay(remainingMs) {
  document.getElementById('timedisplay').textContent = formatTime(remainingMs);
};

// This function will receive a Alarm status and time from SW's messages and will run
// a paralel interval when status = "running"
function startCountdown(status, time) {
  clearInterval(popupInterval); // Clears any potential ongoing intervals
  if(status === "running") {
    popupInterval = setInterval( () => {
      const remainingTime = time - Date.now();
      updateDisplay(remainingTime);
    }, 1000);
  } else {
    updateDisplay(time); // Shows either paused time or "start" time
  }
};

// Changes buttons content as they switch uses.
function buttonChanger (status) {
  switch (status) {
    case "idle":
      document.getElementById('startbutton').textContent = "Start";
      break;
    case "paused":
      document.getElementById('startbutton').textContent = "Resume";
      break;
    case "running":
      document.getElementById('startbutton').textContent = "Pause";
      break;
    default:
      document.getElementById('startbutton').textContent = "Start";
      break;
  }
};

// Multi-function button logic. 
// The DOM even listener already populates timerstatus when the popup loads, so this can run with just timerStatus.
document.getElementById('startbutton').addEventListener('click', () => {
  switch (timerStatus)  {
    case "idle":
      chrome.runtime.sendMessage({ action: "startTimer", data: "Timer start requested." }, (response) => {
        console.log("[popup]: Response received ->", response);
        timerStatus = response.status; // updates variable after each press so timer functions dont get stuck
        startCountdown(response.status, response.time);
        buttonChanger(response.status);
    });
      break;
    case "running":
      chrome.runtime.sendMessage({ action: "pauseTimer", data: "Timer pause requested." }, (response) => {
        console.log("[popup]: Response received ->", response);
        timerStatus = response.status;
        startCountdown(response.status, response.time);
        buttonChanger(response.status);
      });
      break;
    case "paused":
      chrome.runtime.sendMessage({ action: "resumeTimer", data: "Timer resume requested." }, (response) => {
        console.log("[popup]: Response received ->", response);
        timerStatus = response.status;
        startCountdown(response.status, response.time);
        buttonChanger(response.status);
      });
      break;
  }
});

document.getElementById('resetbutton').addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: "resetTimer", data: "Timer reset requested." }, (response) => {
    console.log("[popup]: Response received ->", response);
    timerStatus = response.status;
    startCountdown(response.status, response.time);
    buttonChanger(response.status);
  });
});

// Checks timer status when loading the popup to display time 
document.addEventListener('DOMContentLoaded', async () => {
  timerStatus = await storageHelper.getStatus(); // Fetches status to run conditions/functions
  if (timerStatus == "idle") {
    startCountdown(timerStatus, await storageHelper.getUserDuration() * 60000);
    buttonChanger(timerStatus);
  } else if (timerStatus == "running") {
    startCountdown(timerStatus, await storageHelper.getEndTime());
    buttonChanger(timerStatus);
  } else if (timerStatus == "paused") {
    startCountdown(timerStatus, await storageHelper.getRemainingTime());
    buttonChanger(timerStatus);
  }
}
); /* Despite the conditions being redundant due to startCountdown() already checking them, it makes
  the logic easier to follow than abstracting to a map function. */



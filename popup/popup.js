// popup/popup.js

import storageHelper from "../background/storagehelper.js";
import { formatTime } from "../background/utils.js";

/* TODO: 2-Implement button changing mechanism based on timer status.*/

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


document.getElementById('startbutton').addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: "startTimer", data: "Timer start requested." }, (response) => {
    console.log("[popup]: Response received ->", response);
    startCountdown(response.status, response.time);
  });
});

document.getElementById('pausebutton').addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: "pauseTimer", data: "Timer pause requested." }, (response) => {
    console.log("[popup]: Response received ->", response);
    startCountdown(response.status, response.time);
  });
});

document.getElementById('resumebutton').addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: "resumeTimer", data: "Timer resume requested." }, (response) => {
    console.log("[popup]: Response received ->", response);
    startCountdown(response.status, response.time);
  });
});

document.getElementById('resetbutton').addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: "resetTimer", data: "Timer reset requested." }, (response) => {
    console.log("[popup]: Response received ->", response);
    startCountdown(response.status, response.time);
  });
});

/* This code is responsible for showing the time going down to the user when the extension is opened 
  (the DOM loads). To reduce the load on the SW, It runs a local time estimation of the timer using 
  Chrome.Storage API and updates every second with a second less. This was also built in the possibility
  of the service worker going to sleep and not updating the timer on the frontend. This ensures that the
  user always knows the time. */

/* Issue: this doesn't update the frontend when the user interacts with the extension unless they
refresh it. This needs to be redone. */

document.addEventListener('DOMContentLoaded', async () => {
  const timerStatus = await storageHelper.getStatus();
  if (timerStatus == "idle") {
    const setDuration = await storageHelper.getDuration();
    document.getElementById('timedisplay').textContent = setDuration;
  } else if (timerStatus == "running") {
    setInterval(async() => {
      const remainingTime = (await storageHelper.getEndTime()) - Date.now();
      document.getElementById('timedisplay').textContent = formatTime(remainingTime);
    }, 1000);
  } else if (timerStatus == "paused") {
    const remainingTime = await storageHelper.getRemainingTime();
    document.getElementById('timedisplay').textContent = formatTime(remainingTime);
  }
});


document.addEventListener('DOMContentLoaded', async () => {
  const timerStatus = await storageHelper.getStatus(); // Fetches status to run conditions/functions
  if (timerStatus == "idle") {
    startCountdown(timerStatus, await storageHelper.getUserDuration() * 60000);
  } else if (timerStatus == "running") {
    startCountdown(timerStatus, await storageHelper.getEndTime());
  } else if (timerStatus == "paused") {
    startCountdown(timerStatus, await storageHelper.getRemainingTime());
  }
}
); /* Despite the conditions being redundant due to startCountdown() already checking them, it makes
  the logic easier to follow than abstracting to a map function. */



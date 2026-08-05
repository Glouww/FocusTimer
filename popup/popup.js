// popup/popup.js

import storageHelper from "../background/storagehelper.js";
import { formatTime } from "../background/utils.js";

/* TODO: 1-Implement timer polling logic to button event listeners
         2-Implement button changing mechanism based on timer status.*/

document.getElementById('startbutton').addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: "startTimer", data: "Timer start requested." }, (response) => {
    console.log("[popup]: Response received ->", response);
  });
});

document.getElementById('pausebutton').addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: "pauseTimer", data: "Timer pause requested." }, (response) => {
    console.log("[popup]: Response received ->", response);
  });
});

document.getElementById('resumebutton').addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: "resumeTimer", data: "Timer resume requested." }, (response) => {
    console.log("[popup]: Response received ->", response);
  });
});

document.getElementById('resetbutton').addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: "resetTimer", data: "Timer reset requested." }, (response) => {
    console.log("[popup]: Response received ->", response);
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

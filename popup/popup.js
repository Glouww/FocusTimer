// popup/popup.js

document.getElementById('startbutton').addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: "startTimer", data: "Timer start requested." }, (response) => {
    console.log("popup: Response received ->", response);
  });
});

document.getElementById('pausebutton').addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: "pauseTimer", data: "Timer pause requested." }, (response) => {
    console.log("popup: Response received ->", response);
  });
});

document.getElementById('resumebutton').addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: "resumeTimer", data: "Timer resume requested." }, (response) => {
    console.log("popup: Response received ->", response);
  });
});

document.getElementById('resetbutton').addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: "resetTimer", data: "Timer reset requested." }, (response) => {
    console.log("popup: Response received ->", response);
  });
});
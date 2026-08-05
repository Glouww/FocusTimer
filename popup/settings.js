import storageHelper from "../background/storagehelper.js";

let userDuration;
const confirmationH1 = document.getElementById("confirmationH1");

document.getElementById("submitBtn").onclick = () => {
    userDuration = document.getElementById("numberInput").value;
    confirmationH1.textContent = `Time has been set to: ${userDuration} minutes`;
    console.log(`Time has been set to: ${userDuration} minutes`);

    // Saves user set duration to storage API to be fetched by service worker.
    storageHelper.setUserDuration(userDuration);
};
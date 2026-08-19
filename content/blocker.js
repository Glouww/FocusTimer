
/* To do:
* - When to check for timer status (use run_at)
* - Acitvation function
* - Removal function
* */

let timerStatus = chrome.storage.local.get("timerStatus");
let div
// blocking and unblocking functions
function block() {
    div = document.createElement("div");
    div.attachShadow({mode: "open"}); //Attaches shadowDOM to the div to inject html

};











/* Potential approach for dynamic website list:
* 1 - DS to take in webistes
* 1.5 - run a for loop for every index when "run_at" happens
* 2 - if (tab.url.startsWith(extensions)
*  */
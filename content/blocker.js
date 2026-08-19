async function getTimerStatus() {
    const data = await chrome.storage.local.get("timerStatus");
    return data.timerStatus
}

async function applyBlocker() {
    const timerStatus = await getTimerStatus();
    if (timerStatus === "running"){
        block();
    } else {
        unblock();
    };
};

// blocking and unblocking functions

let div // declared so div is identifiable for block/unblock functions

function block() {
    div = document.createElement("div");
    const shadow = div.attachShadow({mode: "open"}); //Attaches shadowDOM to the div to inject html
    
    shadow.innerHTML = `
    <style>
        :host {
            background-color: hsl(0, 2%, 9%);
            position: fixed;
            inset: 0;
            z-index: 90000; /* High value to stay on top*/
            /* Flex properties to centre text and button*/
            display: flex;
            align-items: center;
            justify-content: center;
        }
        h1 {
            font-weight: bold;
            color: whitesmoke;
        }
    </style>
    <h1>Block Message</h1>
    <button id="button">Return</button>
    `;

    document.addEventListener("DOMContentLoaded", () => {
        document.body.appendChild(div);
    });
    shadow.getElementById("button").addEventListener("click", () => {
        console.log("Button clicked!"); // for now for debugging
    });
};

function unblock () {
    if (div) {
        document.body.removeChild(div);
        div = undefined;
    }
};



/* Potential approach for dynamic website list:
* 1 - DS to take in webistes
* 1.5 - run a for loop for every index when "run_at" happens
* 2 - if (tab.url.startsWith(extensions)
*  */
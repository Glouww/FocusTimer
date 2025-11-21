function startTimer(duration, display){
    var timer = duration, minutes, seconds;
    setInterval(function () {
        //time formatting
        minutes = parseInt(timer / 60,10)
        seconds = parseInt(timer % 60,10)

        //ensures timer always displays double digits
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        //time display
        display.textContent = minutes + ":" + seconds;
        
        //Stops time at 0
        if (--timer < 0) {
            timer = 0;
        }
    }, 1000);
}

//current timer activation
document.getElementById("thebutton").onclick = function () {
    var time = 10;
    display = document.getElementById("time");
    
    startTimer(time, display)
}
let root = document.documentElement;

const updateButton = document.getElementById('updateDetails');
const headlineDialog = document.getElementById('headlineDialog');
const outputBox = document.querySelector('output');

const confirmBtn = headlineDialog.querySelector('#confirmBtn');
const headline = document.getElementById('headline')
const headlineText = document.getElementById('headlineText')
const min = document.getElementById('min')

const display = document.querySelector('#time')

// If a browser doesn't support the dialog, then hide the
// dialog contents by default.
if (typeof headlineDialog.showModal !== 'function') {
    headlineDialog.hidden = true;
    /* a fallback script to allow this dialog/form to function
    for legacy browsers that do not support <dialog>
    could be provided here.*/
}

// "Update details" button opens the <dialog> modally
updateButton.addEventListener('click', () => {
    if (typeof headlineDialog.showModal === "function") {
        headlineDialog.showModal();
    } else {
        outputBox.value = "Sorry, the <dialog> API is not supported by this browser.";
    }
});

// "Confirm" button of form triggers "close" on dialog because of [method="dialog"]
headlineDialog.addEventListener('close', () => {
    console.log(headlineText.value)
    headline.innerText = headlineText.value
    let minutes = min.value
    startTimer();
});



// 360 divided by seconds is the ammount of degrees for the conic gradient


const FULL_DASH_ARRAY = 283;
const WARNING_THRESHOLD = 10;
const ALERT_THRESHOLD = 5;

const COLOR_CODES = {
    info: {
        color: "green"
    },
    warning: {
        color: "orange",
        threshold: WARNING_THRESHOLD
    },
    alert: {
        color: "red",
        threshold: ALERT_THRESHOLD
    }
};

const TIME_LIMIT = 60;

let timePassed = 0;
let timeLeft = TIME_LIMIT;
let timerInterval = null;
let remainingPathColor = COLOR_CODES.info.color;

document.getElementById("min").innerHTML = `
<div class="base-timer">
    <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <g class="base-timer__circle">
            <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
            <path
        id="base-timer-path-remaining"
        stroke-dasharray="283"
        class="base-timer__path-remaining ${remainingPathColor}"
        d="
        M 50, 50
        m -45, 0
        a 45,45 0 1,0 90,0
        a 45,45 0 1,0 -90,0
        "
        ></path>
    </g>
    </svg>
    <span id="base-timer-label" class="base-timer__label">${formatTime(timeLeft)}  
    </span>
</div>
`;

startTimer();

function onTimesUp() {
    clearInterval(timerInterval);
}

function startTimer() {
    let degrees = 6
    timerInterval = setInterval(() => {
        timePassed = timePassed += 1;
        timeLeft = TIME_LIMIT - timePassed;
        document.getElementById("time").innerHTML = formatTime(
            timeLeft
        );
        setCircleDasharray();
        setRemainingPathColor(timeLeft);

        root.style.setProperty('--degree', degrees + "deg");

        degrees = degrees + 6
        // if (degrees === 360) {
        //     degrees = 0
        //     root.style.setProperty('--degree', degrees + "deg");
        // }
        if (timeLeft === 0) {
            onTimesUp();
        }
    }, 1000);
}

function formatTime(time) {
    const minutes = Math.floor(time / 60);
    let seconds = time % 60;

    if (seconds < 10) {
        seconds = `0${seconds}`;
    }

    return `${minutes}:${seconds}`;
}

function setRemainingPathColor(timeLeft) {
    const { alert, warning, info } = COLOR_CODES;
    if (timeLeft <= alert.threshold) {
        document
            .getElementById("base-timer-path-remaining")
            .classList.remove(warning.color);
        document
            .getElementById("base-timer-path-remaining")
            .classList.add(alert.color);
    } else if (timeLeft <= warning.threshold) {
        document
            .getElementById("base-timer-path-remaining")
            .classList.remove(info.color);
        document
            .getElementById("base-timer-path-remaining")
            .classList.add(warning.color);
    }
}

function calculateTimeFraction() {
    const rawTimeFraction = timeLeft / TIME_LIMIT;
    return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
}

function setCircleDasharray() {
    const circleDasharray = `${(
        calculateTimeFraction() * FULL_DASH_ARRAY
    ).toFixed(0)} 283`;
    document
        .getElementById("base-timer-path-remaining")
        .setAttribute("stroke-dasharray", circleDasharray);
}
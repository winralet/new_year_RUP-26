(function() {
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame ||
    function(callback) {
        window.setTimeout(callback, 1000 / 60);
    };
    window.requestAnimationFrame = requestAnimationFrame;
})();

var flakes = [],
    canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d"),
    flakeCount = 200;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();

function snow() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < flakeCount; i++) {
        var flake = flakes[i];
        flake.y += flake.velY;

        if (flake.y >= canvas.height) {
            reset(flake);
        }

        ctx.beginPath();
        ctx.arc(flake.x, flake.y, flake.size, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255," + flake.opacity + ")";
        ctx.fill();
    }
    requestAnimationFrame(snow);
}

function reset(flake) {
    flake.x = Math.floor(Math.random() * canvas.width);
    flake.y = 0;
    flake.size = (Math.random() * 3) + 2;
    flake.speed = (Math.random() * 1) + 0.5;
    flake.velY = flake.speed;
    flake.opacity = (Math.random() * 0.5) + 0.3;
}

function init() {
    flakes = [];
    for (var i = 0; i < flakeCount; i++) {
        var x = Math.floor(Math.random() * canvas.width),
            y = Math.floor(Math.random() * canvas.height),
            size = (Math.random() * 3) + 2,
            speed = (Math.random() * 1) + 0.5,
            opacity = (Math.random() * 0.5) + 0.3;

        flakes.push({
            speed: speed, velY: speed,
            x: x, y: y,
            size: size, opacity: opacity
        });
    }
    snow();
}

window.addEventListener("resize", function() {
    resizeCanvas();
});

init();

const scrollButton = document.getElementById('scroll-btn');
if (scrollButton) {
    scrollButton.addEventListener('click', () => {
        const target = document.getElementById('countdownContainer');
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        if (typeof createGoldCircles === 'function') {
            setTimeout(createGoldCircles, 400);
        }
    });
}

let christmasStart = new Date('2027/01/01 00:00:00');
let countdownInterval = null;

function getTimeRemaining(deadline) {
    const total = Date.parse(deadline) - Date.parse(new Date());
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    return { total, days, hours, minutes, seconds };
}

function startTimer() {
    window.clearInterval(countdownInterval);
    countdownInterval = window.setInterval(() => {
        const time = getTimeRemaining(christmasStart);
        document.getElementById('days').innerText = time.days;
        document.getElementById('hours').innerText = time.hours;
        document.getElementById('minutes').innerText = time.minutes;
        document.getElementById('seconds').innerText = time.seconds;
    }, 200);
}
startTimer();

function stopTimer() {
    window.clearInterval(countdownInterval);
}


/* =========================================
   НАСТРОЙКИ
========================================= */

const canvas = document.getElementById('canvas');
const ctx = canvas?.getContext('2d');

let flakes = [];
let animationId = null;

const isMobile = window.matchMedia('(max-width: 768px)');

const reducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
);


/* =========================================
   СНЕГОПАД
========================================= */

function getFlakeCount() {

    if (reducedMotion.matches) {
        return 0;
    }

    return isMobile.matches ? 65 : 180;

}


function createFlake() {

    return {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,

        size: Math.random() * 2.5 + 1,

        speed: Math.random() * 1 + 0.5,

        opacity: Math.random() * 0.5 + 0.3,

        drift: Math.random() * 0.5 - 0.25
    };

}


function resizeCanvas() {

    if (!canvas || !ctx) return;

    const dpr = Math.min(
        window.devicePixelRatio || 1,
        2
    );

    canvas.width = Math.floor(
        window.innerWidth * dpr
    );

    canvas.height = Math.floor(
        window.innerHeight * dpr
    );

    ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
    );

    initSnow();

}


function initSnow() {

    flakes = [];

    for (let i = 0; i < getFlakeCount(); i++) {

        flakes.push(createFlake());

    }

}


function snow() {

    if (!canvas || !ctx || reducedMotion.matches) {
        return;
    }

    ctx.clearRect(
        0,
        0,
        window.innerWidth,
        window.innerHeight
    );

    for (const flake of flakes) {

        flake.y += flake.speed;
        flake.x += flake.drift;

        if (flake.y > window.innerHeight) {

            flake.y = -5;

            flake.x = Math.random() * window.innerWidth;

        }

        if (flake.x > window.innerWidth) {
            flake.x = 0;
        }

        if (flake.x < 0) {
            flake.x = window.innerWidth;
        }

        ctx.beginPath();

        ctx.arc(
            flake.x,
            flake.y,
            flake.size,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            `rgba(255,255,255,${flake.opacity})`;

        ctx.fill();

    }

    animationId = requestAnimationFrame(snow);

}


function startSnow() {

    if (animationId !== null) {

        cancelAnimationFrame(animationId);

        animationId = null;

    }

    if (reducedMotion.matches) {

        ctx?.clearRect(
            0,
            0,
            window.innerWidth,
            window.innerHeight
        );

        return;

    }

    animationId = requestAnimationFrame(snow);

}


function updateSnow() {

    initSnow();
    startSnow();

}


window.addEventListener('resize', resizeCanvas);

isMobile.addEventListener('change', updateSnow);

reducedMotion.addEventListener('change', updateSnow);

resizeCanvas();
startSnow();


/* =========================================
   УПРАВЛЕНИЕ ПРОКРУТКОЙ
========================================= */

const scrollButton = document.getElementById('scroll-btn');

const countdownContainer = document.getElementById(
    'countdownContainer'
);

let pageUnlocked = false;


/* Разблокировка страницы */

function unlockPage() {

    if (pageUnlocked) return;

    pageUnlocked = true;

    document.body.classList.remove('locked');

    document.body.classList.add('unlocked');

}


/* Переход к таймеру */

if (scrollButton && countdownContainer) {

    scrollButton.addEventListener('click', () => {

        if (!pageUnlocked) {

            unlockPage();

        }

        countdownContainer.scrollIntoView({

            behavior: reducedMotion.matches
                ? 'auto'
                : 'smooth',

            block: 'center'

        });

        if (typeof createGoldCircles === 'function') {

            setTimeout(createGoldCircles, 400);

        }

    });

}


/* =========================================
   ОБРАТНЫЙ ОТСЧЁТ
========================================= */

/* 1 января 2027 года, 00:00 */

const christmasStart = new Date(
    2027,
    0,
    1,
    0,
    0,
    0
).getTime();

let countdownInterval = null;


/* Получение времени */

function getTimeRemaining() {

    const total = Math.max(
        0,
        christmasStart - Date.now()
    );

    return {

        total,

        days: Math.floor(
            total / (1000 * 60 * 60 * 24)
        ),

        hours: Math.floor(
            (total / (1000 * 60 * 60)) % 24
        ),

        minutes: Math.floor(
            (total / (1000 * 60)) % 60
        ),

        seconds: Math.floor(
            (total / 1000) % 60
        )

    };

}


/* Обновление таймера */

function updateCountdown() {

    const time = getTimeRemaining();

    const elements = {

        days: document.getElementById('days'),

        hours: document.getElementById('hours'),

        minutes: document.getElementById('minutes'),

        seconds: document.getElementById('seconds')

    };

    for (const [key, element] of Object.entries(elements)) {

        if (element) {

            element.textContent = time[key];

        }

    }

    if (time.total <= 0) {

        stopTimer();

    }

}


/* Запуск */

function startTimer() {

    stopTimer();

    updateCountdown();

    countdownInterval = setInterval(
        updateCountdown,
        1000
    );

}


/* Остановка */

function stopTimer() {

    if (countdownInterval !== null) {

        clearInterval(countdownInterval);

        countdownInterval = null;

    }

}


/* Запуск таймера */

startTimer();

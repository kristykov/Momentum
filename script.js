import playList from './playList.js';

const time = document.querySelector('.time');
// const date = new Date();
// const currentTime = date.toLocaleTimeString();
const appDate = document.querySelector('.date');
let bgNum;
let ln;
let playNum = 0;

function showTime() {
    let date = new Date();
    let currentTime = date.toLocaleTimeString();
    time.textContent = currentTime;
    showDate();
    showGreeting();
}

function showDate() {
    let date = new Date();
    let options = { weekday: 'long', month: 'long', day: 'numeric' };
    let currentDate = date.toLocaleDateString('en-En', options);
    appDate.textContent = currentDate;
}

// showDate();
const createClock = setInterval(showTime, 1000);

// (function showTime() {
//     setTimeout(function () {
//         time.textContent = currentTime;
//         showTime();
//     }, 1);
// })();

// time.textContent = currentTime;
// setTimeout(showTime, 1000);

// let timerId = setTimeout(function tick() {
//     time.textContent = currentTime;
//     timerId = setTimeout(tick, 10);
// }, 10)


// Greeting
const greeting = document.querySelector('.greeting');

function getTimeOfDay() {
    let date = new Date();
    let hours = date.getHours();
    let timeOfDay;
    if (hours > 6 && hours < 13) {
        timeOfDay = 'morning';
    } else if (hours > 12 && hours < 18) {
        timeOfDay = 'afternoon';
    } else if (hours > 17 && hours < 24) {
        timeOfDay = 'evening';
    } else {
        timeOfDay = 'night';
    }
    return timeOfDay;
}

function showGreeting() {
    let timeOfDay = getTimeOfDay();
    let greetingText = `Good ${timeOfDay},`;
    greeting.textContent = greetingText;
    // greeting.textContent = greetingTranslation.ln[0];
}

//Store user's name
const userName = document.querySelector('.name');

//save data
function setLocalStorage() {
    localStorage.setItem('name', userName.value);
}

//restore and show data
function getLocalStorage() {
    if (localStorage.getItem('name')) {
        userName.value = localStorage.getItem('name');
    }
}

window.addEventListener('beforeunload', setLocalStorage);
window.addEventListener('load', getLocalStorage);

//background 

function getRandomNumber() {
    bgNum = Math.floor(Math.random() * (1 - 21) + 21);
    if (bgNum < 10) {
        bgNum = '0' + bgNum;
    }
    return bgNum;
}

getRandomNumber();

function setBg() {
    let timeOfDay = getTimeOfDay();
    const img = new Image();
    getLinkToImage().then(url => {
        img.src = url;
        img.onload = () => {
            document.body.style.backgroundImage = `url(${url})`;
        };
    });
    // console.log(url);
    // img.src = url;
    // img.onload = () => {
    //     document.body.style.backgroundImage = `url(${url})`;
    // };
    // img.src = `https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/${timeOfDay}/${bgNum}.jpg`;
    // img.onload = () => {
    //     document.body.style.backgroundImage = `url('https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/${timeOfDay}/${bgNum}.jpg')`;
    // };
}
setBg();

// background slider 
const slideNext = document.querySelector('.slide-next');
const slidePrev = document.querySelector('.slide-prev');


function getSlideNext() {
    bgNum = parseInt(bgNum) + 1;
    if (bgNum < 10) {
        bgNum = '0' + bgNum;
    } else if (bgNum == "21") {
        bgNum = '01';
    }
    setBg();
}

// getSlideNext();
function getSlidePrev() {
    bgNum = parseInt(bgNum) - 1;
    // console.log(bgNum);
    if (bgNum < 10 && bgNum > 0) {

        bgNum = '0' + bgNum;
    } else if (bgNum == "00") {
        bgNum = '20';
    }
    setBg();
}

slideNext.addEventListener('click', getSlideNext);
slidePrev.addEventListener('click', getSlidePrev);

//weather display
const weatherIcon = document.querySelector('.weather-icon');
const temperature = document.querySelector('.temperature');
const weatherDescription = document.querySelector('.weather-description');
const city = document.querySelector('.city');
const wind = document.querySelector('.wind');
const humidity = document.querySelector('.humidity');
let url;

city.addEventListener('change', (event) => {
    url = `https://api.openweathermap.org/data/2.5/weather?q=${event.target.value}&lang=ru&appid=251f169de2acd1482ee4e621040a7f0f&units=metric`;
    getWeather(url);
})

async function getWeather(url) {
    url = url || `https://api.openweathermap.org/data/2.5/weather?q=Минск&lang=be&appid=251f169de2acd1482ee4e621040a7f0f&units=metric`;
    const res = await fetch(url);
    const data = await res.json();
    weatherIcon.className = 'weather-icon owf';
    weatherIcon.classList.add(`owf-${data.weather[0].id}`);
    temperature.textContent = `${Math.floor(data.main.temp)}°C`;
    weatherDescription.textContent = data.weather[0].description;
    wind.textContent = `Скорость ветра: ${Math.floor(data.wind.speed)} м/с`;
    humidity.textContent = `Влажность: ${Math.floor(data.main.humidity)}%`;
    console.log(data.weather[0].id, data.weather[0].description, data.main.temp);
}

getWeather();

//quote generator
const quote = document.querySelector('.quote');
const author = document.querySelector('.author');
const changeQuote = document.querySelector('.change-quote');
// let randomQuoteNum;

async function getQuotes() {
    const quotes = 'data.json';
    const res = await fetch(quotes);
    const data = await res.json();
    return data;
}

getQuotes().then(data => {
    console.log(data);
    let randomQuoteNum = 1;
    changeQuote.addEventListener('click', () => {
        randomQuoteNum = Math.floor(Math.random() * (0 - 3) + 3);
        quote.textContent = `${data[randomQuoteNum].text}`;
        author.textContent = `${data[randomQuoteNum].author}`;
    });
});

getQuotes();

//player
const btn = document.querySelector('.play');
const audio = new Audio();
let isPlay = false;

function playAudio() {
    if (!isPlay) {
        audio.currentTime = 0;
        audio.src = playList[playNum].src;


        let items = document.querySelectorAll('.play-item');
        console.log(items[1]);
        for (let i = 0; i < items.length; i++) {
            if (playList[playNum].title == items[playNum].textContent) {
                items[playNum].classList.add('item-active');
            }
            console.log(items);

        }
        console.log(playList[playNum].title);
        // console.log(document.querySelector('.play-item').textContent == playList.title);
        // audio.src = `assets/sounds/${playNum}.mp3`;



        audio.play();
        isPlay = true;
    } else {
        audio.pause();
        isPlay = false;
    }
}



function toggleBtn() {
    btn.classList.toggle('pause');
}

btn.addEventListener('click', playAudio);
btn.addEventListener('click', toggleBtn);

//audio slider
const playNextBtn = document.querySelector('.play-next');
const playPrevBtn = document.querySelector('.play-prev');


function playNext() {
    console.log(playNum);
    if (playNum < 3) {
        playNum = playNum + 1;
    } else if (playNum = 3) {
        playNum = 0;
    }
    isPlay = false;
    playAudio();
    console.log(playNum);
}


function playPrev() {
    console.log(playNum);
    if (playNum == 0) {
        playNum = 3;
    } else if (playNum > 0) {
        playNum = playNum - 1;
    }
    isPlay = false;
    playAudio();
}

playNextBtn.addEventListener('click', playNext);
playPrevBtn.addEventListener('click', playPrev);

//play list
function createPlayList() {
    playList.forEach(el => {
        const li = document.createElement('li');
        li.classList.add('play-item');
        li.textContent = el.title;
        document.querySelector('.play-list').appendChild(li);
    })
}

createPlayList();

//translate the app

const greetingTranslation = {
    en: ['Good morning', 'Good afternoon', 'Good evening', 'Good night'],
    be: ['Добрай ранiцы', 'Добры дзень', 'Добры вечар', 'Дабранач'],
    ru: ['Доброе утро', 'Добрый день', 'Добрый вечер', 'Доброй ночи']
}

console.log(greetingTranslation.en[0]);

//getting bg from API

async function getLinkToImage() {
    let timeOfDay = getTimeOfDay();
    const url = `https://api.unsplash.com/photos/random?query=${timeOfDay}&client_id=1Ihgq4qZdOKsbRYYXgKLfymm580mFMJOQcRd91lNElg`;
    const res = await fetch(url);
    const data = await res.json();
    return data.urls.regular;
    // console.log(data.urls.regular);
}

getLinkToImage();
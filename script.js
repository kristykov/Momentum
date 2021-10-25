import playList from './playList.js';

const time = document.querySelector('.time');
// const date = new Date();
// const currentTime = date.toLocaleTimeString();
const appDate = document.querySelector('.date');
let bgNum;
let ln = 'en';
let greetingText;
let playNum = 0;
let bg = 'unsplash';

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
    let stringLn;
    if (ln == 'en') {
        stringLn = 'en-En';
    } else if (ln == 'ru') {
        stringLn = 'ru-Ru';
    }
    // let currentDate = date.toLocaleDateString('ru-Ru', options);
    let currentDate = date.toLocaleDateString(stringLn, options);
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


    if (ln == 'en') {
        if (hours > 6 && hours < 13) {
            timeOfDay = 'morning';
        } else if (hours > 12 && hours < 18) {
            timeOfDay = 'afternoon';
        } else if (hours > 17 && hours < 24) {
            timeOfDay = 'evening';
        } else {
            timeOfDay = 'night';
        }
    } else if (ln == 'ru') {
        if (hours > 6 && hours < 13) {
            greetingText = 'Доброе утро';
            timeOfDay = 'утро';
        } else if (hours > 12 && hours < 18) {
            greetingText = 'Добрый день';
            timeOfDay = 'день';
        } else if (hours > 17 && hours < 24) {
            greetingText = 'Добрый вечер';
            timeOfDay = 'вечер';
        } else {
            greetingText = 'Доброй ночи';
            timeOfDay = 'ночь';
        }
    }
    return timeOfDay;
}

function showGreeting() {
    let timeOfDay = getTimeOfDay();

    if (ln == 'en') {
        greetingText = `Good ${timeOfDay}`;
    }

    greetingTranslation[ln].forEach(el => {
        if (greetingText == el) {
            greeting.textContent = el;
        }
    })
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
    if (bg == 'unsplash') {
        getLinkToImage().then(url => {
            img.src = url;
            img.onload = () => {
                document.body.style.backgroundImage = `url(${url})`;
            };
        });
    } else if (bg == 'git') {
        img.src = `https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/${timeOfDay}/${bgNum}.jpg`;
        img.onload = () => {
            document.body.style.backgroundImage = `url('https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/${timeOfDay}/${bgNum}.jpg')`;
        };
    }
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
    url = `https://api.openweathermap.org/data/2.5/weather?q=${event.target.value}&lang=${ln}&appid=9022b0daa7aff96a90261bd8709ddbc5&units=metric`;
    getWeather(url);

})

async function getWeather(url) {
    try {
        url = url || `https://api.openweathermap.org/data/2.5/weather?q=Минск&lang=${ln}&appid=9022b0daa7aff96a90261bd8709ddbc5&units=metric`;
        const res = await fetch(url);
        const data = await res.json();
        weatherIcon.className = 'weather-icon owf';
        weatherIcon.classList.add(`owf-${data.weather[0].id}`);
        temperature.textContent = `${Math.floor(data.main.temp)}°C`;
        weatherDescription.textContent = data.weather[0].description;

        if (ln == 'en') {
            wind.textContent = `Wind speed: ${Math.floor(data.wind.speed)} m/s`;
            humidity.textContent = `Humidity: ${Math.floor(data.main.humidity)}%`;
        } else if (ln == 'ru') {
            wind.textContent = `Скорость ветра: ${Math.floor(data.wind.speed)} м/с`;
            humidity.textContent = `Влажность: ${Math.floor(data.main.humidity)}%`;
        }
    } catch (e) {
        document.querySelector('.weather-error').textContent = 'Error! City is not found';
        temperature.style.display = 'none';
        weatherDescription.style.display = 'none';
        wind.style.display = 'none';
        humidity.style.display = 'none';
    }
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
    changeQuote.addEventListener('click', () => {
        let randomQuoteNum = 1;
        if (ln == "en") {
            randomQuoteNum = Math.floor(Math.random() * (0 - 3) + 3);
            quote.textContent = `${data[randomQuoteNum].textEn}`;
            author.textContent = `${data[randomQuoteNum].authorEn}`;
        } else if (ln == "ru") {
            randomQuoteNum = Math.floor(Math.random() * (0 - 3) + 3);
            quote.textContent = `${data[randomQuoteNum].textRu}`;
            author.textContent = `${data[randomQuoteNum].authorRu}`;
        }
    })
});

// getQuotes();

//player
const btn = document.querySelector('.play');
const audio = new Audio();
let isPlay = false;
function playAudio() {
    if (!isPlay) {
        let songListItems = document.querySelectorAll('.play-item');
        audio.currentTime = 0;
        audio.src = playList[playNum].src;
        songListItems[playNum].classList.add('item-active');

        let activeSongItem = Array.from(songListItems).find((item) => {
            item.classList.contains('item-active');
        });
        if (activeSongItem) {
            activeSongItem.classList.remove('item-active');
        }
        // songListItems[playNum].classList.add('item-active');



        // for (let i = 0; i < items.length; i++) {
        //     if (playList[playNum].title == items[playNum].textContent) {
        //         console.log(items[playNum]);
        //         if (!items[playNum].classList.contains('item-active')) {
        //             items[playNum].classList.add('item-active');
        //         }
        //         else {
        //             items[playNum].classList.remove('item-active');
        //         }
        //     }
        //     console.log(items);
        // }
        // console.log(document.querySelector('.play-item').textContent == playList.title);
        // audio.src = `assets/sounds/${playNum}.mp3`;

        audio.play();
        isPlay = true;
    } else {
        audio.pause();
        isPlay = false;
    }
}

// let songListItems = document.querySelectorAll('.play-item');

// function changeSongLabel() {
//     let activeSongItem = Array.from(songListItems).find((item) => {
//         item.classList.contains('item-active');
//     });
//     if (activeSongItem) {
//         activeSongItem.classList.remove('item-active');
//     }
// }



function toggleBtn() {
    btn.classList.toggle('pause');
}

btn.addEventListener('click', playAudio);
btn.addEventListener('click', toggleBtn);

//audio slider
const playNextBtn = document.querySelector('.play-next');
const playPrevBtn = document.querySelector('.play-prev');


function playNext() {

    if (playNum < 3) {
        playNum = playNum + 1;
    } else if (playNum = 3) {
        playNum = 0;
    }
    isPlay = false;
    playAudio();

}


function playPrev() {

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
};

let enGreet = greetingTranslation[ln][0];
// greetingTranslation[ln].forEach(el => {
//     if (greetingText == el) {
//         console.log(el);
//     }
// })

// console.log(enGreet);

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

//settings
const setBtn = document.querySelector('.settings-icon');

setBtn.addEventListener('click', () => {
    document.getElementById('menu-settings').classList.toggle('menu-show');
    if (slideNext.style.display == "block") {
        slideNext.style = "display: none";
    } else {
        slideNext.style = "display: block";
    }
});

document.querySelector('.lang-switch').addEventListener('click', () => {
    if (ln == "en") {
        document.querySelector('.btn-lang').style = "left: 50%";
        ln = 'ru';
        getWeather();
        translateSettings();
        quote.textContent = `Сложность программы растет до тех пор, пока не превысит способности программиста`;
        author.textContent = `Артур Блох. Законы Мэрфи`;
        document.querySelector('.city').value = "Минск";
    } else {
        document.querySelector('.btn-lang').style = "left: 0";
        ln = 'en';
        translateSettings();
        getWeather();
        quote.textContent = `A computer program does what you tell it to do, not what you want it to do`;
        author.textContent = `Arthur Bloch, Murphy's Law`;
        document.querySelector('.city').value = "Minsk";
    }
});

document.querySelector('.psource-switch').addEventListener('click', () => {
    if (bg == 'unsplash') {
        document.querySelector('.btn-psource').style = "left: 50%";
        bg = 'git';
        setBg();

    } else {
        document.querySelector('.btn-psource').style = "left: 0";
        bg = 'unsplash';
        setBg();
    }
});

document.querySelector('.weather-switch').addEventListener('click', () => {
    if (!document.querySelector('.weather').classList.contains('weather-hide')) {
        document.querySelector('.weather').classList.add('weather-hide');
        document.querySelector('.btn-weather').style = "left: 50%";
    } else {
        document.querySelector('.weather').classList.remove('weather-hide');
        document.querySelector('.btn-weather').style = "left: 0";
    }
});

document.querySelector('.time-switch').addEventListener('click', () => {
    if (!document.querySelector('.time').classList.contains('time-hide')) {
        document.querySelector('.time').classList.add('time-hide');
        document.querySelector('.btn-time').style = "left: 50%";
    } else {
        document.querySelector('.time').classList.remove('time-hide');
        document.querySelector('.btn-time').style = "left: 0";
    }
});

document.querySelector('.date-switch').addEventListener('click', () => {
    if (!document.querySelector('.date').classList.contains('date-hide')) {
        document.querySelector('.date').classList.add('date-hide');
        document.querySelector('.btn-date').style = "left: 50%";
    } else {
        document.querySelector('.date').classList.remove('date-hide');
        document.querySelector('.btn-date').style = "left: 0";
    }
});

document.querySelector('.greeting-switch').addEventListener('click', () => {
    if (!document.querySelector('.greeting-container').classList.contains('greeting-container-hide')) {
        document.querySelector('.greeting-container').classList.add('greeting-container-hide');
        document.querySelector('.btn-greeting').style = "left: 50%";
    } else {
        document.querySelector('.greeting-container').classList.remove('greeting-container-hide');
        document.querySelector('.btn-greeting').style = "left: 0";
    }
});

document.querySelector('.audio-switch').addEventListener('click', () => {
    if (!document.querySelector('.player').classList.contains('player-hide')) {
        document.querySelector('.player').classList.add('player-hide');
        document.querySelector('.btn-player').style = "left: 50%";
    } else {
        document.querySelector('.player').classList.remove('player-hide');
        document.querySelector('.btn-player').style = "left: 0";
    }
});

const settingsTranslation = {
    en: ['Language', 'Photosource', 'Time', 'Date', 'Greeting', 'Weather', 'Audio Player'],
    ru: ['Язык', 'Фоторесурс', 'Время', 'Дата', 'Приветствие', 'Погода', 'Аудио Плейер']
};


function translateSettings() {
    if (ln == 'ru') {
        document.getElementById('lang').textContent = settingsTranslation[ln][0];
        document.getElementById('psource').textContent = settingsTranslation[ln][1];
        document.getElementById('time').textContent = settingsTranslation[ln][2];
        document.getElementById('date').textContent = settingsTranslation[ln][3];
        document.getElementById('greeting').textContent = settingsTranslation[ln][4];
        document.getElementById('weather').textContent = settingsTranslation[ln][5];
        document.getElementById('player').textContent = settingsTranslation[ln][6];
    }
    else if (ln == 'en') {
        document.getElementById('lang').textContent = settingsTranslation[ln][0];
        document.getElementById('psource').textContent = settingsTranslation[ln][1];
        document.getElementById('time').textContent = settingsTranslation[ln][2];
        document.getElementById('date').textContent = settingsTranslation[ln][3];
        document.getElementById('greeting').textContent = settingsTranslation[ln][4];
        document.getElementById('weather').textContent = settingsTranslation[ln][5];
        document.getElementById('player').textContent = settingsTranslation[ln][6];
    }
};





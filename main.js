const body = document.querySelector('body');
const colorsBox = document.querySelector('.colors__box');
const colorsInput = document.querySelectorAll('.colors__input');
const colorRandom = document.querySelector('.random-color');
const gradientRandom = document.querySelector('.random-gradient');

const calculatorOut = document.querySelector('.calculator__out');
const calculatorRows = document.querySelectorAll('.calculator__row');

const clockText = document.querySelector('.clock__text');

const themeBtn = document.querySelector('.theme__btn');
const themeImg = document.querySelector('.theme__img');

const randomBox = document.querySelectorAll('.random__box');
const randomBtn = document.querySelectorAll('.random__btn');

const converterSelect = document.querySelector('.converter__select');
const converterInput = document.querySelector('.converter__input');
const converterOut = document.querySelector('.converter__out span');

const searchList = document.querySelector('.search__list');
const searchInput = document.querySelector('.search__input');

const random = (min, max) => Math.floor(Math.random() * (max-min+1) + min);

//ЦВЕТА И ГРАДИЕНТ

const movementColor = e => {
    let x = e.clientX - body.offsetLeft
    colorsBox.style.backgroundColor = `hsl(${x}, 100%, 50%)`;
}

const randomColor = () => {
    const hexArray = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];
    let result = '';
    for(let i = 0; i < 6; i++) {
        result += hexArray[random(0, hexArray.length - 1)];
    }

    return result;
}

const randomGradient = () => {
    const gradientTypes = ['linear-gradient', 'radial-gradient', 'conic-gradient', 'repeating-linear-gradient',
                            'repeating-radial-gradient'];
    const gradientDirection = ['to top', 'to top right', 'to right', 'to bottom right', 'to bottom', 'to bottom left',
                                'to left', 'to top left', 'to center', 'to top left bottom right'];
    const color1 = randomColor();
    const color2 = randomColor();
    const randomGradientTypes = gradientTypes[random(0, gradientTypes.length - 1)];
    const randomGradientDirection = gradientDirection[random(0, gradientDirection.length - 1)];
    return `${randomGradientTypes}(${randomGradientDirection}, #${color1}, #${color2})`;
}

const toggleButton = (isColorRandom, isGradientRandom) => {
    colorRandom.disabled = isColorRandom;
    gradientRandom.disabled = isGradientRandom;
}

const backgroundRemove = () => {
    colorsBox.style.backgroundColor = `#fff`;
}

const selectionInput = () => {
    if(colorsInput[0].checked) {
        backgroundRemove();
        toggleButton(true, true);
        body.addEventListener('mousemove', movementColor)
    } else if(colorsInput[1].checked){
        backgroundRemove();
        body.removeEventListener('mousemove', movementColor)
        toggleButton(false, true);
        colorRandom.addEventListener('click', () => {
            colorsBox.style.backgroundColor = `#${randomColor()}`;
        })
    } else if(colorsInput[2].checked) {
        backgroundRemove();
        body.removeEventListener('mousemove', movementColor)
        toggleButton(true, false);
        gradientRandom.addEventListener('click', () => {
            colorsBox.style.background = randomGradient();
        })
    }
}

colorsInput.forEach(item => {
    item.addEventListener('click', selectionInput);
})

//КАЛЬКУЛЯТОР

const calculatorInput = (str, symb) => {
    const index = str.indexOf(symb);
    const num1 = Number(str.slice(0, index));
    const num2 = Number(str.slice(index+1));

    if(symb === '-') return num1 - num2;
    else if(symb === '+') return num1 + num2;
    else if(symb === '*') return num1 * num2;
    else if(symb === '/') return num1 / num2; 
}

const calculator = (str) => {
    if(str.includes('+')) {
        calculatorOut.value = calculatorInput(str, '+');
    } else if(str.includes('-')) {
        calculatorOut.value = calculatorInput(str, '-');
    } else if(str.includes('*')) {
        calculatorOut.value = calculatorInput(str, '*');
    } else if(str.includes('/')) {
        calculatorOut.value = calculatorInput(str, '/');
    }
}

const calculatorListener = e => {
    let num = e.target;
    if(num.textContent === '=') {
        calculator(calculatorOut.value)
    } else if(num.textContent === 'C') {
        calculatorOut.value = '';
    } else {
        calculatorOut.value += num.textContent;
    }
}

calculatorRows.forEach(item => {
    item.addEventListener('click', calculatorListener);
});

//ЧАСЫ С МИЛЛИСЕКУНДАМИ

const clock = () => { 
    setInterval(() => {
        const date = new Date();
        let hour = date.getHours();
        hour = hour < 10 ? `0${hour}` : `${hour}`;
        let minute = date.getMinutes();
        minute = minute < 10 ? `0${minute}` : `${minute}`;
        let second = date.getSeconds();
        second = second < 10 ? `0${second}` : `${second}`;
        let millisecond = date.getMilliseconds();
        clockText.textContent = `${hour} : ${minute} : ${second} : ${millisecond}`;
    }, 10)
}

clock();

const switchTheme = theme => {
    if(theme === 'dark') {
        body.style.backgroundColor = `#663399`;
        themeImg.src = `./dark.png`
    } else if(theme === 'light') {
        body.style.backgroundColor = `#B0E2FF`;
        themeImg.src = `./light.png`
    }
}

themeBtn.addEventListener('click', () => {
    if(!themeBtn.classList.contains('theme_dark')) {
        switchTheme('dark');
        themeBtn.classList.add('theme_dark');
        
    } else {
        switchTheme('light');
        themeBtn.classList.remove('theme_dark');
        
    }
})

randomBtn.forEach((item, index) => {
    item.addEventListener('click', () => {
        randomBox[index].style.backgroundColor = `#${randomColor()}`;
    })
})

const converter = () => {
    const currencies = {
        'USD': 83.58,
        'EUR': 90.29,
        'GBP': 106.53
    }

    if(converterSelect.value === 'USD') {
        converterOut.textContent = Math.floor(Number(converterInput.value) * currencies.USD);
    } else if(converterSelect.value === 'EUR') {
        converterOut.textContent = Math.floor(Number(converterInput.value) * currencies.EUR);
    } else if(converterSelect.value === 'GBP') {
        converterOut.textContent = Math.floor(Number(converterInput.value) * currencies.GBP);
    }
}

converterInput.addEventListener('keyup', converter);

let result = new Set();

const letterSearch = arr => {
    searchInput.addEventListener('input', () => {
        result.clear();
        searchList.innerHTML = '';
    
        if(searchInput.value !== '') {
            for(let item of arr) {
                if(item.toLowerCase().indexOf(searchInput.value.toLowerCase()) != -1) {
                    result.add(item);
                    const li = document.createElement('li');
                    li.textContent = item;
                    li.className = 'search__list-item';
                    searchList.append(li);
                } 
                
            }
        }
        
      })
}

const countrisData = async () => {
    const responce = await fetch('./countries.json');
    const data = await responce.json();
    letterSearch(data.countries)
}

countrisData ()

const like = document.querySelector('.like');
const dis = document.querySelector('.dis');
const likesText = document.querySelectorAll('.likes__text');

let likeCount = 0;
let disCount = 0;

const likeCounter = (counter) => {
    if(counter == 'like') {
        likeCount++;
        likesText[0].textContent = likeCount;
    } else if(counter == 'dis') {
        disCount++;
        likesText[1].textContent = disCount;
    }
}


like.addEventListener('click', ()=> likeCounter('like'));
dis.addEventListener('click', ()=> likeCounter('dis'));

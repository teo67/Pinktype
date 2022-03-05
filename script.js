let words;
const main = document.getElementById("main");
const wpm = document.getElementById("WPM");
const waves = document.getElementById("waves");
const topwaves = document.getElementById("topwaves");
const fly = document.getElementById("fly");
let currentIndex = 0;
let wordsCompleted = 0;
let startTime = null;
const add = () => {
    const newElement = document.createElement("div");
    newElement.className = "word";
    const chosenWord = words[Math.floor(Math.random() * words.length)];
    for(let j = 0; j < chosenWord.length; j++) {
        const newLetter = document.createElement("p");
        newLetter.className = "letter";
        newLetter.innerText = chosenWord[j];
        newElement.appendChild(newLetter);
    }
    main.appendChild(newElement);
    if(newElement.getBoundingClientRect().left < window.innerWidth) {
        add();
    }
}

const scheduleDelete = async element => {
    await new Promise(r => setTimeout(r, 1500));
    element.remove();
}

const init = async () => {
    for(let i = 0; i < 100; i++) {
        for(const storage of [waves, topwaves]) {
            const newElement = document.createElement("div");
            newElement.style.left = `${i}vw`;
            storage.appendChild(newElement);
        }
    }
    try {
        words = await (await fetch("words.json")).json();
    } catch(e) {
        console.log(`Could not read file: ${e}`);
    }
}

const registerInput = e => {
    if(startTime == null) {
        startTime = Date.now();
    }
    let current = main.firstElementChild;
    while(current.classList.contains("inactive")) {
        current = current.nextElementSibling;
    }
    if(currentIndex == current.children.length) {
        if(String.fromCharCode(e.keyCode) == ' ') {
            current.classList.remove("active");
            current.classList.add("inactive");
            //main.firstElementChild.remove();
            wordsCompleted++;
            currentIndex = 0;
            current.nextElementSibling.classList.add("active");
            current.nextElementSibling.firstElementChild.classList.add("active");
            wpm.innerText = `${Math.round(wordsCompleted / ((Date.now() - startTime) / 60000))} WPM`;
            scheduleDelete(current);
            add();
        }
        return;
    }
    if(String.fromCharCode(e.keyCode).toLowerCase() != current.children[currentIndex].innerText) {
        current.children[currentIndex].classList.add("incorrect");
    }
    current.children[currentIndex].classList.remove("active");
    current.children[currentIndex].classList.add("inactive");
    currentIndex++;
    if(currentIndex < current.children.length) {
        current.children[currentIndex].classList.add("active");
    }
}

const updateWaves = () => {
    const currentDate = Date.now();
    for(const storage of [waves, topwaves]) {
        for(let i = 0; i < storage.children.length; i++) {
            const sine = Math.sin((2 * Math.PI * i) / 25 + (currentDate / 200));
            storage.children[i].style.height = `${5 + 3 * sine}vw`;
            storage.children[i].style.opacity = `${20 + (1 - sine) * 30}%`;
        }
    }
}

const newfly = () => {
    const newElement = document.createElement("div");
    newElement.style.bottom = `${Math.random() * 100}vh`;
    newElement.style.animationDuration = `${Math.random() * 1.5 + 0.5}s`;
    fly.appendChild(newElement);
}

init().then(() => {
    add();
    main.firstElementChild.classList.add("active");
    main.firstElementChild.firstElementChild.classList.add("active");
    document.addEventListener('keydown', registerInput);
    setInterval(updateWaves, 10);
    setInterval(newfly, 100);
    fly.addEventListener('animationend', event => {
        event.target.remove();
    });
});
import { LoremIpsum } from "lorem-ipsum";
import { userService } from "./user.service";

export const utilService = {
    makeId,
    makeLorem,
    getRandomIntInclusive,
    debounce,
    saveToStorage,
    loadFromStorage,
    generateText,
    generateRandomUsername,
    generateRandomFullname,
    generateRandomTimestamp,
    generateRandomTimestampFrom,
    generateRandomPastTime,
    dateTimeShortDisplay,
    dateTimeLongDisplay,
    getPassedTimeString,
    alignTexts,
    capitalizeWord,
    getUniqueRandomElements,
    chooseRandomItemFromList
}

function makeId(length = 6) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }

    return txt
}

function makeLorem(size = 100) {
    var words = ['The sky', 'above', 'the port', 'was', 'the color of television', 'tuned', 'to', 'a dead channel', '.', 'All', 'this happened', 'more or less', '.', 'I', 'had', 'the story', 'bit by bit', 'from various people', 'and', 'as generally', 'happens', 'in such cases', 'each time', 'it', 'was', 'a different story', '.', 'It', 'was', 'a pleasure', 'to', 'burn']
    var txt = ''
    while (size > 0) {
        size--
        txt += words[Math.floor(Math.random() * words.length)] + ' '
    }
    return txt
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min //The maximum is inclusive and the minimum is inclusive 
}

function debounce(func, timeout = 300) {
    let timer
    return (...args) => {
        clearTimeout(timer)
        timer = setTimeout(() => { func.apply(this, args) }, timeout)
    }
}

function saveToStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
}

function loadFromStorage(key) {
    const data = localStorage.getItem(key)
    return (data) ? JSON.parse(data) : undefined
}

function generateText() {
    return new LoremIpsum().generateSentences(1);
}

function generateRandomUsername() {
    const firstNames = [
        "Alice", "Bob", "Charlie", "David", "Eva", "Frank", "Grace", "Henry", "Ivy", "Jack",
        "Katherine", "Leo", "Mia", "Nathan", "Olivia", "Peter", "Quinn", "Rachel", "Samuel", "Tara",
        "Ulysses", "Victoria", "Walter", "Xena", "Yasmine", "Zane", "Abigail", "Benjamin", "Catherine", "Daniel",
        "Eleanor", "Felix", "Giselle", "Harrison", "Isabel", "Jasper", "Kylie", "Liam", "Megan", "Nolan",
        "Ophelia", "Preston", "Quincy", "Rose", "Sebastian", "Taylor", "Uma", "Vincent", "Wendy", "Xavier", "Yvonne", "Zachary"
      ];
    const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const randomNumber = Math.floor(Math.random() * 1000); // You can adjust the range of numbers as needed
    return `${randomFirstName}_${randomNumber}`;
}
      
function generateRandomFullname(username) {
    const lastNames = [
        "Smith", "Johnson", "Williams", "Jones", "Brown", "Davis", "Miller", "Wilson", "Moore", "Taylor",
        "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin", "Thompson", "Garcia", "Martinez", "Robinson",
        "Clark", "Rodriguez", "Lewis", "Lee", "Walker", "Hall", "Allen", "Young", "Hernandez", "King",
        "Wright", "Lopez", "Hill", "Scott", "Green", "Adams", "Baker", "Gonzalez", "Nelson", "Carter",
        "Mitchell", "Perez", "Roberts", "Turner", "Phillips", "Campbell", "Parker", "Evans", "Edwards", "Collins"
    ];    
    const firstName = username.split('_')[0]
    const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    return `${firstName} ${randomLastName}`;
}
      
function generateRandomTimestamp() {
    //const startTime = new Date('2023-11-01').getTime();
    const startTime = new Date().setDate(new Date().getDate() - 3) // 3 days ago
    const endTime = Date.now();
    const timeDiff = endTime - startTime
    const randomTime = Math.random() * timeDiff;
    return new Date(startTime + randomTime);
}

function generateRandomTimestampFrom(startTimestamp) {
   const endTime = Date.now();
    const timeDiff = endTime - startTimestamp
    const randomTime = Math.random() * timeDiff;
    const result = new Date(startTimestamp + randomTime); 
    return result;
}

function generateRandomPastTime() {
    const HOUR = 1000 * 60 * 60
    //const DAY = 1000 * 60 * 60 * 24
    const WEEK = 1000 * 60 * 60 * 24 * 7
    const pastTime = getRandomIntInclusive(HOUR, WEEK)
    return Date.now() - pastTime
}

function dateTimeShortDisplay(dateTime) {
    let dateTimeDisplay = new Date(dateTime);
    return dateTimeDisplay.toDateString() == new Date().toDateString() ?
        dateTimeDisplay.toLocaleTimeString(undefined, {
            second: '2-digit',
            minute: '2-digit',
            hour: '2-digit'
        }) :
        dateTimeDisplay.toLocaleDateString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric'
        })
}

function dateTimeLongDisplay(dateTime) {
    let dateTimeDisplay = new Date(dateTime);
    return dateTimeDisplay.toLocaleString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
        second: '2-digit',
        minute: '2-digit',
        hour: '2-digit',
    })
}

function getPassedTimeString(timestamp) {
    const now = new Date();
    const date = new Date(timestamp);
    const seconds = Math.floor((now - date) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    return days > 0 ? `${days}d` : hours > 0 ? `${hours}h` : `${minutes}m`
}

function alignTexts (textArray) {
    const maxLength = Math.max(...(textArray.map(item => item.length)));
    return textArray.map(item => item.padEnd(maxLength,' '));
}

function capitalizeWord(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

function getUniqueRandomElements(array, numElements, uniqueProperty=null, exclude=[]) {
    let elementsSet = new Set()
    numElements = Math.min(numElements, array.length)
    while (elementsSet.size < numElements) {
        const rand = Math.floor(Math.random() * array.length)
        if (uniqueProperty && exclude.includes(array[rand][uniqueProperty]))
            continue
        uniqueProperty ? elementsSet.add(array[rand][uniqueProperty]) : elementsSet.add(array[rand])
    }
    return Array.from(elementsSet)
 }

 function chooseRandomItemFromList(list) {
    if (!list || list.length == 0)
        return null
    return list[Math.floor(Math.random() * list.length)];
}







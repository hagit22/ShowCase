import { storageService } from './async-storage.service'
import { utilService } from './util.service.js'
//import { httpService } from './http.service'

const STORAGE_KEY_LOGGED_IN_USER = 'loggedInUser'
const STORAGE_KEY_USERS = 'users_db'
const USER_ID_LENGTH = 6;


export const userService = {
    login,
    logout,
    signup,
    getLoggedInUser,
    saveLocalUser,
    getUsers,
    getById,
    getByUsername,
    remove,
    update,
    changeImage,
    chooseRandomUser,
    chooseRandomUserList,
    generateInitialUsers
}

window.userService = userService

function getUsers() {
    return storageService.query(STORAGE_KEY_USERS)
    // return httpService.get(`user`)
}

async function getById(userId) {
    const user = await storageService.get(STORAGE_KEY_USERS, userId)
    // const user = await httpService.get(`user/${userId}`)
    return user
}

async function getByUsername(username) {
    const user = await storageService.getByName(STORAGE_KEY_USERS, username)
    // const user = await httpService.get(`user/${userId}`)
    return user
}

function remove(userId) {
    return storageService.remove(STORAGE_KEY_USERS, userId)
    // return httpService.delete(`user/${userId}`)
}

async function update({ _id, score }) {
    const user = await storageService.get(STORAGE_KEY_USERS, _id)
    user.score = score
    await storageService.put(STORAGE_KEY_USERS, user)

    // const user = await httpService.put(`user/${_id}`, {_id, score})

    // When admin updates other user's details, do not update loggedInUser
    if (getLoggedInUser()._id === user._id) saveLocalUser(user)
    return user
}

async function login(userCred) {
    const users = await storageService.query(STORAGE_KEY_USERS)
    const user = users.find(user => user.username === userCred.username)
    // const user = await httpService.post('auth/login', userCred)
    if (user) return saveLocalUser(user)
}

async function signup(userCred) {
    if (!userCred.imgUrl) userCred.imgUrl = 'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png'
    const user = await storageService.post(STORAGE_KEY_USERS, userCred)
    // const user = await httpService.post('auth/signup', userCred)
    return saveLocalUser(user)
}

async function logout() {
    sessionStorage.removeItem(STORAGE_KEY_LOGGED_IN_USER)
    // return await httpService.post('auth/logout')
}

async function changeImage(imgUrl) {
    const user = getLoggedInUser()
    if (!user) throw new Error('Not loggedIn')
    user.imgUrl = imgUrl
    await update(user)
    return user.imgUrl
}

function saveLocalUser(user) {
    user = { 
        _id: user._id, 
        username: user.username, 
        password: user.password, 
        fullname: user.fullname, 
        imgUrl: user.imgUrl }
    sessionStorage.setItem(STORAGE_KEY_LOGGED_IN_USER, JSON.stringify(user))
    return user
}

function getLoggedInUser() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGED_IN_USER))
}

function chooseRandomUser(users) {
    return users[Math.floor(Math.random() * users.length)];
}

function chooseRandomUserList(users, maxAmount) {
    maxAmount = Math.floor(maxAmount)
    const numChosenUsers = Math.floor(Math.random() * maxAmount)
    const chosenUsers = []
    for (let i=0; i<numChosenUsers; i++) {
        chosenUsers.push(chooseRandomUser(users))
    }
    return Array.from(new Set(chosenUsers)); // make unique using Set (then convert back to Array so it can convert to json)
}

function generateInitialUsers() {
    let initialUsers = utilService.loadFromStorage(STORAGE_KEY_USERS)
    if (!initialUsers || !initialUsers.length) {
        initialUsers = [];
        initialUsers.push(_generateLoggedInUser())
        for (let i = 0; i < 20; i++) 
            initialUsers.push(_generateUser(userService.getLoggedInUser()));
        utilService.saveToStorage(STORAGE_KEY_USERS, initialUsers)
    }
    return initialUsers
}

function _generateUser() {
    const userId = utilService.makeId(USER_ID_LENGTH)
    const userImgUrl = `https://picsum.photos/seed/${userId}/470/600`
    return {
        _id: userId,
        username: utilService.generateRandomUsername(), 
        imgUrl: userImgUrl,
    }
}

function _generateLoggedInUser() {
    const userId = utilService.makeId(USER_ID_LENGTH)
    const username = "Instush"
    const userImgUrl = `https://picsum.photos/seed/${username}1/470/600`
    const loggedInUser = {
        _id: userId,
        username: username,
        password: "1234",
        fullname: "Instagram User",
        imgUrl: userImgUrl
    }
    userService.saveLocalUser(loggedInUser) 
    return loggedInUser 
}



// ;(async ()=>{
//     await userService.signup({fullname: 'Hagit', username: 'hagit', password:'1234',imgUrl: 'assets/data/userImg/hagit.jpg'})
//     await userService.signup({fullname: 'Buku', username: 'buku', password:'1234', imgUrl: 'assets/data/userImg/buku.jpg'})
//     await userService.signup({fullname: 'Diana', username: 'diana', password:'1234', imgUrl: 'assets/data/userImg/diana.jpg'})
// })()


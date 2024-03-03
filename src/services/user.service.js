import { storageService } from './async-storage.service'
import { utilService } from './util.service.js'
//import { httpService } from './http.service'

const STORAGE_KEY_LOGGED_IN_USER = 'loggedInUser'
const STORAGE_KEY_USERS = 'users_db'
const USER_ID_LENGTH = 6
const NUM_DISPLAY_USERS = 5


export const userService = {
    login,
    logout,
    signup,
    getLoggedInUser,
    getMiniLoggedInUser,
    getNumDisplayUsers,
    getUsers,
    getById,
    getByUsername,
    remove,
    update,
    changeImage,
    followUser,
    unFollowUser,
    chooseRandomUserList,
    chooseRandomUser,
    generateInitialUsers
}

export const followLabels = {
    FOLLOW: "Follow",
    FOLLOWING: "Following"
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

async function update(user) {
    await storageService.put(STORAGE_KEY_USERS, user)
    if (getLoggedInUser() && getLoggedInUser()._id === user._id) 
        _saveLocalUser(user)
    return user
}

async function login(userCred) {
    const users = await storageService.query(STORAGE_KEY_USERS)
    const user = users.find(user => user.username === userCred.username)
    // const user = await httpService.post('auth/login', userCred)
    if (user) return _saveLocalUser(user)
}

async function signup(userCred) {
    if (!userCred.imgUrl) userCred.imgUrl = 'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png'
    const user = await storageService.post(STORAGE_KEY_USERS, userCred)
    // const user = await httpService.post('auth/signup', userCred)
    return _saveLocalUser(user)
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

async function followUser(userToFollow) {
    const loggedInUser = getLoggedInUser()
    loggedInUser.following.push(_getMiniUser(userToFollow))
    await update(loggedInUser)
    userToFollow.followers.push(_getMiniUser(loggedInUser))
    await update(userToFollow)
}

async function unFollowUser(userToUnFollow) {
    let loggedInUser = getLoggedInUser()
    loggedInUser.following = loggedInUser.following.filter(user => user._id !== userToUnFollow._id)
    await update(loggedInUser)
    userToUnFollow.followers = userToUnFollow.followers.filter(user => user._id !== loggedInUser._id)
    await update(userToUnFollow)
}

function getLoggedInUser() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGED_IN_USER))
}

function getMiniLoggedInUser() {
    return _getMiniUser(getLoggedInUser())
}

function getNumDisplayUsers() {
    return NUM_DISPLAY_USERS
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

function chooseRandomUser(users, excludeId='') {
    if (excludeId)
        users = users.filter(user => user._id != excludeId)
    return _getMiniUser(utilService.chooseRandomItemFromList(users));
}

function generateInitialUsers() {
    let initialUsers = utilService.loadFromStorage(STORAGE_KEY_USERS) || []
    if (initialUsers.length === 0) {
        for (let i = 0; i < 10; i++) 
            initialUsers.push(_generateUser());
    }
    // we always want to make sure we have a loggedInUser- as it is temporary per session
    const newLoggedInUser = _generateSessionLoggedInUser(initialUsers)
    if (newLoggedInUser) { // newly created 
        initialUsers.push(newLoggedInUser)
        utilService.saveToStorage(STORAGE_KEY_USERS, initialUsers)
    }
    return initialUsers
}

function _generateUser() {
    const userId = utilService.makeId(USER_ID_LENGTH)
    const userImgUrl = `https://picsum.photos/seed/${userId}/470/600`
    const username = utilService.generateRandomUsername()
    return {
        _id: userId,
        username: username, 
        fullname: utilService.generateRandomFullname(username), 
        imgUrl: userImgUrl,
        bookmarkedStories: [],
        following: [],
        followers: []
    }
}

function _generateSessionLoggedInUser(initialUsers) {
    const uniqueURLseed = "!!==loggedInUser==!!"
    const uniqueImgUrl = `https://picsum.photos/seed/${uniqueURLseed}1/470/600` 
    // we want loggedInUser from session-storage to have the same id within the 'initialUsers' list
    let loggedInUser = initialUsers.filter(user=>user.imgUrl === uniqueImgUrl)[0] || undefined
    if (!loggedInUser)  {
        loggedInUser = {
            _id: utilService.makeId(USER_ID_LENGTH),
            username: "Instush",
            password: "1234",
            fullname: "My Name:)", //"Instagram User",
            imgUrl: uniqueImgUrl,
            bookmarkedStories: [],
            following: [],
            followers: []
        }
        _saveLocalUser(loggedInUser)
        return loggedInUser
    }
    // we always want to save in session-storage - as it is temporary per session
    _saveLocalUser(loggedInUser) 
    return null // loggedInUser already existed. no need to return it
}

function _saveLocalUser(user) {
    user = { 
        _id: user._id, 
        username: user.username, 
        password: user.password, 
        fullname: user.fullname, 
        imgUrl: user.imgUrl,
        bookmarkedStories: [...user.bookmarkedStories],
        following: [...user.following],
        followers: [...user.followers]
    }
    sessionStorage.setItem(STORAGE_KEY_LOGGED_IN_USER, JSON.stringify(user))
    return user
}

function _getMiniUser(user) {
    if (!user)
        return null
    const { _id, username, imgUrl } = user
    return({ _id, username, imgUrl })
}



// ;(async ()=>{
//     await userService.signup({fullname: 'Hagit', username: 'hagit', password:'1234',imgUrl: 'assets/data/userImg/hagit.jpg'})
//     await userService.signup({fullname: 'Buku', username: 'buku', password:'1234', imgUrl: 'assets/data/userImg/buku.jpg'})
//     await userService.signup({fullname: 'Diana', username: 'diana', password:'1234', imgUrl: 'assets/data/userImg/diana.jpg'})
// })()


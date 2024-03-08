import { storageService } from './async-storage.service'
import { sessionStorageService } from './session-storage.service.js'

export const userServiceLocal = {
    getUsers,
    getById,
    getByUsername,
    remove, 
    save,
    signup,
    login,
    logout
}

const STORAGE_KEY_USERS = 'users_db'
window.userServiceLocal = userServiceLocal

function getUsers() {
    return storageService.query(STORAGE_KEY_USERS)
}

async function getById(userId) {
    const user = await storageService.get(STORAGE_KEY_USERS, userId)
    return user
}

async function getByUsername(username) {
    const user = await storageService.getByName(STORAGE_KEY_USERS, username)
    return user
}

function remove(userId) {
    return storageService.remove(STORAGE_KEY_USERS, userId)
}

async function save(user) {
    await storageService.put(STORAGE_KEY_USERS, user)
    if (sessionStorageService.getLoggedInUser() && sessionStorageService.getLoggedInUser()._id === user._id) 
        sessionStorageService.saveLocalUser(user)
    return user
}

async function signup(userCred) {
    if (!userCred.imgUrl) userCred.imgUrl = 'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png'
    const user = await storageService.post(STORAGE_KEY_USERS, userCred)
    return sessionStorageService.saveLocalUser(user)
}

async function login(userCred) {
    const users = await storageService.query(STORAGE_KEY_USERS)
    const user = users.find(user => user.username === userCred.username)
    if (user) return sessionStorageService.saveLocalUser(user)
}

function logout() {
    sessionStorageService.removeLocalUser()
}




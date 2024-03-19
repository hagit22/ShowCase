import Axios from 'axios'
import { sessionStorageService } from './session-storage.service.js'
import BASE_URL from './route-base.js'

export const userServiceRemote = {
    getUsers,
    getById,
    getByUsername,
    remove,
    save,
    signup,
    login,
    logout,
}

var axios = Axios.create({
    withCredentials: true,
})

const BASE_URL_USER = BASE_URL + 'user/'
const BASE_URL_AUTH = BASE_URL + 'auth/'


async function getUsers() {
    try {
        var { data: users } = await axios.get(BASE_URL_USER)
        console.log("user service getUsers: ",users)
        return users
    }
    catch (err) {
        throw err.response.data // example of where axios puts the error-message which came from our server
    }
}

async function getById(userId) {
    const url = BASE_URL_USER + "u/" + userId
    var { data: user } = await axios.get(url)
    //return user
    return _getUserWithDefaults(user)
}

async function getByUsername(username) {
    const url = BASE_URL_USER + username
    var { data: user } = await axios.get(url) 
    //console.log("user service getByUsername: ",user)  
    //return user
    return _getUserWithDefaults(user)
}

async function remove(userId) {
    const url = BASE_URL_USER + "u/" + userId
    var { data: res } = await axios.delete(url)
    return res
}

async function save(user) {
    console.log("user service save-1: ",user)
    const method = user._id ? 'put' : 'post'
    const url = BASE_URL_USER 
    const { data: savedUser } = await axios[method](url, user)
    return savedUser
}

async function signup(credentials) {
    try {
        const { data: user } = await axios.post(BASE_URL_AUTH + 'signup', credentials)
        return sessionStorageService.saveLocalUser(user)
    }
    catch (err) {
        throw err.response.data
    }
}

async function login(credentials) {
    const { data: user } = await axios.post(BASE_URL_AUTH + 'login', credentials)
    if (user) {
        return sessionStorageService.saveLocalUser(user)
    }
}

async function logout() {
    await axios.post(BASE_URL_AUTH + 'logout')
    sessionStorageService.removeLocalUser()
}

function _getUserWithDefaults(user) {
    const userWithDefaults = { 
        _id: user._id, 
        username: user.username, 
        imgUrl: user.imgUrl || "https://www.gravatar.com/avatar/?d=identicon",
        fullname: user.fullname,
        following: user.following || [],
        followers: user.followers || [],
        bookmarkedStories: user.bookmarkedStories || [],
        notifications: user.notifications || []
    }
    return userWithDefaults
}







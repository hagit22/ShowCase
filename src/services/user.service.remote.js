import Axios from 'axios'
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
        return users
    }
    catch (err) {
        throw err.response.data // example of where axios puts the error-message which came from our server
    }
}

async function getById(userId) {
    const url = BASE_URL_USER + userId
    var { data: user } = await axios.get(url)   
    return user
}

async function getByUsername(username) {
    const url = BASE_URL_USER + username
    var { data: user } = await axios.get(url)   
    return user
}

async function remove(userId) {
    const url = BASE_URL_USER + userId
    var { data: res } = await axios.delete(url)
    return res
}

async function save(user) {
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







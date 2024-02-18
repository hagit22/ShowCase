import { userService } from "../../services/user.service.js";
import { socketService } from "../../services/socket.service.js";
import { store } from '../../store/store.js'

import { showErrorMsg } from '../../services/event-bus.service.js'
import { LOADING_DONE, LOADING_START } from "../reducers/system.reducer.js";
import { userActionTypes } from "../reducers/user.reducer.js";

export const userActions = {
    loadUsers,
    removeUser,
    login,
    signup,
    logout,
    loadUser,
    updateUser
}


async function loadUsers() {
    try {
        store.dispatch({ type: LOADING_START })
        const users = await userService.getUsers()
        store.dispatch({ type: userActionTypes.SET_USERS, users })
    } catch (err) {
        console.log('UserActions: err in loadUsers', err)
    } finally {
        store.dispatch({ type: LOADING_DONE })
    }
}

async function removeUser(userId) {
    try {
        await userService.remove(userId)
        store.dispatch({ type: userActionTypes.REMOVE_USER, userId })
    } catch (err) {
        console.log('UserActions: err in removeUser', err)
    }
}

async function login(credentials) {
    try {
        const user = await userService.login(credentials)
        store.dispatch({
            type: userActionTypes.SET_USER,
            user
        })
        socketService.login(user)
        return user
    } catch (err) {
        console.log('Cannot login', err)
        throw err
    }
}

async function signup(credentials) {
    try {
        const user = await userService.signup(credentials)
        store.dispatch({
            type: userActionTypes.SET_USER,
            user
        })
        socketService.login(user)
        return user
    } catch (err) {
        console.log('Cannot signup', err)
        throw err
    }
}

async function logout() {
    try {
        await userService.logout()
        store.dispatch({
            type: userActionTypes.SET_USER,
            user: null
        })
        socketService.logout()
    } catch (err) {
        console.log('Cannot logout', err)
        throw err
    }
}

async function loadUser(username) {
    try {
        const user = await userService.getByUsername(username);
        store.dispatch({ type: userActionTypes.SET_WATCHED_USER, user })
    } catch (err) {
        showErrorMsg('Cannot load user')
        console.log('Cannot load user', err)
    }
}

async function updateUser(updatedUser) {
    try {
        const savedUser = await userService.update(updatedUser)
        store.dispatch({ type: userActionTypes.SET_USER, savedUser })
        return savedUser
    } catch (err) {
        console.log('Cannot save user', err)
        throw err
    }
}

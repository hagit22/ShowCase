import { sessionStorageService } from "../../services/session-storage.service.js";
import { userService } from "../../services/user.service.js";
import { socketService } from "../../services/socket.service.js";
import { store } from '../../store/store.js'

import { showErrorMsg } from '../../services/event-bus.service.js'
import { LOADING_DONE, LOADING_START } from "../reducers/system.reducer.js";
import { userActionTypes } from "../reducers/user.reducer.js";

export const userActions = {
    loadUserList,
    removeUser,
    login,
    signup,
    logout,
    loadCurrentUser,
    updateCurrentUser,
    loadChosenUser,
    followUser,
    unFollowUser
}


async function loadUserList() {
    try {
        store.dispatch({ type: LOADING_START })
        const users = await userService.getUsers()
        store.dispatch({ type: userActionTypes.SET_USER_LIST, userList: users })
    } catch (err) {
        console.log('UserActions: err in loadUserList', err)
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
        store.dispatch({ type: userActionTypes.SET_CURRENT_USER, currentUser: user })
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
        store.dispatch({ type: userActionTypes.SET_CURRENT_USER, currentUser: user })
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
        store.dispatch({ type: userActionTypes.SET_CURRENT_USER, currentUser: null })
        socketService.logout()
    } catch (err) {
        console.log('Cannot logout', err)
        throw err
    }
}

async function loadCurrentUser() {
    try {
        const loadedUser = await sessionStorageService.getLoggedInUser()
        store.dispatch({ type: userActionTypes.SET_CURRENT_USER, currentUser: loadedUser })
        return loadedUser
    } catch (err) {
        console.log('Cannot save user', err)
        throw err
    }
}

async function updateCurrentUser(updatedUser) {
    try {
        const savedUser = await userService.save(updatedUser)
        store.dispatch({ type: userActionTypes.SET_CURRENT_USER, currentUser: savedUser })
        return savedUser
    } catch (err) {
        console.log('Cannot save user', err)
        throw err
    }
}

async function loadChosenUser(username) {
    try {
        const user = await userService.getByUsername(username);
        store.dispatch({ type: userActionTypes.SET_CHOSEN_USER, chosenUser: user })
    } catch (err) {
        showErrorMsg('Cannot load user')
        console.log('Cannot load user', err)
        store.dispatch({ type: userActionTypes.SET_CHOSEN_USER, chosenUser: null })
    }
}

async function followUser(userToFollow) {
    try {
        await userService.followUser(userToFollow)
        loadCurrentUser()
        loadChosenUser(userToFollow.username)
    } catch (err) {
        console.log('Cannot save user', err)
        throw err
    }
}

async function unFollowUser(userToUnFollow) {
    try {
        await userService.unFollowUser(userToUnFollow)
        loadCurrentUser()
        loadChosenUser(userToUnFollow.username)
    } catch (err) {
        console.log('Cannot save user', err)
        throw err
    }
}






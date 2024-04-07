import { sessionStorageService } from "../../services/session-storage.service.js";
import { socketService, notificationMessages } from "../../services/socket.service.js";
import { userService } from "../../services/user.service.js";
import { store } from '../../store/store.js'
import { storyActions } from "./story.actions.js";
import { userActionTypes } from "../reducers/user.reducer.js";
import { LOADING_DONE, LOADING_START } from "../reducers/system.reducer.js";

export const userActions = {
    loadUserList,
    removeUser,
    signup,
    login,
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

async function signup(credentials) {
    try {
        const user = await userService.signup(credentials)
        const loggedInUser = await loadCurrentUser()
        //store.dispatch({ type: userActionTypes.SET_CURRENT_USER, currentUser: user }) // loadCurrentUser does dispatch instead
        return loggedInUser
    } catch (err) {
        console.log('Cannot signup', err)
        throw err
    }
}

async function login(credentials) {
    try {
        const user = await userService.login(credentials)
        const loggedInUser = await loadCurrentUser(true)
        //store.dispatch({ type: userActionTypes.SET_CURRENT_USER, currentUser: user }) // loadCurrentUser does dispatch instead
        return loggedInUser
    } catch (err) {
        console.log('Cannot login', err)
        throw err
    }
}

async function logout() {
    try {
        await userService.logout()
        store.dispatch({ type: userActionTypes.SET_CURRENT_USER, currentUser: null })
    } catch (err) {
        console.log('Cannot logout', err)
        throw err
    }
}

async function loadCurrentUser(loadStories=false) {
    try {
        const miniUser = sessionStorageService.getLoggedInUser()
        const loggedInUser = await userService.getByUsername(miniUser.username);
        store.dispatch({ type: userActionTypes.SET_CURRENT_USER, currentUser: loggedInUser })
        if (loadStories)
            await storyActions.loadStories(loggedInUser)
        return loggedInUser
    } catch (err) {
        console.log('Cannot save user', err)
        throw err
    }
}

async function updateCurrentUser(updatedUser) {
    try {
        const savedUser = await userService.save(updatedUser)
        console.log("updateCurrentUser -",savedUser)
        store.dispatch({ type: userActionTypes.SET_CURRENT_USER, currentUser: savedUser })
        await loadCurrentUser()
        //return savedUser
    } catch (err) {
        console.log('Cannot save user', err)
        throw err
    }
}

async function loadChosenUser(username) {
    try {
        const user = await userService.getByUsername(username);
        console.log("loadChosenUser: ",user)
        store.dispatch({ type: userActionTypes.SET_CHOSEN_USER, chosenUser: user })
    } catch (err) {
        console.log('Cannot load user', err)
        store.dispatch({ type: userActionTypes.SET_CHOSEN_USER, chosenUser: null })
    }
}

async function followUser(userToFollow) {
    try {
        await userService.followUser(userToFollow)
        const loggedInUser = await loadCurrentUser(true)
        loadChosenUser(userToFollow.username)
        socketService.emitUserFollow(userToFollow._id)
    } catch (err) {
        console.log('Cannot save user', err)
        throw err
    }
}

async function unFollowUser(userToUnFollow) {
    try {
        await userService.unFollowUser(userToUnFollow)
        loadCurrentUser(true)
        loadChosenUser(userToUnFollow.username)
    } catch (err) {
        console.log('Cannot save user', err)
        throw err
    }
}






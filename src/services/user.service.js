import { sessionStorageService } from './session-storage.service.js'
import { utilService } from './util.service.js'
import { storyService } from './story.service.js'
import { userServiceRemote } from './user.service.remote.js'

export const userService = {
    getUsers: userServiceRemote.getUsers,
    getById: userServiceRemote.getById,
    getByUsername: userServiceRemote.getByUsername,
    remove: userServiceRemote.remove,
    save: userServiceRemote.save,

    signup: userServiceRemote.signup,
    login: userServiceRemote.login,
    logout: userServiceRemote.logout,

    getMiniUser,
    getMiniLoggedInUser,
    getNumDisplayUsers,
    getNumDisplayStories,
    followUser,
    unFollowUser,
    getFollowLabels,
    createUserNotification,
    changeImage
}

const USER_ID_LENGTH = 6
const NUM_DISPLAY_USERS = 5
const NUM_DISPLAY_STORIES = 7

const followLabels = {
    FOLLOW: "Follow",
    FOLLOWING: "Following"
}

function getMiniUser(user) {
    if (!user)
        return null
    const { _id, username, imgUrl } = user
    return ({ _id, username, imgUrl })
}

function getMiniLoggedInUser(user) {
    return getMiniUser(sessionStorageService.getLoggedInUser())
}

function getNumDisplayUsers() {
    return NUM_DISPLAY_USERS
}

function getNumDisplayStories() {
    return NUM_DISPLAY_STORIES
}

async function followUser(userToFollow) {
    const miniUser = sessionStorageService.getLoggedInUser()
    let loggedInUser = await userServiceRemote.getByUsername(miniUser.username);
    loggedInUser.following.push(getMiniUser(userToFollow))
    await userServiceRemote.save(loggedInUser)
    userToFollow.followers.push(getMiniUser(loggedInUser))
    await userServiceRemote.save(userToFollow)
}

async function unFollowUser(userToUnFollow) {
    const miniUser = sessionStorageService.getLoggedInUser()
    let loggedInUser = await userServiceRemote.getByUsername(miniUser.username);
    loggedInUser.following = loggedInUser.following.filter(user => user._id !== userToUnFollow._id)
    await userServiceRemote.save(loggedInUser)
    userToUnFollow.followers = userToUnFollow.followers.filter(user => user._id !== loggedInUser._id)
    await userServiceRemote.save(userToUnFollow)
}

function getFollowLabels() {
    return followLabels
}

function createUserNotification(txt, aboutUser, storyImgUrl) {
    console.log("createNewNotification: ",txt,aboutUser,storyImgUrl)
    return {
        _id: utilService.makeId(USER_ID_LENGTH),
        txt: txt,
        aboutUser: aboutUser ? getMiniUser(aboutUser) : null,
        storyImgUrl: storyImgUrl,
        createdAt: Date.now(), 
    }
}

async function changeImage(imgUrl) {
    const miniUser = sessionStorageService.getLoggedInUser()
    let loggedInUser = await userServiceRemote.getByUsername(miniUser.username);
    if (!user) throw new Error('Not loggedIn')
    loggedInUser.imgUrl = imgUrl
    await userServiceRemote.save(loggedInUser)
    return loggedInUser.imgUrl
}









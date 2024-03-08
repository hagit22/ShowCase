import { sessionStorageService } from './session-storage.service.js'
import { userServiceRemote } from './user.service.remote.js'

export const userService = {
    getUsers: userServiceRemote.getUsers,
    getById: userServiceRemote.getById,
    getByUsername: userServiceRemote.getByUsername,
    remove: userServiceRemote.remove,
    save,
    //save: userServiceLocal.save,

    signup: userServiceRemote.signup,
    login: userServiceRemote.login,
    logout: userServiceRemote.logout,

    getMiniUser,
    getMiniLoggedInUser,
    getNumDisplayUsers,
    followUser,
    unFollowUser,
    getFollowLabels,
    changeImage
}

const NUM_DISPLAY_USERS = 5

const followLabels = {
    FOLLOW: "Follow",
    FOLLOWING: "Following"
}

async function save(user) {
    return await userServiceRemote.save(user)
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

async function followUser(userToFollow) {
    const loggedInUser = sessionStorageService.getLoggedInUser()
    loggedInUser.following.push(getMiniUser(userToFollow))
    await save(loggedInUser)
    userToFollow.followers.push(getMiniUser(loggedInUser))
    await save(userToFollow)
}

async function unFollowUser(userToUnFollow) {
    let loggedInUser = sessionStorageService.getLoggedInUser()
    loggedInUser.following = loggedInUser.following.filter(user => user._id !== userToUnFollow._id)
    await save(loggedInUser)
    userToUnFollow.followers = userToUnFollow.followers.filter(user => user._id !== loggedInUser._id)
    await save(userToUnFollow)
}

function getFollowLabels() {
    return followLabels
}

async function changeImage(imgUrl) {
    const user = sessionStorageService.getLoggedInUser()
    if (!user) throw new Error('Not loggedIn')
    user.imgUrl = imgUrl
    await save(user)
    return user.imgUrl
}









import io from 'socket.io-client'
import { BASE_SOCKET_URL }  from './route-base.js'

export const socketService = {
    socketConnect,
    socketDisconnect,
  
    emitUserIdentify,
    emitUserFollow,
    emitUserPost,

    onNewUser,
    onNewFollower,
    onNewStory,
    onStoryByFollowing,
}

const clientMessages = {
    userIdentify: 'user-identify',  // gets: { sendingUserId }
    userFollow: 'user-follow',      // gets: { followingUserId }
    userPost: 'user-post'           // gets: { followersList, storyId }
}
 
const notificationTypes = {
    newUser: 'new-user',                    // gets: { newUserId }
    newFollower: 'new-follower',            // gets: { newFollowerId }
    newStory: 'new-story',                  // gets: { newStoryId }
    storyByFollowing: 'story-by-following'  // gets: { followingUserId, storyId }
  }
  
export const notificationMessages = {
    newUser: 'just joined Instushgram', //'who you might know is on Instushgram',
    newFollower: 'started following you',
    storyByFollowing: 'posted a thread you might like',
    none: ''
}


const socketHandler = io(BASE_SOCKET_URL, {
    autoConnect: true,
    /*transports: ['websocket']*/
})


function socketConnect(loggedInUser) {

    socketHandler.on('connect', () => {
        console.log("Connected to Socket")
        emitUserIdentify(loggedInUser._id)
    })

    socketHandler.on('disconnect', () => {
        console.log("Disconnected from Socket")
    })
    
    socketHandler.on("connect_error", (err) => {
        console.log("error-message: ",err.message);
        console.log("error-description: ",err.description);
        console.log("error-context: ",err.context);
    });

    //socketHandler.connect()
}

function socketDisconnect() {
    socketHandler.disconnect()
    //socketHandler.close()
}

function onNewUser(callback) {
    socketHandler.on(notificationTypes.newUser, ({newUserId}) => {
        console.log("Socket: onNewUser: ", newUserId)
        callback(notificationTypes.newUser, newUserId, '', notificationMessages.newUser)
    })
}
  
function onNewFollower(callback) {
    socketHandler.on(notificationTypes.newFollower, ({newFollowerId}) => {
        console.log("Socket: onNewFollower: ", newFollowerId)
        callback(notificationTypes.newFollower, newFollowerId, '', notificationMessages.newFollower)
    })
}

function onNewStory(callback) {
    socketHandler.on(notificationTypes.newStory, ({newStoryId}) => {
        console.log("Socket: onNewStory: ", newStoryId)
        callback(notificationTypes.newStory, '', newStoryId, notificationMessages.none)
    }) 
}

function onStoryByFollowing(callback) {
    socketHandler.on(notificationTypes.storyByFollowing, ({followingUserId, storyId}) => {
      console.log("Socket: onStoryByFollowing: ", followingUserId, storyId)
      callback(notificationTypes.storyByFollowing, followingUserId, storyId, notificationMessages.storyByFollowing)
    })
}

function emitUserIdentify(sendingUserId) {
    try {
        console.log("emitUserIdentify: sendingUserId - ",sendingUserId)
        socketHandler.emit(clientMessages.userIdentify, {sendingUserId})
    }
    catch(err) {
        console.log("emitUserIdentify - error", err)
    }
}

function emitUserFollow(followingUserId) {
    try {
        console.log("emitUserFollow: followingUser - ",followingUserId)
        socketHandler.emit(clientMessages.userFollow, {followingUserId})
    }
    catch(err) {
        console.log("emitUserFollow - error", err)
    }
}

function emitUserPost(followersList, storyId) {
    try {
        console.log("emitUserPost: story - ",storyId," followers: ",followersList)
        socketHandler.emit(clientMessages.userPost, {followersList, storyId})
    }
    catch(err) {
        console.log("emitUserPost - error", err)
    }
}









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

export const notificationMessages = {
    newUser: 'joined Instushgram, give them a warm welcome',
        //'just joined Instushgram', //'who you might know is on Instushgram',
    newFollower: 'started following you, see what they are up to',
    storyByFollowing: 'posted a thread you might like, check it out',
    none: ''
}

export const notificationTypes = {
    newUser: 'new-user',                    // gets: { newUserId, newUserImgUrl, newUserName }
    newFollower: 'new-follower',            // gets: { newFollowerId }
    newStory: 'new-story',                  // gets: { newStoryId }
    storyByFollowing: 'story-by-following'  // gets: { followingUserId, storyImgUrl }
}
  
const clientMessages = {
    userIdentify: 'user-identify',  // gets: { sendingUserId }
    userFollow: 'user-follow',      // gets: { followingUserId }
    userPost: 'user-post'           // gets: { followersIdList, storyId }
}
 

const socketHandler = io(BASE_SOCKET_URL, {
    autoConnect: true,
    /*transports: ['websocket']*/
})


function socketConnect(loggedInUser) {

    socketHandler.on('connect', () => {
        //console.log("Connected to Socket")
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
    socketHandler.on(notificationTypes.newUser, ({newUserId, newUserImgUrl, newUserName}) => {
        console.log("Socket: onNewUser: ", newUserId, newUserImgUrl, newUserName)
        callback(notificationTypes.newUser, newUserId, newUserImgUrl, newUserName, notificationMessages.newUser)
    })
}
  
function onNewFollower(callback) {
    socketHandler.on(notificationTypes.newFollower, ({newFollowerId}) => {
        console.log("Socket: onNewFollower: ", newFollowerId)
        callback(notificationTypes.newFollower, newFollowerId, '', '', notificationMessages.newFollower)
    })
}

function onNewStory(callback) {
    socketHandler.on(notificationTypes.newStory, ({newStoryId}) => {
        console.log("Socket: onNewStory: ", newStoryId)
        callback(notificationTypes.newStory, '', newStoryId, notificationMessages.none)
    }) 
}

function onStoryByFollowing(callback) {
    socketHandler.on(notificationTypes.storyByFollowing, ({followingUserId, storyImgUrl}) => {
      console.log("Socket: onStoryByFollowing: ", followingUserId, storyImgUrl)
      //console.log("callback: ", callback)
      callback(notificationTypes.storyByFollowing, followingUserId, storyImgUrl, '', notificationMessages.storyByFollowing)
    })
}

function emitUserIdentify(sendingUserId) {
    try {
        //console.log("emitUserIdentify: sendingUserId - ",sendingUserId)
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

function emitUserPost(followersIdList, storyId) {
    try {
        console.log("emitUserPost: story - ",storyId," followers: ",followersIdList)
        socketHandler.emit(clientMessages.userPost, {followersIdList, storyId})
    }
    catch(err) {
        console.log("emitUserPost - error", err)
    }
}









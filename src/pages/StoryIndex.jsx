import { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from "react-router"
import { socketService } from '../services/socket.service.js'
import { genDataService } from '../services/gen-data.service.js'
import { userService } from '../services/user.service.js'
import { userActions } from '../store/actions/user.actions.js'
import { storyActions } from '../store/actions/story.actions.js'
import { NavBar } from '../cmps/NavBar.jsx'
import { StoriesBar } from '../cmps/StoriesBar.jsx'
import { StoryList } from '../cmps/StoryList.jsx'
import { UsersBar } from '../cmps/UsersBar.jsx'
import { UserDetails } from './UserDetails.jsx'
import { NotificationsPane } from '../cmps/NotificationsPane'
import notificationSound from "../assets/sound/notification.wav"

export function StoryIndex({navSelection}) {

    // store state variables
    const currentUser = useSelector(storeState => storeState.userModule.currentUser)
    const userList = useSelector(storeState => storeState.userModule.userList)
    const stories = useSelector(storeState => storeState.storyModule.stories)

    const [initialNavSelection, setInitialNavSelection] = useState(navSelection)
    const [userNotifications, setUserNotifications] = useState([])
    const [showNotificationsPane, setShowNotificationsPane] = useState(false)
    const [newPostsNotification, setNewPostsNotification] = useState(false)
    const [newUserNotification, setNewUserNotification] = useState(false)

    const elNotificationsPaneRef = useRef()
    const username = useParams().username
    const audioPlayer = useRef(null)

    useEffect(() => {
        loadAppData() 
        setNewUserNotification(false)
        socketService.socketConnect()
        socketService.onNewStory(() => {
            console.log("Socket message: NEW-POST NOTIFICATION")
            setNewPostsNotification(true)
        })
        return () => {
            socketService.onNewStory(null)
            socketService.socketDisconnect()
        }
    }, [])

    useEffect(() => {
        loadAppData()
        setNewPostsNotification(false)
    }, [stories.length])  // For when user uploads new photo, and we want to update the local list - for immediate display to user  

    useEffect(() => {
        if (!userList || userList.length === 0)
           return
        socketService.onNewUser(onNewNotification)
        socketService.onNewFollower(onNewNotification)
        socketService.onStoryByFollowing(onNewNotification)
        return () => {
            socketService.onNewUser(null)
            socketService.onNewFollower(null)
            socketService.onStoryByFollowing(null)
        }
    }, [userList]) // userList is required for onNewNotification() callback, otherwise 'Closure' will put null

    useEffect(() => {
        if (currentUser)
            socketService.emitUserIdentify(currentUser)     // => Should move to Store
    }, [currentUser])

    useEffect(() => {
        if (!currentUser || !currentUser.notifications) {
            setUserNotifications([])
            return
        }
        setUserNotifications([...(currentUser.notifications)])
    }, [currentUser, currentUser.notifications])

    useEffect(() => {
        if (!currentUser || !currentUser.notifications || !userNotifications)
            return
        if (userNotifications.length > currentUser.notifications.length)
            onUpdateUser({...currentUser, notifications: [...userNotifications]})
    }, [userNotifications])

    useEffect(() => {
        setNewUserNotification(prev => showNotificationsPane ? false : prev)
    }, [showNotificationsPane])

    useEffect(() => {
        if (newUserNotification === true) 
            audioPlayer.current.play();
    }, [newUserNotification])

    async function loadAppData() {
        const loadedUser = await loadCurrentUser()
        //console.log("loadedUser: ",loadedUser)
        userActions.loadUserList()
        //console.log(userList)
        storyActions.loadStories(loadedUser)
        //console.log("loadedStories: ",stories)
    }

    async function loadCurrentUser() {
        try {
            const loadedUser = await userActions.loadCurrentUser()
            return loadedUser
        }
        catch (err) {
            console.log("loadCurrentUser ERROR: ",err)
            const loadedUser = await genDataService.defaultLogin()
            console.log("**** Logged In  :",loadedUser)
            console.log("********************************************")
            return loadedUser
        }
    }

    function onNewNotification(notificationType, aboutUserId, imgUrl, aboutUserName, notificationMessage) {
        console.log("GOT - onNewNotification: ",notificationType, aboutUserId, imgUrl, aboutUserName, notificationMessage)
        const aboutUser = aboutUserName ? {_id: aboutUserId, username: aboutUserName, imgUrl} :  // in case of new signup, user is still not in userList
            userList.filter(user=>user._id === aboutUserId)[0]
        const notification = userService.createUserNotification(notificationMessage, aboutUser, imgUrl || null)
        console.log("The New Notification is: ",notification, "length before: ",userNotifications.length)
        setUserNotifications(prev => [notification, ...prev])
        console.log("all notifications: ",currentUser,userNotifications.length,": ",userNotifications)
        if (!showNotificationsPane)
            setNewUserNotification(true)
    }

    async function onAddStory(story) {
        try {
            const savedStory = await storyActions.addStory(story, currentUser)
            //console.log("onAddStory: ",savedStory)
        } catch (err) {
            console.log("onAddStory error: ",err)
        }        
    }

    async function onUpdateStory(story) {
        try {
            const savedStory = await storyActions.updateStory(story)
            //console.log("onUpdateStory: ",savedStory)
        } catch (err) {
            console.log("onUpdateStory error: ",err)
        }        
    }

    function onUpdateUser(updatedUser) {
        try {
            userActions.updateCurrentUser(updatedUser)
            console.log("onUpdateUser: saved -",updatedUser)
            console.log("onUpdateUser: current -",currentUser)
        } 
        catch (err) {
            console.log("onUpdateUser error: ",err)
        }        
    }

    function onShowNotifications(showNotifications) {
        setShowNotificationsPane(showNotifications)
    }

    function onNavSelect(selection) {
        if (selection !== initialNavSelection)
            setInitialNavSelection(selection)
    }

    function onClickAnywhere({target}) {
        if (showNotificationsPane && !elNotificationsPaneRef.current.contains(target)) {
            setShowNotificationsPane(false)
            setInitialNavSelection('')
        }
    }

    async function onClickNewPosts() {
        await storyActions.loadStories(currentUser)
        setNewPostsNotification(false)
    }

    return ( !currentUser ? '' :
        <div className={username ? 'user-details' : 'app'}>
            <div className="nav-bar">
                <NavBar initialSelection={initialNavSelection} onSelect={onNavSelect} 
                    onAddStory={onAddStory} onShowNotifications={onShowNotifications}/>
            </div>

            <div className="center-section">
                {(username) ? <UserDetails currentUser={currentUser}/> :
                <div>
                    <div className="main-content" onClick={onClickAnywhere}>
                        <StoriesBar className="stories-bar" userList={userList} currentUser={currentUser} 
                            numDisplayStories={userService.getNumDisplayStories()}/>
                        <div>
                            <StoryList stories={stories} onUpdateStory={onUpdateStory} 
                                currentUser={currentUser} onUpdateUser={onUpdateUser}/>
                        </div>
                    </div>
                </div>}
            </div>

            {(username) ? '' :
            <div className="users-bar" onClick={onClickAnywhere}>
                <UsersBar userList={userList} currentUser={currentUser} numDisplayUsers={userService.getNumDisplayUsers()}/>
            </div>}

            <div ref={elNotificationsPaneRef}>
                <NotificationsPane show={showNotificationsPane} currentUser={currentUser} 
                    userList={userList} userNotifications={userNotifications}/>
            </div>
            <audio ref={audioPlayer} src={notificationSound} />
            
            {/* Overlays */}
            <div className={`new-posts-overlay ${newPostsNotification ? " new-posts-visible" : ''}`}>
                        <button className="new-posts-button" onClick={onClickNewPosts}>New posts</button>
            </div>
            <div className={`new-notification-overlay ${newUserNotification ? " new-notification-visible" : ''}`}/>
        </div>
    )
}

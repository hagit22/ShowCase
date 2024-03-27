import { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from "react-router"
import { socketService } from '../services/socket.service.js'
import { genDataService } from '../services/gen-data.service.js'
import { userService } from '../services/user.service.js'
import { userActions } from '../store/actions/user.actions.js'
import { storyActions } from '../store/actions/story.actions.js'
import { NavBar } from '../cmps/NavBar.jsx'
import { StoryList } from '../cmps/StoryList.jsx'
import { UsersBar } from '../cmps/UsersBar.jsx'
import { UserDetails } from './UserDetails.jsx'
import { NotificationsPane } from '../cmps/NotificationsPane'

export function StoryIndex({navSelection}) {

    // store state variables
    const currentUser = useSelector(storeState => storeState.userModule.currentUser)
    const userList = useSelector(storeState => storeState.userModule.userList)
    const stories = useSelector(storeState => storeState.storyModule.stories)

    const [initialNavSelection, setInitialNavSelection] = useState(navSelection)
    const [showNotificationsPane, setShowNotificationsPane] = useState(false)
    const [newPostsNotification, setNewPostsNotification] = useState(false)
    const [newUserNotification, setNewUserNotification] = useState(false)
    const notificationsRef = useRef()


    // params
    const username = useParams().username

    useEffect(() => {
        loadAppData()
        setNewUserNotification(false)
        startSocketCommunication()
        return () => socketService.socketDisconnect()
    }, [])

    useEffect(() => {
        loadAppData()
        setNewPostsNotification(false)
    }, [stories.length])

    function startSocketCommunication() {
        socketService.socketConnect(currentUser)
        //setNewPostsNotification(false)
        socketService.onNewStory(() => {
            console.log("Socket message: NEW-POST NOTIFICATION")
            setNewPostsNotification(true)
        })
    }

    async function loadAppData() {
        const loadedUser = await loadCurrentUser()
        console.log("loadAppData: ",loadedUser)
        socketService.emitUserIdentify(loadedUser._id)
        userActions.loadUserList()
        //console.log(userList)
        storyActions.loadStories(loadedUser)
        //console.log(stories)
    }

    async function loadCurrentUser() {
        try {
            const loadedUser = await userActions.loadCurrentUser()
            return loadedUser
        }
        catch (err) {
            console.log("loadCurrentUser ERROR: ",err)
            const loadedUser = await genDataService.login()
            console.log("**** Logged In  :",loadedUser)
            console.log("********************************************")
            return loadedUser
        }
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
        // mark new notifications only if not currently in panel
        if (showNotifications) setNewUserNotification(false)
    }

    function onNotify(shouldNotify) {
        // mark new notifications only if not currently in panel
        console.log("ON NOTIFY !!! ", shouldNotify)
        setNewUserNotification(showNotificationsPane ? false : shouldNotify)
    }

    function onNavSelect(selection) {
        if (selection !== initialNavSelection)
            setInitialNavSelection(selection)
    }

    function onClickAnywhere({target}) {
        if (setShowNotificationsPane && !notificationsRef.current.contains(target)) {
            onShowNotifications(false)
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

            <div ref={notificationsRef}>
                <NotificationsPane show={showNotificationsPane} currentUser={currentUser} 
                    userList={userList} storyList={stories} onNotify={onNotify}/>
            </div>
            
            {/* Overlays */}
            <div className={`new-posts-overlay ${newPostsNotification ? " new-posts-visible" : ''}`}>
                        <button className="new-posts-button" onClick={onClickNewPosts}>New posts</button>
                </div>
            <div className={`new-notification-overlay ${newUserNotification ? " new-notification-visible" : ''}`}/>
        </div>
    )
}

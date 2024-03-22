import { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from "react-router"
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
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
    const notificationsRef = useRef()


    // params
    const username = useParams().username

    useEffect(() => {
        loadAppData()
    }, [stories.length])

    async function loadAppData() {
        const loadedUser = await loadCurrentUser()
        console.log("loadAppData: ",loadedUser)
        userActions.loadUserList()
        //console.log(userList)
        storyActions.loadStories(loadedUser)
        //console.log(stories)
    }

    async function loadCurrentUser() {
        try {
            const loadedUser = await userActions.loadCurrentUser()
            console.log("loadCurrentUser: ",loadedUser)
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
            const savedStory = await storyActions.addStory(story)
            showSuccessMsg(`Story added (id: ${savedStory._id})`)
        } catch (err) {
            showErrorMsg('Cannot add story')
        }        
    }

    async function onUpdateStory(story) {
        try {
            const savedStory = await storyActions.updateStory(story)
            //console.log("onUpdateStory: ",savedStory)
        } catch (err) {
            showErrorMsg('Cannot update story')
        }        
    }

    function onUpdateUser(updatedUser) {
        try {
            userActions.updateCurrentUser(updatedUser)
            console.log("onUpdateUser: saved -",updatedUser)
            console.log("onUpdateUser: current -",currentUser)
        } 
        catch (err) {
            showErrorMsg('Cannot update user')
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
        if (setShowNotificationsPane && !notificationsRef.current.contains(target)) {
            onShowNotifications(false)
            setInitialNavSelection('')
        }
    }

        
    return ( !currentUser ? '' :
        <div className={username ? 'user-details' : 'app'}>
            <div className="nav-bar">
                <NavBar initialSelection={initialNavSelection} onSelect={onNavSelect} onAddStory={onAddStory} onShowNotifications={onShowNotifications}/>
            </div>

            {(username) ? <UserDetails currentUser={currentUser}/> :
            <>
                <div className="main-content" onClick={onClickAnywhere}>
                    <div>
                        <StoryList stories={stories} onUpdateStory={onUpdateStory} 
                            currentUser={currentUser} onUpdateUser={onUpdateUser}/>
                    </div>
                </div>
                <div className="users-bar" onClick={onClickAnywhere}>
                    <UsersBar userList={userList} currentUser={currentUser} numDisplayUsers={userService.getNumDisplayUsers()}/>
                </div>
            </>}

            {/*<div ref={notificationsRef}>
                {showNotificationsPane && <NotificationsPane currentUser={currentUser}/>}*/}
            <div ref={notificationsRef}>
                <NotificationsPane show={showNotificationsPane} currentUser={currentUser}/>
            </div>
        </div>
    )
}

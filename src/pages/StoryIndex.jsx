import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from "react-router"
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { userService } from '../services/user.service'
import { userActions } from '../store/actions/user.actions.js'
import { storyActions } from '../store/actions/story.actions.js'
import { NavBar } from '../cmps/NavBar.jsx'
import { StoryList } from '../cmps/StoryList.jsx'
import { UsersBar } from '../cmps/UsersBar.jsx'
import { UserDetails } from './UserDetails.jsx'

export function StoryIndex() {

    // store state variables
    const userList = useSelector(storeState => storeState.userModule.userList)
    const currentUser = useSelector(storeState => storeState.userModule.currentUser)
    const stories = useSelector(storeState => storeState.storyModule.stories)

    // params
    const username = useParams().username

    useEffect(() => {
        userActions.loadUserList()
        userActions.loadCurrentUser()
        storyActions.loadStories()
    }, [])

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

    async function onUpdateUser(updatedUser) {
        try {
            const savedUser = await userActions.updateCurrentUser(updatedUser)
        } 
        catch (err) {
            showErrorMsg('Cannot update user')
        }        
    }

    return (
        <div className="app">
            <div className="nav-bar">
                <NavBar onAddStory={onAddStory}/>
            </div>

            {(username) ? <UserDetails stories={stories}/> :
            <>
                <div className="main-content">
                    {/*<div className="stories-bar">Stories Bar</div>*/}
                    <div className="feed">
                        <StoryList stories={stories} onUpdateStory={onUpdateStory} 
                            currentUser={currentUser} onUpdateUser={onUpdateUser}/>
                    </div>
                </div>
                <div className="users-bar">
                    <UsersBar userList={userList} currentUser={currentUser} numDisplayUsers={userService.getNumDisplayUsers()}/>
                </div>
            </>}
        </div>
    )
}

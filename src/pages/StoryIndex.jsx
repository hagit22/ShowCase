import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from "react-router"
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { userService } from '../services/user.service.js'
import { storyActions } from '../store/actions/story.actions.js'
import { NavBar } from '../cmps/NavBar.jsx'
import { StoryList } from '../cmps/StoryList.jsx'
import { UserDetails } from './UserDetails.jsx'

export function StoryIndex() {

    const stories = useSelector(storeState => storeState.storyModule.stories)
    const username = useParams().username

    useEffect(() => {
        storyActions.loadStories()
    }, [stories])

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
            console.log("onUpdateStory: ",savedStory)
        } catch (err) {
            showErrorMsg('Cannot update story')
        }        
    }

    async function onRemoveStory(storyId) {
        try {
            await storyActions.removeStory(storyId)
            showSuccessMsg('Story removed')            
        } catch (err) {
            showErrorMsg('Cannot remove story')
        }
    }

    function shouldShowActionBtns(story) {
        const user = userService.getLoggedInUser()
        if (!user) return false
        if (user.isAdmin) return true
        return story.owner?._id === user._id
    }

    return (
        <div className="app">
            <div className="nav-bar">
                <NavBar onAddStory={onAddStory}/>
            </div>

            {(username) ? <UserDetails stories={stories}/> :

            <div className="main-content">
                {/*<div className="stories-bar">Stories Bar</div>*/}
                <div className="feed">
                    <StoryList stories={stories} onUpdateStory={onUpdateStory}/>
                </div>
            </div>}
            {/*<div className="users-bar"></div>*/}


        </div>
    )
}


          {/*<div>
            <main>
                <button onClick={onAddStory}>Add Story ⛐</button>
                <ul className="story-list">
                    {stories.map(story =>
                        <li className="story-preview" key={story._id}>
                            <h4>{story.vendor}</h4>
                            <h1>⛐</h1>
                            <p>Price: <span>${story.price.toLocaleString()}</span></p>
                            <p>Owner: <span>{story.owner && story.owner.fullname}</span></p>
                            {shouldShowActionBtns(story) && <div>
                                <button onClick={() => { onRemoveStory(story._id) }}>x</button>
                                <button onClick={() => { onUpdateStory(story) }}>Edit</button>
                            </div>}

                            <button onClick={() => { onAddStoryMsg(story) }}>Add story msg</button>
                            <button className="buy" onClick={}>Add story</button>
                        </li>)
                    }
                </ul>
            </main>
        </div>*/}
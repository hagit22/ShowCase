/* eslint-disable react/prop-types */
import { useRef } from "react"
import { showErrorMsg } from '../services/event-bus.service.js'
import { onToggleModal } from "../store/actions/app.actions.js"
import { storyActions } from '../store/actions/story.actions.js'
import { StoryDetails } from './StoryDetails.jsx'

export function UserDetailsContent({userStories}) {

    async function onUpdateStory(story) {
        try {
            const savedStory = await storyActions.updateStory(story)
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

    const onViewDetails = (story) => {
        onToggleModal({
            cmp: StoryDetails,
            props: { story, onUpdateStory, onUpdateUser }
        })  
    }
        
    return (
        userStories.map(story => 
            <img className='user-content-image' key={story._id}
                src={story.imgUrl} onClick={() => onViewDetails(story)} >
            </img>
        )
    )     
}

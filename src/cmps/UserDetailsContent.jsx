/* eslint-disable react/prop-types */
import { useRef } from "react"
import { userService } from "../services/user.service.js"
import { showErrorMsg } from '../services/event-bus.service.js'
import { onToggleModal } from "../store/actions/app.actions.js"
import { storyActions } from '../store/actions/story.actions.js'
import { StoryDetails } from './StoryDetails.jsx'

export function UserDetailsContent({userStories}) {

    const loggedInUser = useRef(userService.getLoggedInUser())

    async function onUpdateStory(story) {
        try {
            const savedStory = await storyActions.updateStory(story)
            console.log("onUpdateStory: ",savedStory)
        } catch (err) {
            showErrorMsg('Cannot update story')
        }        
    }

    const onViewDetails = (story) => {
        onToggleModal({
            cmp: StoryDetails,
            props: { story, onUpdateStory, loggedInUser: loggedInUser.current }
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

/* eslint-disable react/prop-types */
import { onToggleModal } from "../store/actions/app.actions.js"
import { storyActions } from '../store/actions/story.actions.js'
import { StoryDetails } from './StoryDetails.jsx'

export function UserDetailsContent({userStories}) {

    async function onUpdateStory(story) {
        try {
            const savedStory = await storyActions.updateStory(story)
        } catch (err) {
            console.log("onUpdateStory (userDetails) error: ",err)
        }        
    }

    async function onUpdateUser(updatedUser) {
        try {
            const savedUser = await userActions.updateCurrentUser(updatedUser)
        } 
        catch (err) {
            console.log("onUpdateUser (userDetails) error: ",err)
        }        
    }

    const onViewDetails = (story) => {
        onToggleModal({
            cmp: StoryDetails,
            props: { story, onUpdateStory, onUpdateUser }
        })  
    }
        
    return ( !userStories ? '' :
        userStories.map(story => 
            <img className='user-content-image' key={story._id}
                src={story.imgUrl} onClick={() => onViewDetails(story)} >
            </img>
        )
    )     
}

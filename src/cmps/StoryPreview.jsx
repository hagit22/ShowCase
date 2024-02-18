/* eslint-disable react/prop-types */
import { useState, useEffect } from "react"
import { useSelector } from 'react-redux'
import { userService } from "../services/user.service.js"
import { utilService } from '../services/util.service.js'
import { showErrorMsg } from '../services/event-bus.service.js'
import { userActions } from '../store/actions/user.actions.js'
import { onToggleModal } from "../store/actions/app.actions.js"
import { StoryDetails } from './StoryDetails.jsx'
import { StoryPreviewIcons } from './StoryPreviewIcons'
import { StoryPreviewLikedBy } from './StoryPreviewLikedBy'
import { StoryPreviewCaption } from './StoryPreviewCaption'
import { StoryPreviewComments } from './StoryPreviewComments'
import { ProfileTitle } from './ProfileTitle.jsx';

export function StoryPreview({ story, onUpdateStory }) {

    const [currentUser, setCurrentUser] = useState(userService.getLoggedInUser()) 
    //const currentUser = useSelector(storeState => storeState.userModule.user)
        
    async function onUpdateUser(updatedUser) {
        try {
            const savedUser = await userActions.updateUser(updatedUser)
            //console.log("onUpdateUser: ",savedUser)
            setCurrentUser(savedUser)
        } catch (err) {
            showErrorMsg('Cannot update user')
        }        
    }

    const onViewDetails = () => {
        onToggleModal({
            cmp: StoryDetails,
            props: { story, onUpdateStory, onUpdateUser, currentUser: currentUser }
        })  
    }
        
    const { imgUrl, createdAt, by, likedBy } = story;
    return (
        <article className="story-preview">
            <ProfileTitle profile={by}>
                <div className="dot-container">
                    <div className="dot">.</div>
                </div>
                {utilService.getPassedTimeString(createdAt)}
            </ProfileTitle>
            <div className="story-preview-image">
                <img src={imgUrl}></img>
            </div>
            <StoryPreviewIcons story={story} onUpdateStory={onUpdateStory} onUpdateUser={onUpdateUser} 
                currentUser={currentUser} onViewDetails={onViewDetails} origin={"Preview"}/>
            <div className="story-preview-info">
                <StoryPreviewLikedBy likedBy={likedBy}/>
                <StoryPreviewCaption caption={story.txt} username={story.by.username} />
                <StoryPreviewComments story={story} onUpdateStory={onUpdateStory} 
                    onViewDetails={onViewDetails} currentUser={currentUser}/>
            </div>
        </article>
    )
}

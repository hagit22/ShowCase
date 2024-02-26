/* eslint-disable react/prop-types */
import { utilService } from '../services/util.service.js'
import { onToggleModal } from "../store/actions/app.actions.js"
import { StoryDetails } from './StoryDetails.jsx'
import { StoryPreviewIcons } from './StoryPreviewIcons'
import { StoryPreviewLikedBy } from './StoryPreviewLikedBy'
import { StoryPreviewCaption } from './StoryPreviewCaption'
import { StoryPreviewComments } from './StoryPreviewComments'
import { ProfileTitle } from './ProfileTitle.jsx'

export function StoryPreview({ story, onUpdateStory, currentUser, onUpdateUser }) {

    const onViewDetails = () => {
        onToggleModal({
            cmp: StoryDetails,
            props: { story, onUpdateStory, onUpdateUser }
        })  
    }
        
    const { txt, imgUrl, createdAt, by, likedBy } = story;
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
                <StoryPreviewCaption caption={txt} username={by.username} />
                <StoryPreviewComments story={story} onUpdateStory={onUpdateStory} onViewDetails={onViewDetails}/>
            </div>
        </article>
    )
}

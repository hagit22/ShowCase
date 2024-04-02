/* eslint-disable react/prop-types */
import { utilService } from '../services/util.service.js'
import { onToggleModal } from "../store/actions/app.actions.js"
import { StoryDetails } from './StoryDetails.jsx'
import { StoryPreviewIcons } from './StoryPreviewIcons'
import { StoryPreviewLikedBy } from './StoryPreviewLikedBy'
import { StoryPreviewCaption } from './StoryPreviewCaption'
import { StoryPreviewComments } from './StoryPreviewComments'
import { ProfileTitle } from './ProfileTitle.jsx'
import { SVG_MenuDots } from '../services/svg.service.jsx'

export function StoryPreview({ story, onUpdateStory, currentUser, onUpdateUser }) {

    const onViewDetails = () => {
        onToggleModal({
            cmp: StoryDetails,
            props: { story, onUpdateStory, onUpdateUser }
        })  
    }
        
    const { txt, imgUrl, createdAt, by, likedBy } = story;
    return (
        <article className="story-preview story-preview-only">
            <div className="story-preview-heading">
                <ProfileTitle profile={by}>
                    <div className="dot-container"/>
                    <span className="preview-passed-time">
                        {utilService.getPassedTimeString(createdAt) == '0m' ? "just now" :
                            utilService.getPassedTimeString(createdAt)}
                    </span>
                </ProfileTitle>
                <SVG_MenuDots/>
            </div>
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

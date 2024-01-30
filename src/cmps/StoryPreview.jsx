/* eslint-disable react/prop-types */
import { useRef } from "react"
import { userService } from "../services/user.service.js"
import { utilService } from '../services/util.service.js'
import { StoryPreviewIcons } from './StoryPreviewIcons'
import { StoryPreviewLikedBy } from './StoryPreviewLikedBy'
import { StoryPreviewCaption } from './StoryPreviewCaption'
import { StoryPreviewComments } from './StoryPreviewComments'
import { ProfileTitle } from './ProfileTitle.jsx';

export function StoryPreview({ story, onUpdateStory }) {

    const loggedInUser = useRef(userService.getLoggedInUser())

    const { txt, imgUrl, createdAt, by, likedBy, comments } = story;
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
            <StoryPreviewIcons story={story} onUpdateStory={onUpdateStory} loggedInUser={loggedInUser.current}/>
            <div className='story-preview-info'>
                <StoryPreviewLikedBy likedBy={likedBy}/>
                <StoryPreviewCaption story={story}/>
                <StoryPreviewComments story={story} onUpdateStory={onUpdateStory} loggedInUser={loggedInUser.current}/>
            </div>
        </article>
    )
}

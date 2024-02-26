/* eslint-disable react/prop-types */
import { useSelector } from 'react-redux'
import { utilService } from '../services/util.service.js'
import { ProfileTitle } from './ProfileTitle.jsx';
import { StoryDetailsSingleEntry } from './StoryDetailsSingleEntry.jsx';
import { StoryPreviewIcons } from './StoryPreviewIcons'
import { StoryPreviewLikedBy } from './StoryPreviewLikedBy.jsx';
import { StoryAddComment } from './StoryAddComment.jsx';

export function StoryDetails({story, onUpdateStory, onUpdateUser}) {

    const modalStories = useSelector(storeState => storeState.storyModule.stories)
    const modalStory = modalStories.filter(storyItem => storyItem._id === story._id)[0]    
    const currentUser = useSelector(storeState => storeState.userModule.currentUser)

    const { imgUrl, createdAt, by, likedBy, comments } = modalStory;
    return (
        <section>
            <div className="story-details-modal">
                <div className="details-modal-image">
                    <img src={imgUrl}></img>
                </div>
                <div className='details-modal-content-around'>
                <div>
                    <div className="details-modal-content">
                        <div className="header-row">
                            <ProfileTitle profile={by}><div></div></ProfileTitle>
                            <div className="menu-dots">
                                <div className="dot"/><div className="dot"/><div className="dot"/>
                            </div>
                        </div>
                        <div className="details-modal-entries">
                            <StoryDetailsSingleEntry entry={modalStory} extraInfo={false}/>
                            {comments.map( comment => 
                                <div key={comment._id} >
                                    <StoryDetailsSingleEntry entry={comment} extraInfo={true}/>
                                </div>
                            )} 
                        </div>
                    </div>
                    <div className="story-preview details-modal-info">
                        <StoryPreviewIcons story={modalStory} onUpdateStory={onUpdateStory} onUpdateUser={onUpdateUser} 
                            currentUser={currentUser} onViewDetails={null} origin={"Details"}/>
                        <StoryPreviewLikedBy likedBy={likedBy}/>
                        <span>{utilService.getPassedTimeString(createdAt)}</span>
                        <StoryAddComment story={modalStory} onUpdateStory={onUpdateStory} origin={"Details"}/>
                    </div>
                </div>
                </div>
            </div>
        </section>
    )     
}

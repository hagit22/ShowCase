/* eslint-disable react/prop-types */
import { utilService } from '../services/util.service.js';
import { StoryPreviewCaption } from './StoryPreviewCaption.jsx';
import { Heart } from 'react-bootstrap-icons';

export function StoryDetailsSingleEntry({ entry, extraInfo }) {

    const onToggleLikeComment = () => {
        
    }

    const { txt, createdAt, by, likedBy } = entry;
    return (
        <div className="single-entry">
            <img src={by.imgUrl} />
            <div className="content">
                <div className="data">
                    <StoryPreviewCaption caption={txt} username={by.username} />
                    <Heart className="heart" onClick={onToggleLikeComment}/>
                </div>
                <div className="info">
                    <div>{utilService.getPassedTimeString(createdAt)}</div>
                    {extraInfo && <>
                        {likedBy.length > 0 && 
                            <div>{likedBy.length} {likedBy.length === 1 ? 'like' : 'likes'}</div>}
                        <div>Reply</div> </>}
                </div>
            </div>
        </div>
    )
}

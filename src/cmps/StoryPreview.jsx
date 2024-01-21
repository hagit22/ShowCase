/* eslint-disable react/prop-types */
import { utilService } from '../services/util.service.js';
import { Heart } from 'react-bootstrap-icons';
import { Chat } from 'react-bootstrap-icons';
import { Send } from 'react-bootstrap-icons';
import { Bookmark } from 'react-bootstrap-icons';


export function StoryPreview({ story: story }) {
    
    const {txt, imgUrl, createdAt, by, likedBy, comments } = story;
    return (
        <article className="story-preview">
            <div className="story-preview-header">
                <img src={by.imgUrl}/>
                <span className="preview-header-user">{by.username}</span>
                <div className="dot-container">
                    <div className="dot">.</div>
                </div>
                <span>{utilService.getPassedTimeString(createdAt)}</span>
            </div>
            <div className="story-preview-image">
                <img src={imgUrl}></img>
            </div>
            <div className="story-preview-icons">
                <div>
                    <Heart className="single-icon"/>
                    <Chat className="single-icon"/>
                    <Send className="single-icon"/>
                </div>
                <div>
                    <Bookmark className="single-icon"/>
                </div>
            </div>
            <div className='story-preview-info'>
                {likedBy.length == 0 ? '' :
                    <div className="preview-info-likes">
                        {likedBy.length} like{likedBy.length == 1 ? '' : 's'}
                    </div>
                }
                <div className="preview-info-text">
                    <span>{by.username}</span>{txt}
                </div>
                <div>View all {comments.length} comments</div>
                <div className='preview-info-add-comment'>
                    <div>Add a comment...</div>
                    <div>
                        <svg aria-label="Emoji" fill="currentColor" height="13" role="img" viewBox="0 0 24 24" width="13"><title>Emoji</title><path d="M15.83 10.997a1.167 1.167 0 1 0 1.167 1.167 1.167 1.167 0 0 0-1.167-1.167Zm-6.5 1.167a1.167 1.167 0 1 0-1.166 1.167 1.167 1.167 0 0 0 1.166-1.167Zm5.163 3.24a3.406 3.406 0 0 1-4.982.007 1 1 0 1 0-1.557 1.256 5.397 5.397 0 0 0 8.09 0 1 1 0 0 0-1.55-1.263ZM12 .503a11.5 11.5 0 1 0 11.5 11.5A11.513 11.513 0 0 0 12 .503Zm0 21a9.5 9.5 0 1 1 9.5-9.5 9.51 9.51 0 0 1-9.5 9.5Z"></path></svg>
                    </div>
                </div>
                </div>
            <div>
                
            </div>
        </article>
    )
}

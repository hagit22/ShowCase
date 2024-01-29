/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react"
import { userService } from "../services/user.service.js";
import { utilService } from '../services/util.service.js';
import { onToggleModal } from "../store/actions/app.actions";
import { CommentsModal } from './CommentsModal'
import { ProfileTitle } from './ProfileTitle.jsx';
import { Heart } from 'react-bootstrap-icons';
import { HeartFill } from 'react-bootstrap-icons';
import { Chat } from 'react-bootstrap-icons';
import { Send } from 'react-bootstrap-icons';
import { Bookmark } from 'react-bootstrap-icons';


export function StoryPreview({ story, onUpdateStory }) {

    const loggedInUser = useRef(userService.getLoggedInUser())
    const [likedByPosition, setLikedByPosition] = useState(null)
    const commentPostRef = useRef(null);
    const commentTextRef = useRef(null);

    useEffect(() => {
        setLikedByPosition(story.likedBy.map(by => by.username).indexOf(loggedInUser.current.username))
    }, [story.likedBy])

    const onToggleLike = () => {
        let likedBy = story.likedBy;
        if (likedByPosition <= -1) 
            likedBy.push(loggedInUser.current)
        else {
            likedBy.splice(likedByPosition, 1)
        }
        onUpdateStory(story, ...likedBy)
    }

    const onViewComments = () => {
        onToggleModal({
            cmp: CommentsModal,
            props: { story }
        })
    }

    const onTypeComment = ({target}) => {
        commentPostRef.current.style.display = (target.value == "" ? "none" : "inline");   
        target.style.height = 'inherit';
        target.style.height = `${target.scrollHeight}px`; // dynamically add area if more rows are needed     
    }
    
    const onPostComment = () => {
        console.log("onPostComment ", commentTextRef.current)
        let comments = story.comments;
        comments.push( {
            by: loggedInUser.current,
            txt: commentTextRef.current.value,
            likedBy: [],
            createdAt: Date.now()
        })
        commentTextRef.current.value = "";
        commentTextRef.current.height = 0;
        commentPostRef.current.style.display = "none";
        onUpdateStory(story)
    }
    
    const onEnterComment = (event) => {
        if(event.keyCode == 13 && event.shiftKey == false) {
            event.preventDefault()  
            onPostComment()
        }
    }

    
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
            <div className="story-preview-icons">
                <div>
                    {likedByPosition <= -1 ?
                        <Heart className="single-icon" onClick={onToggleLike}/> :
                        <HeartFill className="single-icon like" onClick={onToggleLike}/>}
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
                        {likedBy.length} like{likedBy.length > 1 ? 's' : ''}
                    </div>
                }
                <div className="preview-info-text">
                    <span>{by.username}</span>{txt}
                </div>
                <div/>
                {/*<br/>*/}
                <div className='preview-info-comments'>
                    {comments.length == 0 ? '' : 
                        <a onClick={onViewComments}>
                            View {comments.length == 1 ? '' : `all ${comments.length}`} comment{comments.length > 1 ? 's' : ''}
                        </a>
                    }
                    <div className='preview-info-add-comment'>
                        <form>
                            <textarea ref={commentTextRef} rows="1" 
                                onChange={onTypeComment}  onKeyDown={onEnterComment} placeholder="Add a comment..."/>
                        </form>
                        <div>
                            <a ref={commentPostRef} onClick={onPostComment}>Post</a>
                            <svg aria-label="Emoji" fill="currentColor" height="13" role="img" viewBox="0 0 24 24" width="13"><title>Emoji</title><path d="M15.83 10.997a1.167 1.167 0 1 0 1.167 1.167 1.167 1.167 0 0 0-1.167-1.167Zm-6.5 1.167a1.167 1.167 0 1 0-1.166 1.167 1.167 1.167 0 0 0 1.166-1.167Zm5.163 3.24a3.406 3.406 0 0 1-4.982.007 1 1 0 1 0-1.557 1.256 5.397 5.397 0 0 0 8.09 0 1 1 0 0 0-1.55-1.263ZM12 .503a11.5 11.5 0 1 0 11.5 11.5A11.513 11.513 0 0 0 12 .503Zm0 21a9.5 9.5 0 1 1 9.5-9.5 9.51 9.51 0 0 1-9.5 9.5Z"></path></svg>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    )
}

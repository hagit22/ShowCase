/* eslint-disable react/prop-types */
import { useRef } from "react"
import { storyService } from '../services/story.service.local.js'

export function StoryAddComment({ story, onUpdateStory, origin }) {

    const commentPostRef = useRef(null);
    const commentTextRef = useRef(null);

    const onTypeComment = ({target}) => {
        if (origin == "Details")
            commentPostRef.current.style.opacity = (target.value == "" ? "20%" : "100%"); 
        else
            commentPostRef.current.style.display = (target.value == "" ? "none" : "inline");    
        target.style.height = 'inherit';
        target.style.height = `${target.scrollHeight}px`; // dynamically add area if more rows are needed     
    }
    
    const onPostComment = () => {
        let comments = story.comments;
        comments.push(storyService.generateNewComment(commentTextRef.current.value))
        commentTextRef.current.value = "";
        commentTextRef.current.height = 0;
        if (origin == "Details")
            commentPostRef.current.style.opacity = "20%";
        else
            commentPostRef.current.style.display = "none";
        onUpdateStory(story)
    }
    
    const onEnterComment = (event) => {
        if(event.keyCode == 13 && event.shiftKey == false) {
            event.preventDefault()  
            onPostComment()
        }
    }
    
    return (
        <div className= {`${origin == "Details" ? "details-add-comment" : "preview-add-comment"}`}>
            {origin != "Details" ? '' :
                <svg aria-label="Emoji" fill="currentColor" height="20" width="20" role="img" viewBox="0 0 24 24" ><title>Emoji</title><path d="M15.83 10.997a1.167 1.167 0 1 0 1.167 1.167 1.167 1.167 0 0 0-1.167-1.167Zm-6.5 1.167a1.167 1.167 0 1 0-1.166 1.167 1.167 1.167 0 0 0 1.166-1.167Zm5.163 3.24a3.406 3.406 0 0 1-4.982.007 1 1 0 1 0-1.557 1.256 5.397 5.397 0 0 0 8.09 0 1 1 0 0 0-1.55-1.263ZM12 .503a11.5 11.5 0 1 0 11.5 11.5A11.513 11.513 0 0 0 12 .503Zm0 21a9.5 9.5 0 1 1 9.5-9.5 9.51 9.51 0 0 1-9.5 9.5Z"></path></svg>
            }
            <form>
                <textarea ref={commentTextRef} rows="1" 
                    onChange={onTypeComment}  onKeyDown={onEnterComment} placeholder="Add a comment..."/>
            </form>
            <div>
                <a ref={commentPostRef} onClick={onPostComment}>Post</a>
                {origin == "Details" ? '' :
                    <svg aria-label="Emoji" fill="currentColor" height="13" width="13" role="img" viewBox="0 0 24 24"><title>Emoji</title><path d="M15.83 10.997a1.167 1.167 0 1 0 1.167 1.167 1.167 1.167 0 0 0-1.167-1.167Zm-6.5 1.167a1.167 1.167 0 1 0-1.166 1.167 1.167 1.167 0 0 0 1.166-1.167Zm5.163 3.24a3.406 3.406 0 0 1-4.982.007 1 1 0 1 0-1.557 1.256 5.397 5.397 0 0 0 8.09 0 1 1 0 0 0-1.55-1.263ZM12 .503a11.5 11.5 0 1 0 11.5 11.5A11.513 11.513 0 0 0 12 .503Zm0 21a9.5 9.5 0 1 1 9.5-9.5 9.51 9.51 0 0 1-9.5 9.5Z"></path></svg>
                }
        </div>
        </div>
    )
}

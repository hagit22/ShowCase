/* eslint-disable react/prop-types */
import { useRef } from "react"
import { storyService } from '../services/story.service.js'
import { SVG_EmojiPreview, SVG_EmojiDetails } from "../services/svg.service.jsx";

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
        //let comments = story.comments;
        //comments.push(storyService.createNewComment(commentTextRef.current.value))
        const newlyCreatedComment = storyService.createNewComment(commentTextRef.current.value)
        story.comments = [newlyCreatedComment, ...story.comments]
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
                <SVG_EmojiPreview/>
            }
            <form>
                <textarea ref={commentTextRef} rows="1" 
                    onChange={onTypeComment}  onKeyDown={onEnterComment} placeholder="Add a comment..."/>
            </form>
            <div>
                <a ref={commentPostRef} onClick={onPostComment}>Post</a>
                {origin == "Details" ? '' :
                    <SVG_EmojiDetails/>
                }
            </div>
        </div>
    )
}

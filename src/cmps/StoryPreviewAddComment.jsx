/* eslint-disable react/prop-types */
import { useRef } from "react"

export function StoryPreviewAddComment({ story, onUpdateStory, loggedInUser }) {

    const commentPostRef = useRef(null);
    const commentTextRef = useRef(null);

    const onTypeComment = ({target}) => {
        commentPostRef.current.style.display = (target.value == "" ? "none" : "inline");   
        target.style.height = 'inherit';
        target.style.height = `${target.scrollHeight}px`; // dynamically add area if more rows are needed     
    }
    
    const onPostComment = () => {
        console.log("onPostComment ", commentTextRef.current)
        let comments = story.comments;
        comments.push( {
            by: loggedInUser,
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
    
    return (
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
    )
}

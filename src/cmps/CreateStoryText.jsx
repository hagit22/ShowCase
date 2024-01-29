/* eslint-disable react/prop-types */
import { useRef } from "react";
import { useNavigate } from "react-router";
import { userService } from "../services/user.service.js";
import { storyService } from "../services/story.service.local.js";
import { ProfileTitle } from './ProfileTitle';
import { ArrowLeft } from 'react-bootstrap-icons';
import { onToggleModal } from "../store/actions/app.actions.js";

export function CreateStoryText({imageUrl, onAddStory}) {
     
    const storyCaption = useRef()
    const navigate = useNavigate()

    const onClickArrowBack = (event) => {
        //navigate(-1);

        // Small Modal --> ask if to discard draft
    }

    const onMouseDownArrowBack = ({target}) => {
        target.style.color = "gray";
    }

    const onMouseUpArrowBack = ({target}) => {
        target.style.color = "black";
    }

    const onShareStory = () => {    
        const caption = storyCaption.current.value;
        const story = storyService.createNewStory(imageUrl, caption)
        onAddStory(story)
        onToggleModal()
    }

    return (
        <section className="modal-container">
            <div className="create-story-text">
                <div className="new-story-share">
                    <div className="title">
                        <ArrowLeft className="icon-style" onClick={onClickArrowBack} 
                            onMouseDown={onMouseDownArrowBack} onMouseUp={onMouseUpArrowBack}/>
                        <span>Create new post</span>
                        <a onClick={onShareStory}>Share</a>
                    </div>
                    <div className="content">
                        <div className="content-image">
                            <img src={imageUrl}></img>
                        </div>
                        <div className="content-form">
                            <ProfileTitle profile={userService.getLoggedInUser()}/>
                            <form>
                                <textarea ref={storyCaption} rows="12" placeholder="Write a caption..."/>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

/* eslint-disable react/prop-types */
import { useRef } from "react";
import { useSelector } from 'react-redux'
import { useNavigate } from "react-router";
import { storyService } from "../services/story.service.js";
import { ProfileTitle } from './ProfileTitle';
import { onToggleModal } from "../store/actions/app.actions.js";
import { SVG_ArrowBack } from "../services/svg.service.jsx";

export function CreateStoryText({imageUrl, onAddStory}) {
     
    const currentUser = useSelector(storeState => storeState.userModule.currentUser)
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
        <section className="center-container">
            <div className="create-story-text">
                <div className="create-story-text-title">
                    <div className="icon-style" onClick={onClickArrowBack} 
                        onMouseDown={onMouseDownArrowBack} onMouseUp={onMouseUpArrowBack}>
                            <SVG_ArrowBack/>
                    </div>
                    <span>Create new post</span>
                    <a onClick={onShareStory}>Share</a>
                </div>
                <div className="create-story-text-content">
                    <div className="content-image">
                        <img src={imageUrl}></img>
                    </div>
                    <div className="content-form">
                        <ProfileTitle profile={currentUser}/>
                        <form>
                            <textarea ref={storyCaption} rows="19" placeholder="Write a caption..."/>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}

/* eslint-disable react/prop-types */
import { useState, useEffect } from "react"
import { Heart } from 'react-bootstrap-icons';
import { HeartFill } from 'react-bootstrap-icons';
import { Chat } from 'react-bootstrap-icons';
import { Send } from 'react-bootstrap-icons';
import { Bookmark } from 'react-bootstrap-icons';


export function StoryPreviewIcons({ story, onUpdateStory, loggedInUser, onViewDetails, origin }) {

    const [likedByPosition, setLikedByPosition] = useState(calcLikedByPos())

    useEffect(() => {
        setLikedByPosition(calcLikedByPos())
    }, [story])
    
    function calcLikedByPos() { 
        return story.likedBy.map(by => by.username).indexOf(loggedInUser.username)
    }

    const onToggleLike = () => {
        const likedByList = [...story.likedBy]
        if (likedByPosition <= -1) 
            likedByList.push(loggedInUser)
        else 
            likedByList.splice(likedByPosition, 1)
        onUpdateStory({...story, likedBy: likedByList})
    }

    return (
        <div className="story-preview-icons">
            <div>
                {likedByPosition < 0 ?
                    <Heart 
                        className={origin == "Details" ? "single-icon-details" : "single-icon-preview"} 
                        onClick={onToggleLike}/> :
                    <HeartFill 
                        className={origin == "Details" ? "single-icon-details like" : "single-icon-preview like"} 
                        onClick={onToggleLike}/>}
                <Chat className={origin == "Details" ? "single-icon-details" : "single-icon-preview"}
                    onClick={onViewDetails}/>
                <Send className={origin == "Details" ? "single-icon-details" : "single-icon-preview"}/>
            </div>
            <div>
                <Bookmark className={origin == "Details" ? "single-icon-details" : "single-icon-preview"}/>
            </div>
        </div>
    )
}

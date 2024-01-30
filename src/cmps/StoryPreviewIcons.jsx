/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react"
import { Heart } from 'react-bootstrap-icons';
import { HeartFill } from 'react-bootstrap-icons';
import { Chat } from 'react-bootstrap-icons';
import { Send } from 'react-bootstrap-icons';
import { Bookmark } from 'react-bootstrap-icons';


export function StoryPreviewIcons({ story, onUpdateStory, loggedInUser }) {

    const [likedByPosition, setLikedByPosition] = useState(null)

    useEffect(() => {
        setLikedByPosition(story.likedBy.map(by => by.username).indexOf(loggedInUser.username))
    }, [story.likedBy])

    const onToggleLike = () => {
        let likedBy = story.likedBy;
        if (likedByPosition <= -1) 
            likedBy.push(loggedInUser)
        else {
            likedBy.splice(likedByPosition, 1)
        }
        onUpdateStory(story, ...likedBy)
    }

    return (
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
    )
}

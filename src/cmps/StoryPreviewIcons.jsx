/* eslint-disable react/prop-types */
import { TogglableIcon } from "./TogglableIcon.jsx";
import { Heart, HeartFill, Chat, Send, Bookmark, BookmarkFill } from 'react-bootstrap-icons';


export function StoryPreviewIcons({ story, onUpdateStory, onUpdateUser, currentUser, onViewDetails, origin }) {

    return (
        <div className="story-preview-icons">
            <div>
                <TogglableIcon EmptyIcon={Heart} FullIcon={HeartFill} origin={origin} fillColor="red" 
                    parentEntity={story} arrayName={"likedBy"} 
                    searchedItem={currentUser} keyProperty="_id" onUpdateArray={onUpdateStory}/>
                <Chat className={origin == "Details" ? "single-icon-details" : "single-icon-preview"}
                    onClick={onViewDetails}/>
                <Send className={origin == "Details" ? "single-icon-details" : "single-icon-preview"}/>
            </div>
            <div>
                <TogglableIcon EmptyIcon={Bookmark} FullIcon={BookmarkFill} origin={origin}
                    parentEntity={currentUser} arrayName={"bookmarkedStories"} 
                    searchedItem={{_id: story._id, imgUrl: story.imgUrl}} keyProperty="_id" onUpdateArray={onUpdateUser}/>
            </div>
        </div>
    )
}

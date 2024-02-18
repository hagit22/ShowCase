/* eslint-disable react/prop-types */
import { TogglableIcon } from "./TogglableIcon.jsx";
import { Heart, HeartFill, Chat, Send, Bookmark, BookmarkFill } from 'react-bootstrap-icons';


export function StoryPreviewIcons({ story, onUpdateStory, onUpdateUser, currentUser, onViewDetails, origin }) {

    const onUpdateBookmarkedStories = (updatedBookmarkedStories) => {
        onUpdateUser({...currentUser, bookmarkedStories: updatedBookmarkedStories})
    }

    const onUpdateLikedBy = (updatedLikedBy) => {
        onUpdateStory({...story, likedBy: updatedLikedBy})
    }

    return (
        <div className="story-preview-icons">
            <div>
                <TogglableIcon EmptyIcon={Heart} FullIcon={HeartFill} origin={origin} fillColor="red" 
                    entityArray={story.likedBy} searchedEntity={currentUser} keyProperty="_id" 
                    onUpdateArray={onUpdateLikedBy}/>
                <Chat className={origin == "Details" ? "single-icon-details" : "single-icon-preview"}
                    onClick={onViewDetails}/>
                <Send className={origin == "Details" ? "single-icon-details" : "single-icon-preview"}/>
            </div>
            <div>
                {/*<Bookmark className={origin == "Details" ? "single-icon-details" : "single-icon-preview"}
                    onClick={onBookmarkStory}/>*/}
                <TogglableIcon EmptyIcon={Bookmark} FullIcon={BookmarkFill} origin={origin}
                    entityArray={currentUser.bookmarkedStories || []} 
                    searchedEntity={{_id: story._id, imgUrl: story.imgUrl}} keyProperty="_id" 
                    onUpdateArray={onUpdateBookmarkedStories}/>
            </div>
        </div>
    )
}

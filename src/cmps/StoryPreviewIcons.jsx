/* eslint-disable react/prop-types */
import { TogglableIcon } from "./TogglableIcon.jsx";
import { SVG_Like, SVG_LikeFull, SVG_Comments, SVG_Share, SVG_Bookmark, SVG_BookmarkFull } from "../services/svg.service.jsx";


export function StoryPreviewIcons({ story, onUpdateStory, onUpdateUser, currentUser, onViewDetails, origin }) {

    return (
        <div className="story-preview-icons story-details-icons">
            <div>
                <span>
                    <TogglableIcon EmptyIcon={SVG_Like} FullIcon={SVG_LikeFull} origin={origin} fillColor="red" 
                        parentEntity={story} arrayName={"likedBy"} 
                        searchedItem={currentUser} keyProperty="_id" onUpdateArray={onUpdateStory}/>
                </span>
                <span className={origin == "Details" ? "single-icon-details" : "single-icon-preview"} onClick={onViewDetails}>
                    <SVG_Comments/>
                </span>
                <span className={origin == "Details" ? "single-icon-details" : "single-icon-preview"}>
                    <SVG_Share/>
                </span>
            </div>
            <div>
                <TogglableIcon EmptyIcon={SVG_Bookmark} FullIcon={SVG_BookmarkFull} origin={origin}
                    parentEntity={currentUser} arrayName={"bookmarkedStories"} 
                    searchedItem={story} keyProperty="_id" onUpdateArray={onUpdateUser}/>
            </div>
        </div>
    )
}

/* eslint-disable react/prop-types */
import { StoryPreview } from "./StoryPreview";

export function StoryList({ stories, onUpdateStory, currentUser, onUpdateUser }) {
    return (
        <ul className="story-list">
            {stories.map(story =>
                <li key={story._id}>
                    <StoryPreview story={story} onUpdateStory={onUpdateStory} currentUser={currentUser} onUpdateUser={onUpdateUser}/>
                </li>
            )}
        </ul>
    )
}

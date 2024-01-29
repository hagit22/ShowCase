/* eslint-disable react/prop-types */
import { StoryPreview } from "./StoryPreview";

export function StoryList({ stories, onUpdateStory }) {
    return (
        <ul className="story-list">
            {stories.map(story =>
                <li key={story._id}>
                    <StoryPreview story={story} onUpdateStory={onUpdateStory}/>
                </li>
            )}
        </ul>
    )
}

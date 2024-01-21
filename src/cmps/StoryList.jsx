/* eslint-disable react/prop-types */
import { StoryPreview } from "./StoryPreview";

export function StoryList({ stories }) {
    return (
        <ul className="story-list">
            {stories.map(story =>
                <li key={story._id}>
                    <StoryPreview story={story}/>
                </li>
            )}
        </ul>
    )
}

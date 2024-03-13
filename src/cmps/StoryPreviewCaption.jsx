/* eslint-disable react/prop-types */

export function StoryPreviewCaption({ caption, username }) {

    return (
        <div className="story-preview-text">
            <span>{username.toLowerCase()}</span>{caption}
        </div>
    )
}

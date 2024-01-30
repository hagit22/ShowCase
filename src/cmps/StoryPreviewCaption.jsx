/* eslint-disable react/prop-types */

export function StoryPreviewCaption({ story }) {

    const { txt, by } = story;
    return (
        <div className="preview-info-text">
            <span>{by.username}</span>{txt}
        </div>
    )
}

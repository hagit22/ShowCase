/* eslint-disable react/prop-types */

export function StoryPreviewLikedBy({ likedBy }) {

    return (
        likedBy.length == 0 ? '' :
            <div className="preview-info-likes">
                {likedBy.length} like{likedBy.length > 1 ? 's' : ''}
            </div>
    )
}

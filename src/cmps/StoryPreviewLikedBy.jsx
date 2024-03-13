/* eslint-disable react/prop-types */

export function StoryPreviewLikedBy({ likedBy, origin }) {

    return (
        likedBy.length == 0 ? '' :
            <div className={origin == "Details" ? "details-info-likes" : "preview-info-likes"}>
                {likedBy.length} like{likedBy.length > 1 ? 's' : ''}
            </div>
    )
}

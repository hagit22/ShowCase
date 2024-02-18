/* eslint-disable react/prop-types */
import { StoryAddComment } from './StoryAddComment.jsx'

export function StoryPreviewComments({ story, onUpdateStory, onViewDetails, currentUser }) {

    const { comments } = story;
    return (
        <div className='preview-info-comments'>
            {comments.length == 0 ? '' : 
                <a onClick={onViewDetails}>
                    View {comments.length == 1 ? '' : `all ${comments.length}`} comment{comments.length > 1 ? 's' : ''}
                </a>
            }
            <StoryAddComment story={story} onUpdateStory={onUpdateStory} currentUser={currentUser}/>
        </div>
    )
}

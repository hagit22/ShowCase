/* eslint-disable react/prop-types */
import { onToggleModal } from "../store/actions/app.actions.js"
import { StoryPreviewAddComment } from './StoryPreviewAddComment.jsx'
import { CommentsModal } from './CommentsModal.jsx'

export function StoryPreviewComments({ story, onUpdateStory, loggedInUser }) {

    const onViewDetails = () => {
        onToggleModal({
            cmp: CommentsModal,
            props: { story }
        })
    }
    
    const { comments } = story;
    return (
        <div className='preview-info-comments'>
            {comments.length == 0 ? '' : 
                <a onClick={onViewDetails}>
                    View {comments.length == 1 ? '' : `all ${comments.length}`} comment{comments.length > 1 ? 's' : ''}
                </a>
            }
            <StoryPreviewAddComment story={story} onUpdateStory={onUpdateStory} loggedInUser={loggedInUser}/>
        </div>
    )
}

/* eslint-disable react/prop-types */
import { utilService } from '../services/util.service.js';
import { ProfileTitle } from './ProfileTitle.jsx';

export function CommentsModal({story}) {

    const {txt, imgUrl, createdAt, by, likedBy, comments } = story;
    console.log('comments: ', comments)
    return (
        <section>
            <div className="comments-modal">
                <div className="comments-modal-image">
                    <img src={imgUrl}></img>
                </div>
                <div className="comments-modal-content">
                    <div className="header-row">
                        <ProfileTitle profile={by}><div></div></ProfileTitle>
                        <div className="dots">
                            <div className="dot"/><div className="dot"/><div className="dot"/>
                        </div>
                    </div>
                    <div className="comments" id="comments">
                        <div className="head">
                            <img src={by.imgUrl}/>
                            <div className='text'>
                                <ProfileTitle profile={by} displayImage={false}/>
                                <div>{txt}</div>
                            </div>
                        </div>
                        <div className="comment-info">
                            <div>{utilService.getPassedTimeString(createdAt)}</div>
                            <div>{likedBy.length == 0 ? '' :
                                likedBy.length} like{likedBy.length > 1 ? 's' : ''}</div>
                            <div>Reply</div>
                        </div>
                        {comments.map( comment => 
                        <div key={comment.id} >
                            <div className="head">
                                <img src={comment.by.imgUrl}/>
                                <div className='text'>
                                    <ProfileTitle profile={comment.by} displayImage={false}/>
                                    <div>{comment.txt}</div>
                                </div>
                            </div>
                            <div className="comment-info">
                                <div>{utilService.getPassedTimeString(comment.createdAt)}</div>
                                <div>{comment.likedBy.length == 0 ? '' :
                                    comment.likedBy.length} like{comment.likedBy.length > 1 ? 's' : ''}</div>
                                <div>Reply</div>
                            </div>
                        </div>
                        )} 
                    </div>
                    <div className="likes">likes</div>
                    <div className="add-comment">add</div>
                </div>
            </div>
        </section>
    )     
}

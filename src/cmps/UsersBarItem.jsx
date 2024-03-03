/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux';
import { followLabels } from "../services/user.service";
import { userActions } from '../store/actions/user.actions';
import { ProfileTitle } from './ProfileTitle';

export function UsersBarItem({user, currentUser}) {

    const [followLabel, setFollowLabel] = useState('')

    useEffect(() => {
        setFollowLabel(getFollowLabelValue())
    }, [currentUser])

    const getFollowLabelValue = () => {
        return currentUser.following.filter(userItem => 
            userItem._id === user._id).length > 0 ? followLabels.FOLLOWING : followLabels.FOLLOW
    }

    const onToggleFollow = () => {
        if (followLabel === followLabels.FOLLOW)
            userActions.followUser(user)
        else
            userActions.unFollowUser(user)

        // Using PREV, like in the following first line, didn't work! (The second line did work) ??? :
        //setFollowLabel(prev => prev === followLabels.FOLLOW ? followLabels.FOLLOWING : followLabels.FOLLOW)
        //setFollowLabel(followLabel === followLabels.FOLLOW ? followLabels.FOLLOWING : followLabels.FOLLOW)
    }

    return (
        <section id={user._id} className="users-bar-item users-bar-item-profile">
            <ProfileTitle profile={user}></ProfileTitle>
            <div className="users-bar-text">
                <div className={`users-bar-label ${followLabel === followLabels.FOLLOWING ? "following" : "follow"}`}
                    onClick={onToggleFollow}>{followLabel}
                </div>
            </div>
        </section> 
    )     
}

/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { userService } from "../services/user.service";
import { userActions } from '../store/actions/user.actions';
import { ProfileTitle } from './ProfileTitle';

export function UsersBarItem({user, currentUser}) {

    const [followLabel, setFollowLabel] = useState('')

    useEffect(() => {
        setFollowLabel(getFollowLabelValue())
    }, [currentUser])

    const getFollowLabelValue = () => {
        return !currentUser.following || currentUser.following == 0 ? userService.getFollowLabels().FOLLOW :
            currentUser.following.filter(userItem => userItem._id === user._id).length > 0 ? 
                userService.getFollowLabels().FOLLOWING : userService.getFollowLabels().FOLLOW
    }

    const onToggleFollow = async () => {
        if (followLabel === userService.getFollowLabels().FOLLOW)
            await userActions.followUser(user)
        else
            await userActions.unFollowUser(user)

        // Using PREV, like in the following first line, didn't work! (The second line did work) ??? :
        //setFollowLabel(prev => prev === followLabels.FOLLOW ? followLabels.FOLLOWING : followLabels.FOLLOW)
        //setFollowLabel(followLabel === followLabels.FOLLOW ? followLabels.FOLLOWING : followLabels.FOLLOW)
    }

    return (
        <section id={user._id} className="users-bar-item users-bar-item-profile">
            <NavLink to={`/${user.username}`}>
                <ProfileTitle profile={user} caption={user === currentUser ? user.fullname : "Suggested for you"}/>
            </NavLink>
            <div className="users-bar-text">
                <div className={`users-bar-label ${followLabel === userService.getFollowLabels().FOLLOWING ? "following" : "follow"}`}
                    onClick={onToggleFollow}>{user === currentUser ? "Switch" : followLabel}
                </div>
            </div>
        </section> 
    )     
}

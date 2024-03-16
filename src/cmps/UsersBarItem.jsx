/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { userService } from "../services/user.service";
import { userActions } from '../store/actions/user.actions';
import { ProfileTitle } from './ProfileTitle';

export function UsersBarItem({user, currentUser, onSwitchUser}) {

    const [followLabel, setFollowLabel] = useState('')

    useEffect(() => {
        setFollowLabel(getFollowLabelValue())
    }, [currentUser])

    const getFollowLabelValue = () => {
        return !currentUser.following || currentUser.following.length === 0 ? userService.getFollowLabels().FOLLOW :
            currentUser.following.filter(userItem => userItem._id === user._id).length > 0 ? 
                userService.getFollowLabels().FOLLOWING : userService.getFollowLabels().FOLLOW
    }

    const onToggleFollow = async () => {

        if (user === currentUser && onSwitchUser) {
            onSwitchUser()
            return
        }

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
                <ProfileTitle profile={user} caption={user === currentUser ? user.fullname : 
                    user.following.filter(follower => follower._id === currentUser._id).length > 0 ?
                        "Following you" :
                        currentUser.following.filter(follow => follow._id === user._id).length > 0 ?
                            "Popular" :
                            "Suggested for you"}/>
            </NavLink>
            <div className="users-bar-text">
                <div className={`users-bar-label ${followLabel === userService.getFollowLabels().FOLLOWING ? "following" : "follow"}`}
                    onClick={onToggleFollow}>
                        {user === currentUser ? "Switch" : followLabel}
                </div>
            </div>
        </section> 
    )     
}

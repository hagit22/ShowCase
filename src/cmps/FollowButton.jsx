/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react'
import { userService } from '../services/user.service.js'
import { userActions } from '../store/actions/user.actions.js'

export function FollowButton({currentUser, aboutUserMini, userList}) {

    const [followLabel, setFollowLabel] = useState('')

    useEffect(() => {
        //console.log("FollowButton Component: ", currentUser, aboutUserMini)
        setFollowLabel(getFollowLabelValue())
    }, [currentUser, aboutUserMini])

    const getFollowLabelValue = () => {
        return !currentUser.following || currentUser.following.length === 0 ? userService.getFollowLabels().FOLLOW :
            currentUser.following.filter(userItem => userItem._id === aboutUserMini._id).length > 0 ? 
                userService.getFollowLabels().FOLLOWING : userService.getFollowLabels().FOLLOW
    }

    const onToggleFollowButton = async () => {
        const aboutUser = userList.filter(user=>user._id === aboutUserMini._id)[0]
        if (followLabel === userService.getFollowLabels().FOLLOW)
            await userActions.followUser(aboutUser)
        else
            await userActions.unFollowUser(aboutUser)
    }

    return ( !currentUser || !aboutUserMini ? '' :
        <button onClick={onToggleFollowButton} className={`item-button 
            ${followLabel === userService.getFollowLabels().FOLLOWING ? "button-following" : "button-follow"}`}>
                {followLabel}
        </button>
    )
}





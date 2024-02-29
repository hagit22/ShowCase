/* eslint-disable react/prop-types */
import { useState } from 'react';
import { ProfileTitle } from './ProfileTitle';

export function UsersBarItem({user, onClickItem}) {

    const [followLabel, setFollowLabel] = useState("Follow")

    return (
        <section id={user._id} className="users-bar-item users-bar-item-profile" onClick={onClickItem}>
            <ProfileTitle profile={user}></ProfileTitle>
            <div className="users-bar-text">
                <div className="users-bar-follow">{followLabel}</div>
            </div>
        </section> 
    )     
}

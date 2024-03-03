/* eslint-disable react/prop-types */

import { Children } from "react";

export function ProfileTitle({ profile, displayImage=true, children }) {

    if (!profile) return '' 
    const { imgUrl, username } = profile;
    return (
        <div className="profile-title">
            {displayImage ? <img src={imgUrl}/> : ''}
            <span >{username}</span>
            {children}
        </div>
    )
}

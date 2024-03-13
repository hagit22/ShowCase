/* eslint-disable react/prop-types */

import { Children } from "react";

export function ProfileTitle({ profile, displayImage=true, caption='', children }) {

    if (!profile) return '' 
    const { imgUrl, username } = profile;
    return (
        <div className="profile-title">
            {displayImage ? <img src={imgUrl}/> : ''}
                <div className="profile-caption">
                    <span className="profile-text">{username.toLowerCase()}</span>
                    <span className="caption-text">{caption}</span>
                </div>
            {children}
        </div>
    )
}

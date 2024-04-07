/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react'
import { utilService } from '../services/util.service.js'
import { FollowButton } from './FollowButton.jsx'

export function NotificationsPane({show, currentUser, userList, userNotifications}) {

    const [notificationGroups, setNotificationsGroups] = useState([])

    useEffect(() => {
        setNotificationsGroups(getNotificationGroups())
    }, [userNotifications])


    function getNotificationGroups()
    {
        if (!userNotifications || userNotifications.length === 0) 
            return []
        const groups = utilService.getPassedTimeGroups(userNotifications, "createdAt")
        //console.log("Notifications Groups: ",groups)
        return groups
    }

    return ( !currentUser || !notificationGroups ? '' :
        <section className={`notifications-section ${show ? " notifications-show" : " notifications-hide"}`}>
            <div className="notifications-content">
                <div className="notifications-title">   
                    Notifications
                </div>
                {notificationGroups && notificationGroups.length > 0 && 
                    notificationGroups.map(group => group.data && group.data.length > 0 &&
                <div key={group.name}><div className="notifications-group">
                    <div className="notifications-group-title">
                        {group.name}
                    </div>
                    {group.data.map((notify, mapIndex) => 
                    <div key={mapIndex} className="notifications-item">
                        <div className="item-image-and-text">
                            <img className="item-image" src={notify.aboutUser.imgUrl}/>
                            <span className="item-text">
                                <span className="item-user">{notify.aboutUser.username}{' '}</span> 
                                {notify.txt}
                                {' '}<span className="item-passed-time"> 
                                    {notify.createdAt && 
                                        (utilService.getPassedTimeString(notify.createdAt) == "0m" ? '' :
                                            utilService.getPassedTimeString(notify.createdAt)
                                    )}
                                </span>
                            </span>
                        </div>
                        {notify.storyImgUrl && (!notify.txt.startsWith('joined')) ?  // new story but not new signup
                            <img className="item-story-image" src={notify.storyImgUrl}/> :
                            <FollowButton currentUser={currentUser} aboutUserMini={notify.aboutUser} userList={userList}/>}
                    </div>)}
                </div>
                <div className="notifications-group-separator"/></div>)}
            </div>
        </section>
    )
}





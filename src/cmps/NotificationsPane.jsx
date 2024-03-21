/* eslint-disable react/prop-types */import { useState, useEffect, useRef } from 'react'
import { utilService } from '../services/util.service.js'

export function NotificationsPane({show, currentUser}) {

    const [notificationGroups, setNotificationsGroups] = useState(getNotificationGroups())

    useEffect(() => {
        setNotificationsGroups(getNotificationGroups())
    }, [currentUser, currentUser.notifications])

    function getNotificationGroups()
    {
        //console.log(currentUser.notifications)
        if (!currentUser || !currentUser.notifications || currentUser.notifications.length === 0) 
            return []
        const groups = utilService.
            getPassedTimeGroups(currentUser.notifications, "createdAt")
        //console.log(groups)
        return groups
    }

    function onClickFollow({target}) {

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
                    {group.data.map(notify => 
                    <div key={notify._id} className="notifications-item">
                        <img className="item-image" src={notify.about.imgUrl}/>
                        <span className="item-text">
                            <span className="item-user">{notify.about.username} </span> 
                            {notify.txt}
                            <span className="item-passed-time"> {utilService.getPassedTimeString(notify.createdAt)}</span>
                        </span>
                        {notify.txt.startsWith("posted") ?
                        <button className="item-button button-following" onClick={onClickFollow}>Following</button> :
                        <button className="item-button button-follow" onClick={onClickFollow}>Follow</button>}
                    </div>)}
                </div>
                <div className="notifications-group-separator"/></div>)}
            </div>
        </section>
    )
}





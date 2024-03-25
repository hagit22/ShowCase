/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from 'react'
import { utilService } from '../services/util.service.js'
import { socketService } from '../services/socket.service.js'
import { userService } from '../services/user.service.js'
import { storyService } from '../services/story.service.js'
import { userActions } from '../store/actions/user.actions.js'

export function NotificationsPane({show, currentUser, userList, storyList}) {

    const userNotifications = useRef([])
    const [notificationGroups, setNotificationsGroups] = useState([])
    const [newNotification, setNewNotification] = useState(false)

    useEffect(() => {
        if (!currentUser || userList.length === 0 || storyList.length === 0)
            return
        setNewNotification(false)
        socketService.onNewUser(onNewNotification)
        socketService.onNewFollower(onNewNotification)
        socketService.onStoryByFollowing(onNewNotification)
    }, [currentUser, userList.length, storyList.length])

    useEffect(() => {
        if (!currentUser || !currentUser.notifications) {
            userNotifications.current = []
            return
        }
        userNotifications.current = [...(currentUser.notifications)]
    }, [currentUser, currentUser.notifications])

    useEffect(() => {
        setNotificationsGroups(getNotificationGroups())
    }, [userNotifications.current])

    function getNotificationGroups()
    {
        if (!userNotifications || userNotifications.length === 0) 
            return []
        const groups = utilService.getPassedTimeGroups(userNotifications.current, "createdAt")
        //console.log("Notifications Groups: ",groups)
        return groups
    }

    function onNewNotification(notificationType, aboutUserId, aboutStoryId, notificationMessage) {
        //console.log("GOT - onNewNotification: ",notificationType, aboutUserId, aboutStoryId, notificationMessage)
        setNewNotification(true)
        const notification = userService.createNewNotification(notificationMessage, 
            aboutUserId ? userList.filter(user=>user._id === aboutUserId)[0] : null,
            aboutStoryId ? storyList.filter(story=>story._id === aboutStoryId)[0] : null)
        userNotifications.current = [notification, ...(userNotifications.current)]
        userActions.updateCurrentUser({...currentUser, notifications: [notification, ...(currentUser.notifications)]})
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
                            <span className="item-user">{notify.about.username}{' '}</span> 
                            {notify.txt}
                            {' '}<span className="item-passed-time"> 
                                {notify.createdAt && utilService.getPassedTimeString(notify.createdAt)}
                            </span>
                        </span>
                        {notify.txt.startsWith("posted") ?
                        <button className="item-button button-following" onClick={onClickFollow}>Following</button> :
                        <button className="item-button button-follow" onClick={onClickFollow}>Follow</button>}
                    </div>)}
                </div>
                <div className="notifications-group-separator"/></div>)}
            </div>
            <div className={`new-notification-overlay ${newNotification ? " new-notification-visible" : ''}`}/>
        </section>
    )
}





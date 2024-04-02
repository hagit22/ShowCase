/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from 'react'
import { utilService } from '../services/util.service.js'
import { socketService, notificationTypes } from '../services/socket.service.js'
import { userService } from '../services/user.service.js'
import { FollowButton } from './FollowButton.jsx'

export function NotificationsPane({show, currentUser, userList, storyList, onNotify}) {

    const userNotifications = useRef([])
    const [notificationGroups, setNotificationsGroups] = useState([])

    useEffect(() => {
        if (!currentUser || userList.length === 0 || storyList.length === 0)
           return
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

    function onNewNotification(notificationType, aboutUserId, imgUrl, aboutUserName, notificationMessage) {
        console.log("GOT - onNewNotification: ",notificationType, aboutUserId, imgUrl, aboutUserName, notificationMessage)
        const aboutUser = aboutUserName ? {_id: aboutUserId, username: aboutUserName, imgUrl} :  // in case of new signup, user is still not in userList
            userList.filter(user=>user._id === aboutUserId)[0]
        const notification = userService.createUserNotification(notificationMessage, aboutUser, imgUrl || null)
        console.log("The New Notification is: ",notification, "length before: ",userNotifications.current.length)
        userNotifications.current = [notification, ...(userNotifications.current)]
        console.log("all notifications: ",userNotifications.current.length,": ",userNotifications)
        onNotify(true)
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





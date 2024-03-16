/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import { utilService } from '../services/util.service'
import { ProfileTitle } from './ProfileTitle'
import { UsersBarItem } from './UsersBarItem'
import { SwitchUserModal } from './SwitchUserModal';
import { DynamicModal2 } from './DynamicModal2'

export function UsersBar({userList, currentUser, numDisplayUsers}) {

    const [displayUsers, setDisplayUsers] = useState([])
    const [showSwitchUserModal, setShowSwitchUserModal] = useState(false)

    const elSeeAll = useRef(null)

    useEffect(() => {
        updateDisplayUsers(numDisplayUsers)
    }, [userList])

    async function updateDisplayUsers(maxUsers) {
        if (!currentUser || !userList || userList.length <= 0) return
        const displayUserIds = utilService.getUniqueRandomElements(userList, maxUsers, "_id", [currentUser._id])
        const displayUserObjects = !userList ? [] : 
            displayUserIds.map(userId => userList.filter(userItem => userItem._id === userId)[0])
        setDisplayUsers([...displayUserObjects])
    }

    function onShowAll() {
        if (elSeeAll.current == null)
            return
        updateDisplayUsers(userList.length)
        elSeeAll.current.style.color = "lightgray" //variables.lightText
        elSeeAll.current.style.cursor = "default"
        elSeeAll.current = null
        //elSeeAll.current.disabled = true    //doesn't work
        //elSeeAll.current.removeEventListener('click', onShowAll)    //doesn't work
        //elSeeAll.current.addEventListener('click', ()=>{})
    }

    function onSwitchUser() {
        setShowSwitchUserModal(true)
    }

    function onDoneSwitchUser() {
        setShowSwitchUserModal(false)
    }


    return ( !userList || userList.length == 0 || !currentUser ? '' :
        <section className="users-bar-section">
            <div className="users-bar-content">
                {/*<div className="users-bar-item-profile">
                        <NavLink to={`/${currentUser.username}`}>
                            <ProfileTitle profile={currentUser}/>
                        </NavLink>
                </div>*/}
                <UsersBarItem user={currentUser} currentUser={currentUser} onSwitchUser={onSwitchUser} />
                <div className="users-bar-item users-bar-text">
                    <span>Suggested for you</span>
                    <a ref={elSeeAll} onClick={onShowAll}>See All</a>
                </div>
                <div className="users-bar-list"> 
                    {displayUsers && displayUsers.length > 0 && displayUsers.map((dispUser) =>  
                        <div key={dispUser._id}> 
                            <UsersBarItem user={dispUser} currentUser={currentUser} onSwitchUser={null} />
                        </div>
                    )}
                </div>
            </div>
            {/*showSwitchUserModal && <DynamicModal2 cmp={SwitchUserModal*/} 
            <DynamicModal2 cmp={showSwitchUserModal ? SwitchUserModal : null}
            props={{users: userList, currentUser, onDoneSwitchUser}} onCloseModal={onDoneSwitchUser}/>
        </section>
    )
}





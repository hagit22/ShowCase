/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import { utilService } from '../services/util.service'
import { userService } from '../services/user.service'
import { ProfileTitle } from './ProfileTitle'
import { UsersBarItem } from './UsersBarItem'
import variables from '../../src/assets/styles/setup/_variables.scss'

export function UsersBar({userList, currentUser, numDisplayUsers}) {

    const [displayUsers, setDisplayUsers] = useState([])
    const elSeeAll = useRef(null)

    useEffect(() => {
        updateDisplayUsers(numDisplayUsers)
    }, [userList])

    async function updateDisplayUsers(maxUsers) {
        if (!currentUser || !userList || userList.length <= 0) return
        const displayUserIds = utilService.getUniqueRandomElements(userList, maxUsers, "_id", [currentUser._id])
        const displayUserObjects = await Promise.all(displayUserIds.map(userId => userService.getById(userId)))
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

    return ( !userList || userList.length == 0 ? '' :
        <section className="users-bar">
            <div className="users-bar-content">
                <div className="users-bar-item-profile">
                    <NavLink to={`/${currentUser.username}`}>
                        <ProfileTitle profile={currentUser}/>
                    </NavLink>
                </div>
                <div className="users-bar-item users-bar-text">
                    <span>Suggested for you</span>
                    <a ref={elSeeAll} onClick={onShowAll}>See All</a>
                </div>
                <div className="users-bar-list"> 
                    {displayUsers.length > 0 && displayUsers.map((dispUser) =>  
                        <div key={dispUser._id}> 
                            <UsersBarItem user={dispUser} currentUser = {currentUser} />
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}





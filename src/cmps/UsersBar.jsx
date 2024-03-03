/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react'
import { utilService } from '../services/util.service'
import { userService } from '../services/user.service'
import { ProfileTitle } from './ProfileTitle';
import { UsersBarItem } from './UsersBarItem'

export function UsersBar({userList, currentUser, numDisplayUsers}) {

    const [displayUsers, setDisplayUsers] = useState([])

    useEffect(() => {
        updateDisplayUsers()
    }, [userList])

    async function updateDisplayUsers() {
        if (!currentUser || !userList || userList.length <= 0) return
        const displayUserIds = utilService.getUniqueRandomElements(userList, numDisplayUsers, "_id", [currentUser._id])
        const displayUserObjects = await Promise.all(displayUserIds.map(userId => userService.getById(userId)))
        setDisplayUsers([...displayUserObjects])
    }

    function onClickItem({target}) {
    }

    return ( !userList || userList.length == 0 ? '' :
        <section className="users-bar">
            <div className="users-bar-content">
                <div className="users-bar-item-profile">
                    <ProfileTitle profile={currentUser}/>
                </div>
                <div className="users-bar-item users-bar-text">
                    <span>Suggested for you</span>
                    <div>See All</div>
                </div>
                <div className="users-bar-list"> 
                    {displayUsers.length>0 && displayUsers.map((dispUser) =>  
                        <div key={dispUser._id}> 
                            <a>
                                <UsersBarItem user={dispUser} onClickItem={onClickItem} />
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}





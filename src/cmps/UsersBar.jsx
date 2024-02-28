/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react'
import { utilService } from '../services/util.service'
import { userService } from '../services/user.service'
import { UsersBarItem } from './UsersBarItem'


export function UsersBar({userList, currentUser, numDisplayUsers}) {

    const [displayUsers, setDisplayUsers] = useState([])

    useEffect(() => {
        updateDisplayUsers()
    }, [userList])

    async function updateDisplayUsers() {
        const displayUserIds = utilService.getUniqueRandomElements(userList, numDisplayUsers, "_id", [currentUser._id])
        const displayUserObjects = await Promise.all(displayUserIds.map(userId => userService.getById(userId)))
        setDisplayUsers([...displayUserObjects])
    }

    function onClickItem({target}) {
    }

    return (
        <section className="users-bar">
            <div className="users-bar-content">
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





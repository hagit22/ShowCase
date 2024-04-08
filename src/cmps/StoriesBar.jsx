/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react'
import { utilService } from '../services/util.service'

export function StoriesBar({userList, currentUser, numDisplayStories}) {

    const [displayStories, setDisplayStories] = useState([])

    useEffect(() => {
        updateDisplayStories(numDisplayStories)
    }, [userList.length])

    async function updateDisplayStories(maxUsers) {
        if (!currentUser || !userList || userList.length <= 0) return
        const displayStoryIds = utilService.getUniqueRandomElements(userList, maxUsers, "_id", [currentUser._id])
        const displayStoryObjects = !userList ? [] : 
            displayStoryIds.map(userId => userList.filter(userItem => userItem._id === userId)[0])
        setDisplayStories([...displayStoryObjects])
    }

    return ( !userList || userList.length == 0 || !currentUser ? '' :
        <section className="stories-bar-section">
            <div className="stories-bar-list"> 
                {displayStories && displayStories.length > 0 && displayStories.map((dispUser) =>  
                    <div key={dispUser._id} className="stories-bar-item"> 
                        <img src={dispUser.imgUrl}className="stories-bar-image"/>
                        <div className="stories-bar-text">{dispUser.username}</div>
                    </div>
                )}
            </div>
        </section>
    )
}





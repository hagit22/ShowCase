import { utilService } from '../../services/util.service.js'
import { socketService, notificationMessages } from "../../services/socket.service.js";
import { userService } from '../../services/user.service.js';
import { storyService } from '../../services/story.service.js'
import { store } from '../store.js'
import { storyActionTypes } from '../reducers/story.reducer.js'

export const storyActions = {
    loadStories,
    addStory,
    updateStory,
    removeStory
}


async function loadStories(currentUser) {
    try {
        let stories = await storyService.getStories()
        //stories = utilService.randomShuffleArray(stories)
        stories = _arrangeByFollowing(stories, currentUser)
        store.dispatch(_getActionSetStories(stories))
    } catch (err) {
        console.log('Cannot load stories', err)
        throw err
    }
}

async function addStory(story, currentUser) {
    try {
        const savedStory = await storyService.save(story)
        //console.log('Added Story', savedStory)
        store.dispatch(_getActionAddStory(savedStory))
        socketService.emitUserPost(currentUser.followers.map(follower=>follower._id), savedStory.imgUrl)
        const userNotification = userService.createUserNotification(notificationMessages.storyByFollowing, currentUser, savedStory.imgUrl)
        userService.updateFollowers(currentUser, userNotification)
        return savedStory
    } catch (err) {
        console.log('Cannot add story', err)
        throw err
    }
}

async function updateStory(story) {
    try {
        const savedStory = await storyService.save(story)
        //console.log('Updated Story:', story)
        store.dispatch(_getActionUpdateStory(savedStory))
        return savedStory
    } catch (err) {
        console.log('Cannot save story', err)
        throw err
    }
}

async function removeStory(storyId) {
    try {
        await storyService.remove(storyId)
        store.dispatch(_getActionRemoveStory(storyId))
    } catch (err) {
        console.log('Cannot remove story', err)
        throw err
    }
}

// Action Creators:
function _getActionSetStories(stories) {
    return {
        type: storyActionTypes.SET_STORIES,
        stories
    }
}
function _getActionAddStory(story) {
    return {
        type: storyActionTypes.ADD_STORY,
        story
    }
}
function _getActionUpdateStory(story) {
    return {
        type: storyActionTypes.UPDATE_STORY,
        story
    }
}
function _getActionRemoveStory(storyId) {
    return {
        type: storyActionTypes.REMOVE_STORY,
        storyId
    }
}


// Demo for Optimistic Mutation 
// (IOW - Assuming the server call will work, so updating the UI first)
export function onRemoveStoryOptimistic(storyId) {
    store.dispatch({
        type: storyActionTypes.REMOVE_STORY,
        storyId
    })

    storyService.remove(storyId)
        .then(() => {
            console.log('Server Reported - Deleted Successfully');
        })
        .catch(err => {
            console.log('Cannot load stories', err)
            store.dispatch({
                type: storyActionTypes.UNDO_REMOVE_STORY,
            })
        })
}

function _arrangeByFollowing(stories, currentUser) {
    //if (!currentUser || !currentUser.following || currentUser.following.length === 0)
        //return stories

    if (!currentUser)
        return stories

    let usersIFollow = currentUser.following.map(follow => follow._id)
    usersIFollow = [...usersIFollow, currentUser._id]

    let storiesNotFollowing = [...stories.filter(story => !usersIFollow.includes(story.by._id))]
    storiesNotFollowing = utilService.randomShuffleArray(storiesNotFollowing)

    let storiesFollowing = [...stories.filter(story => usersIFollow.includes(story.by._id))]
    storiesFollowing = [...storiesFollowing.sort((a,b) => a.createdAt > b.createdAt ? -1 : 1)]  // latest first
    
    stories = [...storiesFollowing.concat([...storiesNotFollowing])]
    //console.log(stories)

    //const myStories = stories.filter(story => story.by._id === currentUser._id)
    const todaysStories = stories.filter(story => fromToday(story.createdAt))
    const sortedTodaysStories = [...todaysStories.sort((a,b) => a.createdAt > b.createdAt ? -1 : 1)]  // latest first

    //console.log("Today: ",sortedTodaysStories)

    const otherStories = stories.filter(story => !todaysStories.includes(story))

    const resultedStories = [...sortedTodaysStories, ...otherStories]

    return resultedStories
    //return stories
}

function fromToday(timestamp) {
    const today = new Date();
    const isToday = (today.toDateString() === new Date(timestamp).toDateString());
    return isToday
}

/*const fromToday = (someDate) => {
    const today = new Date()
    return someDate.getDate() == today.getDate() &&
      someDate.getMonth() == today.getMonth() &&
      someDate.getFullYear() == today.getFullYear()
}*/


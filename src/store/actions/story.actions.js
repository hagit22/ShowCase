import { store } from '../store.js'
import { storyService } from '../../services/story.service.js'
import { utilService } from '../../services/util.service.js'
import { userActions } from './user.actions.js'
import { storyActionTypes } from '../reducers/story.reducer.js'
import { showSuccessMsg, showErrorMsg } from '../../services/event-bus.service.js'

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

async function addStory(story) {
    try {
        const savedStory = await storyService.save(story)
        //console.log('Added Story', savedStory)
        store.dispatch(_getActionAddStory(savedStory))
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
    showSuccessMsg('Story removed')

    storyService.remove(storyId)
        .then(() => {
            console.log('Server Reported - Deleted Successfully');
        })
        .catch(err => {
            showErrorMsg('Cannot remove story')
            console.log('Cannot load stories', err)
            store.dispatch({
                type: storyActionTypes.UNDO_REMOVE_STORY,
            })
        })
}

function _arrangeByFollowing(stories, currentUser) {
    if (!currentUser || !currentUser.following || currentUser.following.length === 0)
        return stories
    const usersIFollow = currentUser.following.map(follow => follow._id)

    let storiesNotFollowing = [...stories.filter(story => !usersIFollow.includes(story.by._id))]
    storiesNotFollowing = utilService.randomShuffleArray(storiesNotFollowing)

    let storiesFollowing = [...stories.filter(story => usersIFollow.includes(story.by._id))]
    storiesFollowing = [...storiesFollowing.sort((a,b) => a.createdAt > b.createdAt ? -1 : 1)]  // latest first
    
    stories = [...storiesFollowing.concat([...storiesNotFollowing])]
    console.log(stories)
    return stories
}


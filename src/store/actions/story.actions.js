import { store } from '../store.js'
import { storyService } from '../../services/story.service.js'
import { storyActionTypes } from '../reducers/story.reducer.js'
import { showSuccessMsg, showErrorMsg } from '../../services/event-bus.service.js'

export const storyActions = {
    loadStories,
    addStory,
    updateStory,
    removeStory
}


async function loadStories() {
    try {
        const stories = await storyService.getStories()
        //console.log('Stories from DB:', stories)
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

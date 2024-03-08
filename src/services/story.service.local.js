import { storageService } from './async-storage.service.js'
import { userService } from './user.service.js'

export const storyServiceLocal = {
    getStories,
    getById,
    remove,
    save
}

const STORAGE_KEY_STORIES = 'stories_db'
window.storyServiceLocal = storyServiceLocal

async function getStories(filterBy = { txt: '', by: 0 }) {
    var stories = await storageService.query(STORAGE_KEY_STORIES)
    if (filterBy.txt) {
        const regex = new RegExp(filterBy.txt, 'i')
        stories = stories.filter(story => regex.test(story.vendor) || regex.test(story.description))
    }
    if (filterBy.by) {
        stories = stories.filter(story => story.by.username === filterBy.by.username)
    }
    
    // sort comments by date
    stories.map(story => ({...story, comments: story.comments.sort((a,b) => 
        new Date(a["createdAt"]).getTime() < new Date(b["createdAt"]).getTime() ? 1 : -1)}))

    // sort stories by date
    stories = stories.sort((a,b) => new Date(a["createdAt"]).getTime() < new Date(b["createdAt"]).getTime() ? 1 : -1);
    return stories
}  

function getById(storyId) {
    return storageService.get(STORAGE_KEY_STORIES, storyId)
}

async function remove(storyId) {
    // throw new Error('Nope')
    await storageService.remove(STORAGE_KEY_STORIES, storyId)
}

async function save(story) {
    var savedStory
    if (story._id) {
        savedStory = await storageService.put(STORAGE_KEY_STORIES, story)
    } else {
        // Later, 'by' is set by the backend
        story.by = userService.getMiniLoggedInUser()
        savedStory = await storageService.post(STORAGE_KEY_STORIES, story)
    }
    return savedStory
}



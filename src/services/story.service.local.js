import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'
import { userService } from './user.service.js'

const STORAGE_KEY_STORIES = 'stories_db'
const ID_LENGTH = 6;

export const storyService = {
    query,
    getById,
    save,
    remove,
    addStoryMsg,
    getEmptyStory
}
window.cs = storyService

const users = userService.generateInitialUsers()
_generateInitialStories(users)

async function query(filterBy = { txt: '', by: 0 }) {
    var stories = await storageService.query(STORAGE_KEY_STORIES)
    if (filterBy.txt) {
        const regex = new RegExp(filterBy.txt, 'i')
        stories = stories.filter(story => regex.test(story.vendor) || regex.test(story.description))
    }
    if (filterBy.by) {
        stories = stories.filter(story => story.by.username === filterBy.by.username)
    }
    return stories
}

function getById(storyId) {
    return storageService.get(STORAGE_KEY_STORIES, storyId)
}

async function save(story) {
    var savedStory
    if (story._id) {
        savedStory = await storageService.put(STORAGE_KEY_STORIES, story)
    } else {
        // Later, 'by' is set by the backend
        story.by = userService.getLoggedInUser()
        savedStory = await storageService.post(STORAGE_KEY_STORIES, story)
    }
    return savedStory
}

async function remove(storyId) {
    // throw new Error('Nope')
    await storageService.remove(STORAGE_KEY_STORIES, storyId)
}

async function addStoryMsg(storyId, txt) {
    // Later, this is all done by the backend
    const story = await getById(storyId)
    if (!story.msgs) story.msgs = []

    const msg = {
        id: utilService.makeId(),
        by: userService.getLoggedInUser(),
        txt
    }
    story.msgs.push(msg)
    await storageService.put(STORAGE_KEY_STORIES, story)

    return msg
}

function getEmptyStory() {
    return {
        txt: 'My adorable newborn kittens',
        imgUrl: '/assets/data/img/kittens.jpg',
    }
}

function _generateInitialStories(users) {
    let initialStories = utilService.loadFromStorage(STORAGE_KEY_STORIES)
    if (!initialStories || !initialStories.length) {
        initialStories = [];
        for (let i = 0; i < 20; i++) 
            initialStories.push(_generateStory(users));
        utilService.saveToStorage(STORAGE_KEY_STORIES, initialStories)
    }
}

function _generateStory(users) {
    const randDate = utilService.generateRandomTimestamp()
    const timeStamp = randDate.getTime()
    const randUrl = `https://picsum.photos/seed/${timeStamp}/470/600`
    return {
        _id: utilService.makeId(ID_LENGTH),
        txt: utilService.makeLorem(20), //utilService.generateText(),
        imgUrl: randUrl, 
        createdAt: randDate, 
        by: userService.chooseRandomUser(users),
        likedBy: userService.chooseRandomUserList(users, users.length*0.75),
        comments: userService.chooseRandomUserList(users, users.length*0.3).map(user => ({
            id: utilService.makeId(ID_LENGTH), 
            by: user, 
            txt: utilService.makeLorem(10), 
            likedBy: userService.chooseRandomUserList(users, users.length*0.5)
        }))
    } 
}

// TEST DATA
// storageService.post(STORAGE_KEY_STORIES, {txt: 'Test data', imgUrl: '/assets/data/img/...jpg'}).then(x => console.log(x))



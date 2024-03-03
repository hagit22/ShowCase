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
    generateNewStory,
    generateNewComment
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
        by: userService.getMiniLoggedInUser(),
        txt
    }
    story.msgs.push(msg)
    await storageService.put(STORAGE_KEY_STORIES, story)

    return msg
}

function generateNewStory(storyUrl, storyText) {
    return {
        txt: storyText,
        imgUrl: storyUrl, 
        createdAt: Date.now(), 
        likedBy: [],
        comments: []
        // 'by' (property) is generated by 'save()', and 'id' is generated by 'post()'
    }
}

function generateNewComment(commentText) {
    return {
        _id: utilService.makeId(ID_LENGTH),
        txt: commentText,
        by: userService.getMiniLoggedInUser(),
        likedBy: [],
        createdAt: Date.now(), 
    }
}

function _generateInitialStories(users) {
    let initialStories = utilService.loadFromStorage(STORAGE_KEY_STORIES)
    if (!initialStories || !initialStories.length) {
        initialStories = [];
        for (let i = 0; i < 30; i++) 
            initialStories.push(_generateStory(users));
        initialStories.push(_generateStory(users, userService.getMiniLoggedInUser())); // we want loggedInUser to have at least 1 post
        utilService.saveToStorage(STORAGE_KEY_STORIES, initialStories)
        _generateInitialBookmarks(initialStories)
    }
}

function _generateStory(users, forcedUser) {
    const randDate = utilService.generateRandomTimestamp()
    const timestamp = randDate.getTime()
    const randUrl = `https://picsum.photos/seed/${timestamp}/470/600`
    return {
        _id: utilService.makeId(ID_LENGTH),
        txt: utilService.makeLorem(20), //utilService.generateText(),
        imgUrl: randUrl, 
        createdAt: randDate, 
        by: forcedUser || userService.chooseRandomUser(users),
        likedBy: userService.chooseRandomUserList(users, users.length*0.75),
        comments: userService.chooseRandomUserList(users, users.length*0.3).map(miniUser => ({
            _id: utilService.makeId(ID_LENGTH), 
            by: miniUser, 
            txt: utilService.makeLorem(10), 
            likedBy: userService.chooseRandomUserList(users, users.length*0.5),
            createdAt: utilService.generateRandomTimestampFrom(timestamp) // comment only after post was published
        }))
    } 
}

async function _generateInitialBookmarks(stories) {
    const loggedInUser = userService.getLoggedInUser()
    if (!loggedInUser)
        return
    loggedInUser.bookmarkedStories = [..._chooseRandomStoryList(stories, 3)]
    await userService.update(loggedInUser)
}

function _chooseRandomStoryList(stories, numStoriesToChoose) {
    const chosenStories = new Set()
    const totalStories = stories ? stories.length : 0
    for (let i=0; i<totalStories; i++) {
        chosenStories.add(_chooseRandomStory(stories))
        if (chosenStories.size == numStoriesToChoose)
            break
    }
    return Array.from(chosenStories)
}

function _chooseRandomStory(stories) {
    return _getMiniStory(utilService.chooseRandomItemFromList(stories));
}

function _getMiniStory(story) {
    if (!story)
        return null
    const { _id, imgUrl } = story
    return({ _id, imgUrl })
}



// TEST DATA
// storageService.post(STORAGE_KEY_STORIES, {txt: 'Test data', imgUrl: '/assets/data/img/...jpg'}).then(x => console.log(x))



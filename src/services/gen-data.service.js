import { utilService } from './util.service.js'
import { sessionStorageService } from './session-storage.service.js'
import { userService } from './user.service.js'
import { userActions } from '../store/actions/user.actions.js';
import { storyService } from './story.service.js';

export const genDataService = {
    generateInitialData
}

const ID_LENGTH = 6; 
const STORAGE_KEY_STORIES = 'stories_db'
const STORAGE_KEY_USERS = 'users_db'


/* For mongo-db-server (as opposed to local-storage), we will make sure not to generate ID for: story, user and logged-in user,
    and also not to generate createdAt for story. Next we will comment-in the functions that download the generated data, 
    and we will import the downloaded files into the Mongo-DB through compass. (originally, data was saved to local-storage).
    * The loggedInUser + password will enter the Mongo due to 'signup'
    * Make sure to remove the loggedInUser from the downloaded json file, before importing it into Mongo! 
    * Comment in for generating bookmarks for loggedInUser */

async function generateInitialData() {
    await login()
    const users = await _generateInitialUsers()
    console.log("generate users: ",users)
    const stories = await _generateInitialStories(users)    
    console.log("generate stories: ",stories)
    
    //const loggedInUser = await _generateInitialBookmarks(stories)
    //console.log("generate bookmarks: ",loggedInUser)
    return users
}

// User Data 

async function _generateInitialUsers() {
    //let initialUsers = utilService.loadFromStorage(STORAGE_KEY_USERS) || []
    let initialUsers = await userService.getUsers()
    if (!initialUsers || initialUsers.length === 0) {
        signup()
        initialUsers = []
        const loggedInUser = await signup()
        console.log("logged-in user: ",loggedInUser)
        initialUsers.push(loggedInUser)
        for (let i = 0; i < 10; i++) 
            initialUsers.push(_generateUser());
        _saveJsonFile(initialUsers, "users-data")
        //utilService.saveToStorage(STORAGE_KEY_USERS, initialUsers)
    }
    // we always want to make sure we have a loggedInUser- as it is temporary per session
    /*const newLoggedInUser = _generateSessionLoggedInUser(initialUsers)
    if (newLoggedInUser) { // newly created 
        initialUsers.push(newLoggedInUser)
        utilService.saveToStorage(STORAGE_KEY_USERS, initialUsers)
    //}*/
    return initialUsers
}

function _generateUser() {
    const userId = utilService.makeId(ID_LENGTH)
    const userImgUrl = `https://picsum.photos/seed/${userId}/470/600`
    const username = utilService.generateRandomUsername()
    return {
        //_id: userId,
        username: username, 
        fullname: utilService.generateRandomFullname(username), 
        imgUrl: userImgUrl,
        bookmarkedStories: [],
        following: [],
        followers: []
    }
}

function _generateSessionLoggedInUser(initialUsers) {
    const uniqueURLseed = "!!==loggedInUser==!!"
    const uniqueImgUrl = `https://picsum.photos/seed/${uniqueURLseed}1/470/600` 
    // we want loggedInUser from session-storage to have the same id within the 'initialUsers' list
    let loggedInUser = initialUsers.filter(user=>user.imgUrl === uniqueImgUrl)[0] || undefined
    if (!loggedInUser)  {
        loggedInUser = {
            _id: utilService.makeId(ID_LENGTH),
            username: "Instush",
            password: "1234",
            fullname: "My Name:)", //"Instagram User",
            imgUrl: uniqueImgUrl,
            bookmarkedStories: [],
            following: [],
            followers: []
        }
        sessionStorageService.saveLocalUser(loggedInUser)
        return loggedInUser
    }
    // we always want to save in session-storage - as it is temporary per session
    sessionStorageService.saveLocalUser(loggedInUser) 
    return null // loggedInUser already existed. no need to return it
}

function _chooseRandomUserList(users, maxAmount) {
    maxAmount = Math.floor(maxAmount)
    const numChosenUsers = Math.floor(Math.random() * maxAmount)
    const chosenUsers = []
    for (let i=0; i<numChosenUsers; i++) {
        chosenUsers.push(_chooseRandomUser(users))
    }
    return Array.from(new Set(chosenUsers)); // make unique using Set (then convert back to Array so it can convert to json)
}

function _chooseRandomUser(users, excludeId='') {
    /*if (excludeId)
        users = users.filter(user => user._id != excludeId)*/
    return userService.getMiniUser(utilService.chooseRandomItemFromList(users));
}


// Story Data

async function _generateInitialStories(users) {
    //let initialStories = utilService.loadFromStorage(STORAGE_KEY_STORIES)
    let initialStories = await storyService.getStories()
    if (!initialStories || !initialStories.length) {
        initialStories = [];
        for (let i = 0; i < 30; i++) 
            initialStories.push(_generateStory(users));
        initialStories.push(_generateStory(users, userService.getMiniLoggedInUser())); // loggedInUser should have at least 1 post
        console.log("_generateInitialStories: ", initialStories)
        //utilService.saveToStorage(STORAGE_KEY_STORIES, initialStories)
        _saveJsonFile(initialStories, "stories-data")
    }
    return initialStories
}

function _generateStory(users, forcedUser) {
    const randDate = utilService.generateRandomTimestamp()
    const timestamp = randDate.getTime()
    const randUrl = `https://picsum.photos/seed/${timestamp}/470/600`
    return {
        //_id: utilService.makeId(ID_LENGTH),
        txt: utilService.makeLorem(20), //utilService.generateText(),
        imgUrl: randUrl, 
        //createdAt: randDate, 
        by: forcedUser || _chooseRandomUser(users),
        likedBy: _chooseRandomUserList(users, users.length*0.75),
        comments: _chooseRandomUserList(users, users.length*0.3).map(miniUser => ({
            _id: utilService.makeId(ID_LENGTH), 
            by: miniUser, 
            txt: utilService.makeLorem(10), 
            likedBy: _chooseRandomUserList(users, users.length*0.5),
            createdAt: utilService.generateRandomTimestampFrom(timestamp) // comment only after post was published
        }))
    } 
}

async function _generateInitialBookmarks(stories) {
    const loggedInUser = sessionStorageService.getLoggedInUser()
    if (!loggedInUser)
        return
    loggedInUser.bookmarkedStories = [..._chooseRandomStoryList(stories, 3)]
    console.log("generate initial bookmarks: ",loggedInUser)
    const savedUser = await userService.save(loggedInUser)
    console.log("initial bookmarks saved: ",savedUser)
    return savedUser
}

function _chooseRandomStoryList(stories, numStoriesToChoose) {
    const chosenStories = new Set()
    const totalStories = stories ? stories.length : 0
    for (let i=0; i<totalStories; i++) {
        chosenStories.add(_chooseRandomStory(stories))
        if (chosenStories.size == numStoriesToChoose) {
            console.log("bookmarks: ",chosenStories)
            break
        }
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


async function signup() {
    return await userActions.signup({"username": "Instush", "password": "1234", "fullname": "Hagit Y.", 
        "imgUrl": "https://picsum.photos/seed/!!==loggedInUser==!!1/470/600"})
}

async function login() {
    await userActions.login({"username": "Instush", "password": "1234"})        
}


function _saveJsonFile(obj, filename){
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(obj, null, 2));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", filename+".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }



  
  /*function saveLocalStorage(dbItemName, fileNamePrefix) {
    const dbItem = localStorage.getItem(dbItemName);
    if (!dbItem) {
        console.log('Item not found in localStorage: ',dbItem);
        return;
    }
    const jsonStr = JSON.stringify(dbItem, null, 2);
    //const blob = new Blob([jsonStr], { type: 'application/json' });
    const blob = new Blob([`[${jsonData}]`], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileNamePrefix+dbItemName);
    link.click();
    URL.revokeObjectURL(url);

  downloadLink.href = URL.createObjectURL(blob);
  downloadLink.download = 'extension_data.json';
  downloadLink.click();
}*/




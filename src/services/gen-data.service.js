import { utilService } from './util.service.js'
import { sessionStorageService } from './session-storage.service.js'
import { userService } from './user.service.js'
import { userActions } from '../store/actions/user.actions.js';
import { storyService } from './story.service.js';

export const genDataService = {
    generateInitialData,
}

const ID_LENGTH = 6; 
//const STORAGE_KEY_STORIES = 'stories_db'
//const STORAGE_KEY_USERS = 'users_db'


/* For mongo-db-server (as opposed to local-storage), we make sure not to generate ID for: story, user and logged-in user,
    Next we import the downloaded files into the Mongo-DB through compass. (originally, data was saved to local-storage).
    The loggedInUser + password will enter the Mongo due to 'signup' */

async function generateInitialData() {
    //await logout()
    //await login()

    //return

    const users = await _generateInitialUsers()
    console.log("generate users: ",users)

    //await _addUserPassword(users)
    //return

    //await _generateInitialFollowingData(users)
    //return
    
    const stories = await _generateInitialStories(users)    
    console.log("generate stories: ",stories)

    //await _generateInitialBookmarks(users, stories)
    //return
    
    //const loggedInUser = await _generateCurrentUserBookmarks(stories)
    //console.log("generate bookmarks: ",loggedInUser)

    //await _generateInitialNotifications(users, stories)
    //return

    return users
}

// User Data 

async function _generateInitialUsers() {
    //let initialUsers = utilService.loadFromStorage(STORAGE_KEY_USERS) || []
    let initialUsers = await userService.getUsers()
    if (!initialUsers || initialUsers.length <= 1) {
        const loggedInUser = await signup()
        console.log("logged-in user: ",loggedInUser)
        initialUsers = []
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
        password: '1234',
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

function _chooseRandomUserList(users, maxAmount, excludeId='') {
    maxAmount = Math.floor(maxAmount)
    const numChosenUsers = Math.floor(Math.random() * maxAmount)
    const chosenUsers = []
    for (let i=0; i<numChosenUsers; i++) {
        chosenUsers.push(_chooseRandomUser(users, excludeId))
    }
    return Array.from(new Set(chosenUsers)); // make unique using Set (then convert back to Array so it can convert to json)
}

function _chooseRandomUser(users, excludeId='') {
    if (excludeId)
        users = users.filter(user => user._id != excludeId)
    return userService.getMiniUser(utilService.chooseRandomItemFromList(users));
}

/*async function _generateInitialJustFollowing(users) {
    if (!users || users.length == 0)
        return 
    users.forEach(async user => {
        const following = _chooseRandomUserList(users, users.length*0.5) 
        user.following = [...following]
        console.log("generate initial following: ",user)
        //const savedUser = await userService.save(user)
        //console.log("initial following data saved: ",savedUser)
    })
}*/

async function _generateInitialFollowingData(users) {
    if (!users || users.length == 0)
        return 
    users.forEach(user => {
        user.following = []
        user.followers = []
    })
    users.forEach(user => {
        user.following = utilService.makeUnique(_chooseRandomUserList(users, users.length*0.6, user._id), "_id")
        if (user.following && user.following.length > 0)
            user.following.forEach(followedUser => {
                users.filter(u => u._id === followedUser._id)[0].followers.push(userService.getMiniUser(user))
            })
    })
    //users.forEach(user => user.followers = utilService.makeUnique(user.followers))
    users = users.map(user => ({...user, password: '$2b$10$HAcMSob5gm9OmwgjpAGteOwEnNx16SxjFK46ri0VI7UDDpRkMDi76'}))
    //console.log("generate initial following: ",users)
    //users.forEach(async user => await userService.save(user))
}

async function _generateInitialNotifications(users, stories) {
    if (!users || users.length === 0 || !stories || stories.length === 0)
        return 
    users.forEach(async user => {
        const notifications = _generateNotificationsPerUser(user, users, stories) 

        //console.log("FOR USER: ", user.username)
        //console.log("notifications: ", notifications)

        user.password = "$2b$10$HAcMSob5gm9OmwgjpAGteOwEnNx16SxjFK46ri0VI7UDDpRkMDi76"
        user.notifications = [...notifications]
        //console.log("generate initial notifications: ",user)
        //const savedUser = await userService.save(user)
        //console.log("initial notifications data saved: ",savedUser)
    })
}

function _generateNotificationsPerUser(currentUser, users, origStories) {
    let notifications = []
    const recentStories = origStories.sort((a,b)=>b.createdAt-a.createdAt);
    users.forEach(user => {
        if (user._id !== currentUser._id && // its not me
            currentUser.following.filter(iFollow => iFollow._id === user._id).length === 0) { // i don't already follow
                if (currentUser.followers.map(follower => follower._id).includes(user._id))
                    notifications.push({ _id: utilService.makeId(ID_LENGTH), 
                        txt: `${user.username} started following you`,
                        about: userService.getMiniUser(user),
                        createdAt: utilService.generateRandomTimestamp()})
                else notifications.push({ _id: utilService.makeId(ID_LENGTH),
                    txt: `${user.username} who you might know is on Instushgram`,
                    about: userService.getMiniUser(user),
                    createdAt: utilService.generateRandomTimestamp()})
            }
    })

    return notifications


    /*const randomUser = utilService.chooseRandomItemFromList(usersIDontFollow.filter(user=> 
        !notifications || notifications.filter(ntf => ntf._id != user._id)))

    if (randomUser.following.length > 0 && randomUser.following.filter(follow => follow._id === currentUser._id).length > 0)
        notifications.push({ _id: randomUser._id, txt: 
            `${randomUser.username} started following you`,
            createdAt: utilService.generateRandomTimestamp()})

    else if (randomUser.following.length > 0 && randomUser.following.filter(follow => currentUser.following.length > 0 && 
        currentUser.following.filter (IFollow => IFollow._id === follow._id).length > 0))
    {
        const theyFollow = randomUser.following.filter(follow => 
            currentUser.following.filter (IFollow => IFollow._id === follow._id))[0].username

        notifications.push({ _id: randomUser._id, txt: 
            `${theyFollow} who you follow, follows ${randomUser.username} start following them`,
            createdAt: utilService.generateRandomTimestamp()})
    }
    else if (currentUser.following.length > 0 && currentUser.following.filter(IFollow => 
        users.filter(user => user.following.length > 0 && user.following.filter(follow => follow._id === randomUser._id).length > 0))) 
    {
        const IFollow = currentUser.following.filter(IFollow => 
            users.filter(user => user.following.filter(follow => follow._id === randomUser._id).length > 0))[0].username
        notifications.push({ _id: randomUser._id, txt: 
            `${randomUser.username} follows ${IFollow} who you follow, start following them`,
            createdAt: utilService.generateRandomTimestamp()})
    }
    else 
        notifications.push({ _id: randomUser._id, txt: 
            `${randomUser.username} who you might know is on Instushgram`,
            createdAt: utilService.generateRandomTimestamp()})*/
}


async function _addUserPassword(users) {
    if (!users || users.length == 0)
        return 
    users.forEach(async user => {
        user = {...user, "password": "$2b$10$HAcMSob5gm9OmwgjpAGteOwEnNx16SxjFK46ri0VI7UDDpRkMDi76"}
        //console.log("addUserPassword: ",user)
        const savedUser = await userService.save(user)
        console.log("addUserPassword: ",savedUser)
    })
}



// Story Data

async function _generateInitialStories(users) {
    if (!users || users.length == 0)
        return []
    //let initialStories = utilService.loadFromStorage(STORAGE_KEY_STORIES)
    let initialStories = await storyService.getStories()
    if (initialStories && initialStories.length > 0) 
        return initialStories
    initialStories = [];
    for (let i = 0; i < 30; i++) 
        initialStories.push(_generateStory(users));
    initialStories.push(_generateStory(users, userService.getMiniLoggedInUser())); // loggedInUser should have at least 1 post
    //utilService.saveToStorage(STORAGE_KEY_STORIES, initialStories)
    _saveJsonFile(initialStories, "stories-data")
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
        createdAt: randDate, 
        by: forcedUser || _chooseRandomUser(users),
        likedBy: _chooseRandomUserList(users, users.length*0.75),
        comments: _chooseRandomUserList(users, users.length*0.5).map(miniUser => ({
            _id: utilService.makeId(ID_LENGTH), 
            by: miniUser, 
            txt: utilService.makeLorem(10), 
            likedBy: _chooseRandomUserList(users, users.length*0.5),
            createdAt: utilService.generateRandomTimestampFrom(timestamp) // comment only after post was published
        }))
    } 
}

async function _generateCurrentUserBookmarks(stories) {
    const miniUser = sessionStorageService.getLoggedInUser()
    let loggedInUser = await userService.getByUsername(miniUser.username);
    if (!loggedInUser)
        return
    if (!stories || stories.length == 0)
        return loggedInUser
    loggedInUser.bookmarkedStories = [..._chooseRandomStoryListExact(stories, 3)]
    console.log("generate initial bookmarks: ",loggedInUser)
    const savedUser = await userService.save(loggedInUser)
    console.log("initial bookmarks saved: ",savedUser)
    return savedUser
}

// Including current user (!)
async function _generateInitialBookmarks(users, stories) {
    if (!users || users.length == 0 || !stories || stories.length == 0)
        return 
    users.forEach(async user => {
        const bookmarked = _chooseRandomStoryList(stories, stories.length*0.14) 
        user.bookmarkedStories = [...bookmarked]
        //console.log("generate initial bookmarks: ",user)
        const savedUser = await userService.save(user)
        console.log("initial following data saved: ",savedUser)
    })
}

function _chooseRandomStoryList(stories, maxAmount) {
    maxAmount = Math.floor(maxAmount)
    const numChosenStories = Math.floor(Math.random() * maxAmount)
    const chosenStories = []
    for (let i=0; i<numChosenStories; i++) {
        chosenStories.push(_chooseRandomStory(stories))
    }
    return Array.from(new Set(chosenStories)); // make unique using Set (then convert back to Array so it can convert to json)
}

/*function _chooseRandomStoryListExact(stories, numStoriesToChoose) {
    const chosenStories = new Set()
    const totalStories = stories ? stories.length : 0
    for (let i=0; i<totalStories; i++) {
        chosenStories.add(_chooseRandomStory(stories))
        if (chosenStories.size >= numStoriesToChoose) {
            //console.log("bookmarks: ",chosenStories)
            break
        }
    }
    return Array.from(chosenStories)    // make unique using Set (then convert back to Array so it can convert to json)
}*/

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
    try {
        return await userActions.signup({"username": "Instush", "password": "1234", "fullname": "Hagit Y.", 
            "imgUrl": "https://picsum.photos/seed/!!==loggedInUser==!!1/470/600"})
    }
    catch(err) {
        console.log("Signup error: ",err)
    }
}

async function testSignup() {
    try {
        return await userActions.signup({"username": "test", "password": "abcd", "fullname": "Thats Me", 
            "imgUrl": "https://picsum.photos/seed/test/470/600"})
    }
    catch(err) {
        console.log("Signup error: ",err)
    }
}

async function login() {
    try {
        await userActions.login({"username": "Instush", "password": "1234"})        
        //await userActions.login({"username": "test", "password": "abcd"})        
    }
    catch(err) {
        console.log("Login error: ",err)
    }
}

async function logout() {
    try {
        await userActions.logout()        
    }
    catch(err) {
        console.log("Logout error: ",err)
    }
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




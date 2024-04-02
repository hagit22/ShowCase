import { utilService } from './util.service.js'
import { sessionStorageService } from './session-storage.service.js'
import { notificationMessages } from './socket.service.js';
import { userService } from './user.service.js'
import { userActions } from '../store/actions/user.actions.js';
import { storyService } from './story.service.js';

export const genDataService = {
    generateInitialData,
    //defaultLogin,
    //logout,
    //defaultSignup,
    //testSignup
    tryLogin
}

const ID_LENGTH = 6; 
//const STORAGE_KEY_STORIES = 'stories_db'
//const STORAGE_KEY_USERS = 'users_db'


async function generateInitialData() {

    return

    let users = await _generateInitialUsers()

    //await _generateInitialFollowingData(users)
    //return
    
    const stories = await _generateInitialStories(users)    

    //await _generateInitialBookmarks(users, stories)
    //return
    
    //await _generateInitialNotifications(users, stories)
    //return

    //await logout()
    //await login()   // back to default current-user
    return users
}

// User Data 

async function _generateInitialUsers() {
    let initialUsers = await userService.getUsers() || null
    console.log("GenData: Got users: ",initialUsers)
    if (initialUsers && initialUsers.length > 1) 
        return initialUsers
    const loggedInUser = await signup()
    console.log("logged-in user: ",loggedInUser)
    for (let i = 0; i < 10; i++) {
        const user = _generateUser()
        initialUsers.push(user)
    }
    console.log("GenData: Created users: ",initialUsers)
    initialUsers = utilService.makeUnique(initialUsers,"username")
    initialUsers.forEach(async user => await userService.save(user))
    return initialUsers
}

function _generateUser() {
    //const userId = utilService.makeId(ID_LENGTH)
    //const userImgUrl = `https://picsum.photos/seed/${userId}/470/600`
    const username = utilService.generateRandomUsername()
    const userImgUrl = `https://i.pravatar.cc/150?u=${username}`
    return {
        //_id: userId,
        username: username, 
        "password": "$2b$10$HAcMSob5gm9OmwgjpAGteOwEnNx16SxjFK46ri0VI7UDDpRkMDi76",
        fullname: utilService.generateRandomFullname(username), 
        imgUrl: userImgUrl,
        bookmarkedStories: [],
        following: [],
        followers: []
    }
}

async function _generateAnotherUser()
{
    await userService.save(_generateUser())
}

function _generateSessionLoggedInUser(initialUsers) {
    //const uniqueURLseed = "!!==loggedInUser==!!"
    const username = "Instush"
    //const uniqueImgUrl = `https://picsum.photos/seed/${uniqueURLseed}1/470/600` 
    const uniqueImgUrl = `https://i.pravatar.cc/150?u=${username}`
    // we want loggedInUser from session-storage to have the same id within the 'initialUsers' list
    let loggedInUser = initialUsers.filter(user=>user.imgUrl === uniqueImgUrl)[0] || undefined
    if (!loggedInUser)  {
        loggedInUser = {
            _id: utilService.makeId(ID_LENGTH),
            username: username,
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

async function _generateInitialFollowingData(users) {
    if (!users || users.length == 0)
        return 
    users.forEach(user => {
        user.following = []
        user.followers = []
    })
    users.forEach(user => {
        user.following = utilService.makeUnique(_chooseRandomUserList(users, users.length*0.8, user._id), "_id")
        if (user.following && user.following.length > 0)
            user.following.forEach(followedUser => {
                users.filter(u => u._id === followedUser._id)[0].followers.push(userService.getMiniUser(user))
            })
    })
    console.log("generate initial following: ",users)
    users.forEach(async user => await userService.save(user))
}

async function _generateInitialNotifications(users, stories) {
    if (!users || users.length === 0 || !stories || stories.length === 0)
        return 
    users.forEach(async user => {
        const notifications = _generateNotificationsPerUser(user, users, stories) 

        //console.log("FOR USER: ", user.username)
        //console.log("notifications: ", notifications)

        user.notifications = [...notifications]
        //console.log("generate initial notifications: ",user)
        const savedUser = await userService.save(user)
    })
    console.log("generate initial notifications: ",users)

}

function _generateNotificationsPerUser(currentUser, users, origStories) {
    let notifications = []
    const recentStories = origStories.sort((a,b)=>b.createdAt-a.createdAt);
    users.forEach(user => {
        if ((currentUser.following.filter(iFollow => iFollow._id === user._id).length > 0) /*&& 
            (origStories.filter(story => story.by._id === user._id) > 0)*/)   // I follow and they have posts
                notifications.push({
                    _id: utilService.makeId(ID_LENGTH), 
                    txt: notificationMessages.storyByFollowing,
                    storyImgUrl: _chooseRandomFullStory(origStories).imgUrl,
                    aboutUser: userService.getMiniUser(user),
                    createdAt: utilService.generateRandomTimestamp()})
        else if (user._id !== currentUser._id && // its not me
            currentUser.following.filter(iFollow => iFollow._id === user._id).length === 0) { // i don't already follow
                if (currentUser.followers.map(follower => follower._id).includes(user._id))
                    notifications.push({
                        _id: utilService.makeId(ID_LENGTH), 
                        txt: notificationMessages.newFollower,
                        storyImgUrl: null,
                        aboutUser: userService.getMiniUser(user),
                        createdAt: utilService.generateRandomTimestamp()})
                else notifications.push({
                    _id: utilService.makeId(ID_LENGTH),
                    txt: notificationMessages.newUser,
                    storyImgUrl: null,
                    aboutUser: userService.getMiniUser(user),
                    createdAt: utilService.generateRandomTimestamp()})
        }
    })
    //console.log(notifications)
    return notifications
}


async function _addUserPassword(users) {
    if (!users || users.length == 0)
        return 
    users.forEach(async user => {
        user = {...user, "password": "$2b$10$HAcMSob5gm9OmwgjpAGteOwEnNx16SxjFK46ri0VI7UDDpRkMDi76"}
        //console.log("addUserPassword: ",user)
        //const savedUser = await userService.save(user)
        console.log("addUserPassword: ",savedUser)
    })
}



// Story Data

async function _generateInitialStories(users) {
    if (!users || users.length == 0)
        return []
    let initialStories = await storyService.getStories() || null
    console.log("GenData: Got stories: ",initialStories)
    if (initialStories && initialStories.length > 0) 
        return initialStories
    for (let i = 0; i < 30; i++) {
        const story = _generateStory(users, i)
        initialStories.push(story)
    }
    console.log("GenData: Created stories: ",initialStories)
    //initialStories = utilService.makeUnique(initialStories,"imgUrl")
    initialStories.forEach(async story => {
        await userService.logout()
        await userService.login({"username": story.by.username, "password": "1234"})
        await storyService.save(story)
    })
    return initialStories
}

function _generateStory(users, index) {
    const randDate = utilService.generateRandomTimestamp()
    const timestamp = randDate.getTime()
    //const randUrl = `https://picsum.photos/seed/${timestamp}/470/600`
    const randUrl = `https://picsum.photos/seed/${timestamp}/585/468`
    //const randUrl = `https://picsum.photos/seed/${timestamp}/400/500`
    //const randUrl = `https://source.unsplash.com/random/585x468?colorful nature ${index}`
    //const randUrl = `https://source.unsplash.com/468x585?colorful nature high res ${index}`
    //const randUrl = `https://source.unsplash.com/random/468x585?colorful nature high res`
    return {
        txt: utilService.makeLorem(20), //utilService.generateText(),
        imgUrl: randUrl, 
        createdAt: randDate, 
        by: _chooseRandomUser(users),
        likedBy: _chooseRandomUserList(users, users.length*0.75),
        comments: _chooseRandomUserList(users, users.length*0.9).map(miniUser => ({
            _id: utilService.makeId(ID_LENGTH), 
            by: miniUser, 
            txt: utilService.makeLorem(10), 
            likedBy: _chooseRandomUserList(users, users.length*0.6),
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
    //const savedUser = await userService.save(loggedInUser)
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
        //console.log("initial bookmarks data saved: ",savedUser)
    })
    console.log("initial bookmarks generated: ",users)
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
    return storyService.getMiniStory(utilService.chooseRandomItemFromList(stories));
}

function _chooseRandomFullStory(stories) {
    return utilService.chooseRandomItemFromList(stories);
}


async function defaultSignup() {
    try {
        return await userActions.signup({"username": "Instush", "password": "1234", "fullname": "Hagit Y.", 
            //"imgUrl": "https://picsum.photos/seed/!!==loggedInUser==!!1/470/600"})
            "imgUrl": `https://i.pravatar.cc/150?u=Instush`})
    }
    catch(err) {
        console.log("Signup error: ",err)
    }
}

async function testSignup() {
    try {
        return await userActions.signup({"username": "test", "password": "abcd", "fullname": "Thats Me", 
            //"imgUrl": "https://picsum.photos/seed/test/470/600"})
            "imgUrl": `https://i.pravatar.cc/150?u=test`})
    }
    catch(err) {
        console.log("Signup error: ",err)
    }
}

/*async function jennySignup() {
    try {
        console.log("Jenny Signup")
        const user = await userActions.signup({"username": "jenny", "password": "1234", "fullname": "Jenny Jenkins", 
            //"imgUrl": "https://picsum.photos/seed/jenny/470/600"})
            "imgUrl": `https://i.pravatar.cc/150?u=jenny`})
        console.log("Signup:, ", user)
    }
    catch(err) {
        console.log("Signup error: ",err)
    }
}*/

async function tryLogin() {
    try {
        const loggedInUser = sessionStorageService.getLoggedInUser()
        if (loggedInUser) {
            console.log("tryLogin: loggedInUser user is: ",loggedInUser)
            return
        }
        console.log("tryLogin: No logged-in user -> Going to Default-Login...")
        await logout()
        await defaultLogin()  
        console.log("tryLogin: Logged-in with Default")
    }
    catch(err) {
        console.log("tryLogin error: ",err)
        await logout()
        await defaultLogin()
        console.log("tryLogin: Logged-in with Default")
    }
}

async function defaultLogin() {
    try {
        const loggedInUser = await userActions.login({"username": "Instush", "password": "1234"})      
        return loggedInUser  
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




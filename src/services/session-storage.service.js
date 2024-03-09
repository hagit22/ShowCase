export const sessionStorageService = {
    saveLocalUser,
    removeLocalUser,
    getLoggedInUser
}

const STORAGE_KEY_LOGGED_IN_USER = 'loggedInUser'


function saveLocalUser(user) {
    user = { 
        _id: user._id, 
        username: user.username, 
        imgUrl: user.imgUrl || "https://www.gravatar.com/avatar/?d=identicon",
    }
    sessionStorage.setItem(STORAGE_KEY_LOGGED_IN_USER, JSON.stringify(user))
    return user
}

function removeLocalUser() {
    sessionStorage.removeItem(STORAGE_KEY_LOGGED_IN_USER)
}

function getLoggedInUser() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGED_IN_USER))
}







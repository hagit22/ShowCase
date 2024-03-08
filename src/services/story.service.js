import { utilService } from './util.service.js'
import { userService } from './user.service.js';
import { storyServiceRemote } from './story.service.remote.js'

export const storyService = {
    getStories: storyServiceRemote.getStories,
    getById: storyServiceRemote.getById,
    remove: storyServiceRemote.remove,
    save: storyServiceRemote.save,
    createNewStory,
    createNewComment
}

const STORY_ID_LENGTH = 6; 

function createNewStory(storyUrl, storyText) {
    return {
        txt: storyText,
        imgUrl: storyUrl, 
        createdAt: Date.now(), 
        likedBy: [],
        comments: []
    }
}

function createNewComment(commentText) {
    return {
        _id: utilService.makeId(STORY_ID_LENGTH),
        txt: commentText,
        by: userService.getMiniLoggedInUser(),
        likedBy: [],
        createdAt: Date.now(), 
    }
}




import Axios from 'axios'
import { BASE_URL } from './route-base.js'

export const storyServiceRemote = {
    getStories,
    getById,
    remove,
    save
}

var axios = Axios.create({
    withCredentials: true,
})

const BASE_URL_STORY = BASE_URL + 'story/'


async function getStories(filterBy = {}, sortObj = {}) {
    try {
        var { data: stories } = await axios.get(BASE_URL_STORY, {params : {...filterBy, ...sortObj}})
        return stories
    }
    catch (err) {
        throw err.response.data // example of where axios puts the error-message which came from our server
    }
}

async function getById(storyId) {
    try {
        const url = BASE_URL_STORY + storyId
        var { data: story } = await axios.get(url)
        return story
    }
    catch (err) {
        throw err.response.data 
    }
}

async function remove(storyId) {
    try {
        const url = BASE_URL_STORY + storyId
        var { data: res } = await axios.delete(url)
        return res
    }
    catch (err) {
        throw err.response.data 
    }
}

async function save(story) {
    try {
        const method = story._id ? 'put' : 'post'
        const url = BASE_URL_STORY 
        const { data: savedStory } = await axios[method](url, story)
        return savedStory
    }
    catch (err) {
        throw err.response.data 
    }
}


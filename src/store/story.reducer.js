export const storyActionTypes = {
    SET_STORIES: 'SET_STORIES',
    UPDATE_STORY: 'UPDATE_STORY',
    REMOVE_STORY: 'REMOVE_STORY',
    UNDO_REMOVE_STORY: 'UNDO_REMOVE_STORY'
}

const initialState = {
    stories: [],
    lastRemovedStory: null
}

export function storyReducer(state = initialState, action) {
    let newState = state
    let stories
    let lastRemovedStory
    switch (action.type) {
        case storyActionTypes.SET_STORIES:
            newState = { ...state, stories: action.stories }
            break
        case storyActionTypes.ADD_STORY:
            newState = { ...state, stories: [...state.stories, action.story] }
            break
        case storyActionTypes.UPDATE_STORY:
            stories = state.stories.map(story => (story._id === action.story._id) ? action.story : story)
            newState = { ...state, stories }
            break
        case storyActionTypes.REMOVE_STORY:
            lastRemovedStory = state.stories.find(story => story._id === action.storyId)
            stories = state.stories.filter(story => story._id !== action.storyId)
            newState = { ...state, stories, lastRemovedStory }
            break
        case storyActionTypes.UNDO_REMOVE_STORY:
            if (state.lastRemovedStory) {
                newState = { ...state, stories: [...state.stories, state.lastRemovedStory], lastRemovedStory: null }
            }
            break
        default:
    }
    return newState
}

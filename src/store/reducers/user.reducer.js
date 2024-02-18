import { userService } from '../../../src/services/user.service.js'

export const userActionTypes = {
    INCREMENT: 'INCREMENT',
    DECREMENT: 'DECREMENT',
    CHANGE_COUNT: 'CHANGE_COUNT',
    SET_USER: 'SET_USER',
    SET_WATCHED_USER: 'SET_WATCHED_USER',
    REMOVE_USER: 'REMOVE_USER',
    SET_USERS: 'SET_USERS',
    SET_SCORE: 'SET_SCORE',
    UPDATE_USER: 'UPDATE_USER'
}

const initialState = {
    count: 10,
    user: userService.getLoggedInUser(),
    users: [],
    watchedUser : null
}

export function userReducer(state = initialState, action) {
    var newState = state
    switch (action.type) {
        case userActionTypes.INCREMENT:
            newState = { ...state, count: state.count + 1 }
            break
        case userActionTypes.DECREMENT:
            newState = { ...state, count: state.count - 1 }
            break
        case userActionTypes.CHANGE_COUNT:
            newState = { ...state, count: state.count + action.diff }
            break
        case userActionTypes.SET_USER:
            newState = { ...state, user: action.user }
            break
        case userActionTypes.SET_WATCHED_USER:
            newState = { ...state, watchedUser: action.user }
            break
        case userActionTypes.REMOVE_USER:
            newState = {
                ...state,
                users: state.users.filter(user => user._id !== action.userId)
            }
            break
        case userActionTypes.SET_USERS:
            newState = { ...state, users: action.users }
            break
        case userActionTypes.SET_SCORE:
            newState = { ...state, user: { ...state.user, score: action.score } }
            break
        default:
    }
    // For debug:
    // window.userState = newState
    // console.log('State:', newState)
    return newState

}

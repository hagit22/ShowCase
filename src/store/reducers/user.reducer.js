import { userService } from '../../../src/services/user.service.js'

export const userActionTypes = {
    INCREMENT: 'INCREMENT',
    DECREMENT: 'DECREMENT',
    CHANGE_COUNT: 'CHANGE_COUNT',
    SET_SCORE: 'SET_SCORE',
    SET_USER_LIST: 'SET_USER_LIST',
    REMOVE_USER: 'REMOVE_USER',
    SET_CURRENT_USER: 'SET_CURRENT_USER',
    SET_ANY_USER: 'SET_ANY_USER',
}

const initialState = {
    count: 10,
    userList: [],
    currentUser: userService.getLoggedInUser(),
    anyUser : null
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
        case userActionTypes.SET_SCORE:
            newState = { ...state, user: { ...state.user, score: action.score } }
            break
        case userActionTypes.SET_USER_LIST:
            newState = { ...state, userList: action.userList }
            break
        case userActionTypes.REMOVE_USER:
            newState = { ...state, userList: state.user.filter(user => user._id !== action.userId) }
            break
        case userActionTypes.SET_CURRENT_USER:
            newState = { ...state, currentUser: action.currentUser }
            break
        case userActionTypes.SET_ANY_USER:
            newState = { ...state, anyUser: action.anyUser }
            break
        default:
    }
    // For debug:
    // window.userState = newState
    // console.log('State:', newState)
    return newState

}

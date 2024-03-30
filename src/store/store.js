import { createStore, combineReducers } from 'redux'

import { storyReducer } from './reducers/story.reducer.js'
import { userReducer } from './reducers/user.reducer.js'
import { systemReducer } from './reducers/system.reducer'
import { appReducer } from './reducers/app.reducer'

const rootReducer = combineReducers({
    storyModule: storyReducer,
    userModule: userReducer,
    systemModule: systemReducer,
    appModule: appReducer
})


const middleware = (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__() : undefined
export const store = createStore(rootReducer, middleware)


store.subscribe(() => {
    //console.log('**** Store state changed: ****')
    //console.log('storeState:\n', store.getState())
    //console.log('*******************************')
})




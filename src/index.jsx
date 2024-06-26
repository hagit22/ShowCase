import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter as Router } from 'react-router-dom'
//import { BrowserRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux'
import * as serviceWorkerRegistration from './serviceWorkerRegistration'
import { store } from './store/store'
import { genDataService } from './services/gen-data.service'
import { RootCmp } from './RootCmp'
import './assets/styles/main.scss'
//import './fonts/Segoe/Segoe-UI-Plain-verylight.ttf';
//import './fonts/Segoe/Segoe-UI-Plain-light.ttf';
//import './fonts/Segoe/Segoe-UI-Semibold-medium.ttf';
//import './fonts/Segoe/Segoe-UI-Semibold-normal.ttf';


//await genDataService.generateInitialData()
//await genDataService.testSignup()
//await genDataService.logout()
//await genDataService.login()
genDataService.tryLogin()

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <Provider store={store}>
    <Router>
      <RootCmp />
    </Router>
  </Provider>
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register()

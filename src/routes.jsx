import { sessionStorageService } from './services/session-storage.service.js'
import { HomePage } from './pages/HomePage.jsx'
import { AboutUs } from './pages/AboutUs.jsx'
import { StoryIndex } from './pages/StoryIndex.jsx'
import { ReviewIndex } from './pages/ReviewIndex.jsx'
import { ChatApp } from './pages/Chat.jsx'
import { AdminApp } from './pages/AdminIndex.jsx'
import { HouseDoor, Search, Chat, Heart, PlusSquare, Circle } from 'react-bootstrap-icons';
import { HouseDoorFill, SearchHeartFill, ChatFill, HeartFill, PlusSquareFill, CircleFill } from 'react-bootstrap-icons';

const loggedInUser = sessionStorageService.getLoggedInUser()
const loggedInUserName = !loggedInUser ? '' : loggedInUser.username || ''
const imgUrl = !loggedInUser ? '' : loggedInUser.imgUrl || ''

const routes = [
    {
        path: '/',
        component: <StoryIndex/>,
        label: "home",
        icons: {empty: HouseDoor, full: HouseDoorFill}
    },
    {
        path: '/',
        component: <StoryIndex />,
        label: "search",
        icons: {empty: Search, full: SearchHeartFill}
    },
    {
        path: '/',
        component: <StoryIndex />,
        label: "notifications",
        icons: {empty: Heart, full: HeartFill}
    },
    {
        path: '/',
        component: <StoryIndex />,
        label: "messages",
        icons: {empty: Chat, full: ChatFill}
    },
    {
        path: '/',
        component: null,
        label: "create",
        //icons: {empty: PlusSquare, full: PlusSquareFill}
        icons: {empty: PlusSquare, full: PlusSquare} // according to Instagram navigation (no fill for 'create')
    },
    {
        path: '/'+loggedInUserName,
        component: <StoryIndex />,
        label: "profile",
        icons: {empty: Circle, full: CircleFill, image: imgUrl},
    }
]

export default routes
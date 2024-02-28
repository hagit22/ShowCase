import { userService } from './services/user.service.js'
import { HomePage } from './pages/HomePage.jsx'
import { AboutUs } from './pages/AboutUs.jsx'
import { StoryIndex } from './pages/StoryIndex.jsx'
import { ReviewIndex } from './pages/ReviewIndex.jsx'
import { ChatApp } from './pages/Chat.jsx'
import { AdminApp } from './pages/AdminIndex.jsx'
import { HouseDoor, Search, Chat, Heart, PlusSquare, Circle } from 'react-bootstrap-icons';
import { HouseDoorFill, ChatFill, HeartFill, PlusSquareFill, CircleFill } from 'react-bootstrap-icons';

const loggedInUser = userService.getLoggedInUser()

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
        icons: {empty: Search, full: Search}
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
        icons: {empty: PlusSquare, full: PlusSquareFill}
    },
    {
        path: '/'+loggedInUser.username,
        component: <StoryIndex />,
        label: "profile",
        icons: {empty: Circle, full: CircleFill, image: loggedInUser.imgUrl},
    }
]

export default routes
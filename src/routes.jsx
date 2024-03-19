import { sessionStorageService } from './services/session-storage.service.js'
import { StoryIndex } from './pages/StoryIndex.jsx'
import { NotificationsPane } from './cmps/NotificationsPane.jsx';
import { Circle } from 'react-bootstrap-icons';
import { SVG_NavBarHome, SVG_NavBarSearch, SVG_NavBarMessage, SVG_NavBarNotify, SVG_NavBarCreate } from './services/svg.service.jsx'
import { SVG_NavBarHomeSelect, SVG_NavBarSearchSelect, SVG_NavBarMessageSelect, SVG_NavBarNotifySelect } from './services/svg.service.jsx'


const loggedInUser = sessionStorageService.getLoggedInUser()
const loggedInUserName = !loggedInUser ? '' : loggedInUser.username || ''
const imgUrl = !loggedInUser ? '' : loggedInUser.imgUrl || ''

const routes = [
    {
        path: '/',
        component: <StoryIndex/>,
        label: "home",
        icons: {empty: SVG_NavBarHome, full: SVG_NavBarHomeSelect}
    },
    {
        path: '/',
        component: <StoryIndex />,
        label: "search",
        icons: {empty: SVG_NavBarSearch, full: SVG_NavBarSearchSelect}
    },
    {
        path: '/',
        component: <StoryIndex />,
        label: "messages",
        icons: {empty: SVG_NavBarMessage, full: SVG_NavBarMessageSelect}
    },
    {
        path: '/',
        component: <NotificationsPane />,
        label: "notifications",
        icons: {empty: SVG_NavBarNotify, full: SVG_NavBarNotifySelect}
    },
    {
        path: '/',
        component: null,
        label: "create",
        icons: {empty: SVG_NavBarCreate, full: SVG_NavBarCreate} // according to Instagram navigation (no fill for 'create')
    },
    {
        path: '/'+loggedInUserName,
        component: <StoryIndex />,
        label: "profile",
        icons: {empty: Circle, full: Circle, image: imgUrl},
    }
]

export default routes
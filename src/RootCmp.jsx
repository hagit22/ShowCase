import React from 'react'
import { Routes, Route } from 'react-router'
import routes from './routes'
import { genDataService } from './services/gen-data.service'
import { AppHeader } from './cmps/AppHeader'
import { AppFooter } from './cmps/AppFooter'
import { DynamicModal } from './cmps/DynamicModal';
import { StoryIndex } from './pages/StoryIndex'

export function RootCmp() {

    //genDataService.generateInitialData()
    /* For mongo-db-server (as opposed to local-storage), we will make sure not to generate ID for: story, user and logged-in user,
        and also not to generate createdAt for story. Next we will comment-in the functions that download the generated data, 
        and we will import the downloaded files into the Mongo-DB through compass. (by default data is saved to local-storage) */
        

    const routeElements = routes.filter(route => route.component != null)

    return (
        <div>
            {/*<AppHeader />*/}
            <main>
                <Routes>
                    {/*{routeElements.map(route => <Route key={route.path} exact={true} element={route.component} path={route.path} />)}*/}
                    <Route path="/" element={<StoryIndex/>} />
                    <Route path="/:username" element={<StoryIndex/>} />
                </Routes>
            </main>
            <DynamicModal />
            {/*<AppFooter />*/}
        </div>
    )
}






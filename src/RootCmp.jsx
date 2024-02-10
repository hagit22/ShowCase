import React from 'react'
import { Routes, Route } from 'react-router'
import routes from './routes'
import { AppHeader } from './cmps/AppHeader'
import { AppFooter } from './cmps/AppFooter'
import { DynamicModal } from './cmps/DynamicModal';
import { StoryIndex } from './pages/StoryIndex'
import { UserDetails } from './pages/UserDetails'

export function RootCmp() {

    const routableRoutes = routes.filter(route => route.component != null)

    return (
        <div>
            {/*<AppHeader />*/}
            <main>
                <Routes>
                    {/*{routableRoutes.map(route => <Route key={route.path} exact={true} element={route.component} path={route.path} />)}*/}
                    <Route path="/" element={<StoryIndex/>} />
                    <Route path="/:username" element={<StoryIndex/>} />
                </Routes>
            </main>
            <DynamicModal />
            {/*<AppFooter />*/}
        </div>
    )
}



import React from 'react'
import { Routes, Route } from 'react-router'
import routes from './routes'
import { DynamicModal } from './cmps/DynamicModal';
import { StoryIndex } from './pages/StoryIndex'

export function RootCmp() {

    const routeElements = routes.filter(route => route.component != null)

    return (
        <div>
            <main>
                <Routes>
                    {/*{routeElements.map(route => <Route key={route.path} exact={true} element={route.component} path={route.path} />)}*/}
                    <Route path="/" element={<StoryIndex navSelection={"home"}/>} />
                    <Route path="/:username" element={<StoryIndex navSelection={"profile"}/>} />
                </Routes>
            </main>
            <DynamicModal />
        </div>
    )
}






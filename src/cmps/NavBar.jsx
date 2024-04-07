/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import routes from '../routes'
import { utilService } from '../services/util.service'
import { onToggleModal } from '../store/actions/app.actions'
import { NavBarItem } from './NavBarItem'
import { CreateStoryImage } from './CreateStoryImage'
import { SVG_NavBarLogo, SVG_NavBarLogoMini, SVG_NavBarLogoPanel, SVG_NavBarLogoMiniPanel } from '../services/svg.service.jsx'

// Temporary for Demo
import { genDataService } from '../services/gen-data.service'

export function NavBar({initialSelection, onSelect, onAddStory, onShowNotifications}) {

    const [currentNavOption, setCurrentNavOption] = useState(initialSelection)
    const [showNotifications, setShowNotifications] = useState(false)
    const [showCreate, setShowCreate] = useState(false)


    useEffect(() => {
        setCurrentNavOption(initialSelection)
    }, [initialSelection])

    useEffect(() => {
        onSelect(currentNavOption)
        if (currentNavOption === '') {
            // reset previous values to start
            setShowNotifications(false)
            setShowCreate(false)
        }
    }, [currentNavOption])

    useEffect(() => {
        onShowNotifications(showNotifications)
    }, [showNotifications])

    useEffect(() => {
        if (showCreate)
            onToggleModal({ cmp: CreateStoryImage, props: { onAddStory } })
        else
            onToggleModal()
    }, [showCreate])

    function onClickItem({target}) {
        let { id } = target;
        // Besides for home & profile, un-mark option upon consecutive click
        setCurrentNavOption(prev=> id === 'home' || id === 'profile' ? id : prev===id ? '' : id)
        if (id === "notifications") 
            setShowNotifications(prev => prev === true ? false : true)
        else
            setShowNotifications(false)
        if (id === "create")
            setShowCreate(prev => prev === true ? false : true)
        else
            setShowCreate(false)   
        //if (id === "messages")
            //Can do here something for testing
    }


    // align and capitalize nav labels
    const navTexts = utilService.alignTexts(routes.map(route => utilService.capitalizeWord(route.label)), 10)

    return (
        <section className="nav-bar-section">
            <div className="nav-bar-content">
                <NavLink to={'/'}>
                    {currentNavOption === "notifications" ? // Need to surround either SVG with div with onClick for marking home-svg as current!
                        <><SVG_NavBarLogoPanel/><SVG_NavBarLogoMiniPanel/></> :
                        <><SVG_NavBarLogo/><SVG_NavBarLogoMini/></>}
                </NavLink>
                <div className="nav-bar-list"> 
                    {routes.map((route, index) =>  
                        <div key={route.label}> 
                            {route.label === "home" || route.label === "profile" ?    // routable pages
                                <NavLink to={route.path}>
                                    <NavBarItem text={navTexts[index]} icons={route.icons} itemId={route.label}
                                        onClickItem={onClickItem} currentSelection={currentNavOption}/> 
                                </NavLink> :
                                <a>
                                    <NavBarItem text={navTexts[index]} icons={route.icons} itemId={route.label}
                                        onClickItem={onClickItem} currentSelection={currentNavOption}/>
                                </a> 
                            }
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}





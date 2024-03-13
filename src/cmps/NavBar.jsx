/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import routes from '../routes'
import { utilService } from '../services/util.service'
import { onToggleModal } from '../store/actions/app.actions'
import { CreateStoryImage } from './CreateStoryImage'
import { NavBarItem } from './NavBarItem'
import { SVG_NavBarLogo, SVG_NavBarLogoMini } from '../services/svg.service.jsx'


export function NavBar({onAddStory, selectionIsDefault, selectionIsUser}) {

    const [currentNavOption, setCurrentNavOption] = useState('')

    useEffect(() => {
        const currentSelection = selectionIsDefault ? routes[0].label : selectionIsUser ? routes[routes.length-1].label : ""
        setCurrentNavOption(currentSelection)
    }, [selectionIsDefault, selectionIsUser])

    function onClickItem({target}) {
        let { id } = target;
        setCurrentNavOption(id);
        if (id == "create") {
            onToggleModal({ cmp: CreateStoryImage, props: { onAddStory } })
        }
    }

    // align and capitalize nav labels
    const navTexts = utilService.alignTexts(routes.map(route => utilService.capitalizeWord(route.label)), 10)

    return (
        <section className="nav-bar-section">
            <div className="nav-bar-content">
                <SVG_NavBarLogo/>
                <SVG_NavBarLogoMini/>
                <div className="nav-bar-list"> 
                    {routes.map((route, index) =>  
                        <div key={route.label}> 
                            {route.label != "create" ?
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





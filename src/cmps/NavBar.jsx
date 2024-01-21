/* eslint-disable react/prop-types */
import { utilService } from '../services/util.service'
import { NavBarItem } from './NavBarItem'
import { Home } from 'react-bootstrap-icons';
import { Search } from 'react-bootstrap-icons';
import { Message } from 'react-bootstrap-icons';
import { Notification } from 'react-bootstrap-icons';
import { Create } from 'react-bootstrap-icons';
import { Profile } from 'react-bootstrap-icons';


export function NavBar({selectedOption, onSelectNavOption, navOptions}) {

    let currentNavOption = selectedOption;

    function onClickItem({target}) {
        let { id } = target;
        currentNavOption = id
        onSelectNavOption(currentNavOption)
    }

    navOptions = ["Home","Search","Messages","Notifications","Create","Profile"]
    const navIcons = [Home, Search, Message, Notification, Create, Profile]
    const navTexts = utilService.alignTexts(navOptions)

    return (
        <section>
            <div className="nav-bar">
                {
                    navTexts.map( (text, index) => (
                        <NavBarItem key={text} currentId={text} text={text} Icon={navIcons[index]} onClickItem={onClickItem} />
                    ))
                }
           </div>
        </section>
    )
}





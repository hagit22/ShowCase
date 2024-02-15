/* eslint-disable react/prop-types */
import { NavLink } from 'react-router-dom'
import errorImage from "../assets/img/instagram-error.png"

export function InstagramError() {

    return (
        <section className="static-image">
            <NavLink to="/">
                <img src={errorImage}/>
            </NavLink> 
        </section> 
    )     
}
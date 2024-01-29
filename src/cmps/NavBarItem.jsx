/* eslint-disable react/prop-types */

export function NavBarItem({text, icons, itemId, onClickItem, currentSelection}) {

    return (
        <section id={itemId} className="nav-bar-item" onClick={onClickItem}>
            <div id={itemId} >
                <icons.empty size="24" id={itemId}/>
            </div>
            <div id={itemId}>
                {text}
            </div>     
        </section> 
    )     
}

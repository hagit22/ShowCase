/* eslint-disable react/prop-types */

export function NavBarItem({text, icons, itemId, onClickItem, currentSelection}) {

    // id is defined for all tags, so that where-ever user presses, it will choose the current label as the chosen option
    return (
        <section id={itemId} className={`nav-bar-item ${itemId === currentSelection ? "current-selection" : ''}`}
                onClick={onClickItem}>
            <div id={itemId}> 
                { icons.image ? 
                    <img className="nav-bar-icon" src={icons.image} id={itemId} /> :
                    <> 
                        {itemId === currentSelection ?
                            <icons.full id={itemId}/> :
                            <icons.empty id={itemId}/>}   
                    </>
                }
            </div>
            <div className="nav-bar-text" id={itemId}>
                {text}
            </div>     
        </section> 
    )     
}

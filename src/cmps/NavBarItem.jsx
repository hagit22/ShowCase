/* eslint-disable react/prop-types */

export function NavBarItem({text, icons, itemId, onClickItem, currentSelection}) {

    // id is defined for all tags, so that where-ever user presses, it will choose the current label as the chosen option
    return (
        <section id={itemId} className="nav-bar-item" onClick={onClickItem}>
            <div id={itemId} >
                { icons.image ? 
                    <img src={icons.image} id={itemId} className={itemId === currentSelection ? "current-selection" : ''}/> :
                    <> 
                        {itemId === currentSelection ?
                            <icons.full size="24" id={itemId}/> :
                            <icons.empty size="24" id={itemId}/>}   
                    </>
                }
            </div>
            <div className="nav-bar-text" id={itemId}>
                {text}
            </div>     
        </section> 
    )     
}

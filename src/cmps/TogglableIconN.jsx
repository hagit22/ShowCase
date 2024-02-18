/* eslint-disable react/prop-types */

// This way doesn't cause modal to disappear, but like-icon flickers and bookmark does not change, although data is updated correctly

export function TogglableIcon({ EmptyIcon, FullIcon, origin, fillColor="black", entityArray, searchedEntity, keyProperty, onUpdateArray }) {

    function calcPosition() { 
        return entityArray.map(entity => entity[keyProperty]).indexOf(searchedEntity[keyProperty])
    }

    const onToggle= () => { 
        if (calcPosition() < 0) 
            onUpdateArray([entityArray, searchedEntity])
        else 
            onUpdateArray(entityArray.filter(entity => entity[keyProperty] != searchedEntity[keyProperty]))
    }


    return (
        <>
            {calcPosition() < 0 ?
                <EmptyIcon 
                    className={origin == "Details" ? "single-icon-details" : "single-icon-preview"} onClick={onToggle}/> :
                <FullIcon style={{color: fillColor}}
                    className={origin == "Details" ? "single-icon-details" : "single-icon-preview"} onClick={onToggle}/>}
        </>
    )
}

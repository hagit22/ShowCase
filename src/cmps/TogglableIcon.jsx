/* eslint-disable react/prop-types */

export function TogglableIcon({ EmptyIcon, FullIcon, origin, fillColor="black", 
                                parentEntity, arrayName, searchedItem, keyProperty, onUpdateArray }) {

    const onToggle = () => {

        if (calcPosition() < 0) // SearchedItem not found in array, need to add it to array
            onUpdateArray({...parentEntity, [arrayName]: [...parentEntity[arrayName], searchedItem]})

        else // SearchedItem found in array, need to remove it from array
            onUpdateArray({...parentEntity, [arrayName]: 
                parentEntity[arrayName].filter(item => item[keyProperty] != searchedItem[keyProperty])})
    }

    const calcPosition = () => { 
        return !parentEntity || !searchedItem ? -1 :
            parentEntity[arrayName].map(item => item[keyProperty]).indexOf(searchedItem[keyProperty])
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

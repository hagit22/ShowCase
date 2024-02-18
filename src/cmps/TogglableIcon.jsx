/* eslint-disable react/prop-types */
import { useState, useEffect } from "react"

export function TogglableIcon({ EmptyIcon, FullIcon, origin, fillColor="black", entityArray, searchedEntity, keyProperty, onUpdateArray }) {

    const [updatedArray, setUpdatedArray] = useState([...entityArray])

    useEffect(() => {
        onUpdateArray(updatedArray)
    }, [updatedArray.length])

    function calcPosition() { 
        return updatedArray.map(entity => entity[keyProperty]).indexOf(searchedEntity[keyProperty])
    }

    const onToggle= () => { 
        if (calcPosition() < 0) 
            setUpdatedArray(prev => [...prev, searchedEntity])
        else 
            setUpdatedArray(prev => prev.filter(entity => entity[keyProperty] != searchedEntity[keyProperty]))
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

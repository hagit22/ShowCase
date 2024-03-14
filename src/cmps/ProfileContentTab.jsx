/* eslint-disable react/prop-types */

import { Children } from "react";

export function ProfileContentTab({ id, text, IconEmpty, IconFull, selected, onClickTab }) {

    return (
        <div className={`profile-content-tab ${selected===id ? "chosen-tab" : ''}`} onClick={onClickTab} id={id}>
            { selected === id ?
                <IconFull className={"content-tab-icon"} id={id}/> :
                <IconEmpty className={"content-tab-icon"} id={id}/>
            }
            <span className={"content-tab-text"} id={id}>
                {text}
            </span>
        </div>
    )
}

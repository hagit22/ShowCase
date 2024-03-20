/* eslint-disable react/prop-types */

import { Children } from "react";

export function UserDetailsTab({ id, text, Icon, selected, onClickTab }) {

    return (
        <div className={`user-details-tab ${selected===id ? "chosen-tab" : ''}`} onClick={onClickTab} id={id}>
            <span className={"tab-icon"} id={id}>
                <Icon id={id}/>
            </span>
            <span className={"tab-text"} id={id}>
                {text}
            </span>
        </div>
    )
}

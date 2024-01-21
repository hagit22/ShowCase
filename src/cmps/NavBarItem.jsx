/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";

export function NavBarItem({onClickItem, Icon, currentId, folderDisplayName}) {

    return (
        <Link className="text-link" to={`/email/${folder}`}>
            <section id={folder} onClick={onClickItem} 
                className={`side-panel-item ${folder===currentId ? 'panel-item-selected' : ''}`}>
                    <div>
                        <Icon id={folder} className="icon-style1"/>
                    </div>
                    <div id={folder} className="side-panel-item-text">
                        <div>
                            <pre id={folder}> {folderDisplayName} </pre>
                        </div>
                        <div className="side-panel-item-number" id={folder}>
                            {numUnReads > 0 ? numUnReads : <pre> </pre>}
                        </div>
                    </div>
           </section>
        </Link>
    );
}

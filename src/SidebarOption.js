import React from 'react';
import { useHistory } from 'react-router-dom';
import './SidebarOption.css';

function SidebarOption({Icon, title, pathname}) {
    let history = useHistory();

    return (
        <div
            className="sidebarOption"
            onClick={() => history.push(pathname)  }
        >
            {Icon && <Icon className="sidebarOption__icon" />}
            {Icon ?( <h3>
                {title}
            </h3>
            ):
                (
                    <div>
                        <h3 className="sidebarOption__channel">
                            <span className = "sidebarOption__hash">#</span> {title}
                        </h3>
                        <label style={{marginLeft: "35px"}}>
                            <img src="https://i.imgur.com/Ntq77sk.png"/>
                            <img src="https://i.imgur.com/Ntq77sk.png"/>
                            <img src="http://i.imgur.com/cqkTp2t.png"/>
                            <img src="http://i.imgur.com/afj6fxH.png"/>
                            <img src="http://i.imgur.com/afj6fxH.png"/>
                        </label>
                    </div>
                )}
        </div>
    );
}

export default SidebarOption;

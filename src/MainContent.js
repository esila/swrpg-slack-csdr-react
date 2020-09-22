import React from 'react';
import Chat from './Chat';
import Skills from './Skills';
import Weapons from './Weapons';
import Talents from "./Talents";
import StarBorderOutlinedIcon from "@material-ui/core/SvgIcon/SvgIcon";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import './MainContent.css';

function MainContent({ contentSourceNames, isActiveIndex }) {
    const contentName = contentSourceNames[isActiveIndex];
    return (
        <div className="maincontent">
            <div className="maincontent__header">
                <div className="maincontent__headerLeft">
                    <h4 className="maincontent__channelName">
                        <strong>  {`#STARWARS-RPG-${contentName}`}  </strong>
                        <StarBorderOutlinedIcon/>
                    </h4>
                </div>
                <div className="maincontent__headerRight">
                    <p>
                        <InfoOutlinedIcon /> Details
                    </p>
                </div>
            </div>
            {contentName === "chat" && <Chat/>}
            {contentName === "skills" && <Skills/>}
            {contentName === "weapons" && <Weapons/>}
            {contentName === "talents" && <Talents/>}
        </div>
    )
}

export default MainContent;

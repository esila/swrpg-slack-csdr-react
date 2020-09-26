import React from 'react';
import { useLocation } from 'react-router-dom';
import Chat from './Chat';
import Skills from './Skills';
import Weapons from './Weapons';
import Talents from './Talents';
import Visuals from './Visuals';
import StarBorderOutlinedIcon from "@material-ui/core/SvgIcon/SvgIcon";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import './MainContent.css';

function MainContent() {
    const location = useLocation().pathname.split('/')[1];

    const MainComponent = {
        chat: Chat,
        skills: Skills,
        weapons: Weapons,
        talents: Talents,
        visuals: Visuals,
    }[location];

    return (
        <div className="maincontent">
            <div className="maincontent__header">
                <div className="maincontent__headerLeft">
                    <h4 className="maincontent__channelName">
                        <strong>  {`#STARWARS-RPG-${location}`}  </strong>
                        <StarBorderOutlinedIcon/>
                    </h4>
                </div>
                <div className="maincontent__headerMid">
                    <p>Wound Threshold: 0 | 12</p>
                    <p>Strain Threshold: 0 | 15</p>
                </div>
                <div className="maincontent__headerRight">
                    <p>
                        <InfoOutlinedIcon /> Details
                    </p>
                </div>
            </div>
            <MainComponent/>
        </div>
    )
}

export default MainContent;

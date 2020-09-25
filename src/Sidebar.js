import React, { useContext, useState } from 'react';
import './Sidebar.css';
import { AmplifySignOut } from '@aws-amplify/ui-react';
import { UserContext} from "./App";
import SidebarOption from './SidebarOption';
import initStats from './init_stats';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import CreateIcon from '@material-ui/icons/Create';
import AppsIcon from '@material-ui/icons/Apps';
import BuildIcon from '@material-ui/icons/Build'
import ChatBubble from "@material-ui/icons/ChatBubble";

function Sidebar({ contentSourceNames, isActiveIndex, setIsActiveIndex }) {
    const user = useContext(UserContext);

    return (
        <div className="sidebar">
            <div className="sidebar_header">
                <div className="sidebar_info">
                    <h2>Star Wars RPG Slack</h2>
                    <h3>
                        <FiberManualRecordIcon/>
                        {user}
                    </h3>
                </div>
                <CreateIcon/>
            </div>
            <SidebarOption
                Icon={ChatBubble}
                title="Chat"
                index={0}
                setIsActiveIndex={setIsActiveIndex}
            />
            <hr/>
            <SidebarOption
                Icon={BuildIcon}
                title="Skills"
                index={1}
                setIsActiveIndex={setIsActiveIndex}
            />
            <hr/>
            <SidebarOption Icon={AppsIcon} title="Weapons" index={2} setIsActiveIndex={setIsActiveIndex}/>
            <hr/>
            <SidebarOption Icon={AppsIcon} title="Talents & Special Abilities" index={3} setIsActiveIndex={setIsActiveIndex}/>
            <hr/>
            <SidebarOption Icon={AppsIcon} title="Visuals" index={4} setIsActiveIndex={setIsActiveIndex}/>
            <hr/>
            <AmplifySignOut/>
        </div>
    )
}

export default Sidebar;

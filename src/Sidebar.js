import React, { useContext } from 'react';
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

function Sidebar() {
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
            <SidebarOption Icon={ChatBubble} title="Chat" pathname="/chat"/>
            <hr/>
            <SidebarOption Icon={BuildIcon} title="Skills" pathname="/skills" />
            <hr/>
            <SidebarOption Icon={AppsIcon} title="Weapons" pathname="/weapons"/>
            <hr/>
            <SidebarOption Icon={AppsIcon} title="Talents & Special Abilities" pathname="/talents"/>
            <hr/>
            <SidebarOption Icon={AppsIcon} title="Visuals" pathname="/visuals"/>
            <hr/>
            <AmplifySignOut/>
        </div>
    )
}

export default Sidebar;

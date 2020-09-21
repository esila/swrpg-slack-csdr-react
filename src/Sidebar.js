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

function SidebarGroup({ group }) {
    const [isExpanded, setisExpanded] = useState(false);

    return (
        <>
            <div
                onClick={() => {
                    console.log(`isExpanded: ${isExpanded}`);
                    return setisExpanded(!isExpanded);
                }}
            >
                <SidebarOption Icon={BuildIcon} title="Skills" />
            </div>
            {isExpanded &&
                <div className="group__items">
                    {Object.keys(group).map((skill, idx) => (
                        <SidebarOption key={idx} Icon={""} title={group[skill].name}/>)
                    )}
                </div>
            }
        </>
    )
}

function Sidebar() {
    const user = useContext(UserContext);
    const { generalSkills, combatSkills, knowledgeSkills } = initStats;

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
            <SidebarGroup group={generalSkills}/>
            <hr/>
            <SidebarOption Icon={AppsIcon} title="Weapons"/>
            <hr/>
            <SidebarOption Icon={AppsIcon} title="Talents & Special Abilities"/>
            <hr/>
            <AmplifySignOut/>
        </div>
    )
}

export default Sidebar;

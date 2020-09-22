import React from 'react';
import Chat from './Chat';
import Skills from './Skills';
import Weapons from './Weapons';
import Talents from "./Talents";

function MainContent({ contentSourceNames, isActiveIndex }) {
    const contentName = contentSourceNames[isActiveIndex];
    switch (contentName) {
        case "chat": return <Chat/>;
        case "skills": return <Skills/>;
        case "weapons": return <Weapons/>;
        case "talents": return <Talents/>;
        default: return <Chat/>;
    }
}

export default MainContent;

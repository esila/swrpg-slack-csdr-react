import React, { useState, useEffect } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import MainContent from './MainContent';
import Sidebar from './Sidebar';
import './App.css';

const UserContext = React.createContext("");

function InitApp() {
    const contentSourceNames = ["chat", "skills", "weapons", "talents", "visuals"];
    const [user, setUser] = useState("");

    useEffect(() => {
        Auth.currentAuthenticatedUser({
            bypassCache: false
        }).then(user => {
            console.log(`USER: ${user.username}`);
            setUser(user.username);
        });
    }, []);

    return user ? (
        <UserContext.Provider value={user}>
            <div className="App">
                <div className="app__body">
                    <Sidebar contentSourceNames={contentSourceNames} />
                    <Switch>
                        {contentSourceNames.map((name) => {
                            return (
                                <Route path={`/${name}`}>
                                    <MainContent />
                                </Route>
                            )
                        })}
                        <Route>
                            <Redirect to="/chat" />
                        </Route>
                    </Switch>
                </div>
            </div>
        </UserContext.Provider>
    )
        :
        <div></div>

}

const App = withAuthenticator(InitApp);
export {
    UserContext,
    App
}

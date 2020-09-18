import React, { useState, useEffect } from 'react';
import { Auth } from 'aws-amplify';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import Chat from './Chat';
import './App.css';

const UserContext = React.createContext("");

function App() {
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
                    <Chat userContext={UserContext}/>
                    <AmplifySignOut/>
                </div>
            </div>
        </UserContext.Provider>
    )
        :
        <div></div>

}

export default withAuthenticator(App);

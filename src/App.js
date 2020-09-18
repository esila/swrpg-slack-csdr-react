import React, { useState, useEffect } from 'react';
import { Auth } from 'aws-amplify';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import Chat from './Chat';
import './App.css';

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

    return (
        <div className="App">
            <div className="app__body">
                <Chat user={user}/>
            </div>
            <AmplifySignOut/>
        </div>
    );
}

export default withAuthenticator(App);

import React, { useState, useEffect } from 'react';
import { API, Auth } from 'aws-amplify';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { listMessages } from './graphql/queries';
import { createMessage as createMessageMutation } from "./graphql/mutations";
import './App.css';

const initialFormState = { message: "", };

function App() {
    const [user, setUser] = useState("");
    const [messages, setMessages] = useState([]);
    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        fetchMessages();
        Auth.currentAuthenticatedUser({
            bypassCache: false
        }).then(user => {
            console.log(`USER: ${user.username}`);
            setUser(user.username);
            setFormData({...formData, user: user.username});
        });
    }, []);

    async function fetchMessages() {
        const apiData = await API.graphql({ query: listMessages});
        setMessages(apiData.data.listMessages.items);
    }

    async function createMessage() {
        if (!formData.message || !formData.user) return;
        await API.graphql({ query: createMessageMutation, variables: { input: formData } });
        setMessages([ ...messages, formData ]);
        setFormData({...initialFormState, user: user});
    }
    return (
    <div className="App">
        <div>
            {messages.map((message, idx) => (
                <div key={idx}>
                    <p><strong>{message.user}:</strong>  {message.message}</p>
                </div>
            ))}
        </div>
        <form onSubmit={(event) => {
            event.preventDefault();
            //console.log(`${formData.user}: ${formData.message}`);
            createMessage()
        }}>
            <input
                style={{marginTop: "30px", marginBottom: "30px"}}
                onChange={e => setFormData({ ...formData, 'message': e.target.value})}
                placeholder=""
                value={formData.message}
            />
        </form>
      <AmplifySignOut/>
    </div>
    );
}

export default withAuthenticator(App);

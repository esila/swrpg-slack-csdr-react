import React, { useState, useEffect, useRef } from 'react';
import { API, Auth, graphqlOperation } from 'aws-amplify';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { getMessagesByTimestamp } from './graphql/queries';
import { createMessage as createMessageMutation, deleteMessage as deleteMessageMutation } from "./graphql/mutations";
import { onCreateMessage } from "./graphql/subscriptions";
import './App.css';

const initialFormState = { message: "", type: "swrpg" };

function App() {
    const [user, setUser] = useState("");
    const [messages, setMessages] = useState([]);
    const [formData, setFormData] = useState(initialFormState);

    // useRef to update current messages since I can't seem to access state in the async subscribe
    const latestMessages = useRef([]);
    latestMessages.current = messages;

    useEffect(() => {
        fetchMessages();
        subscribeMessages();
        Auth.currentAuthenticatedUser({
            bypassCache: false
        }).then(user => {
            console.log(`USER: ${user.username}`);
            setUser(user.username);
            setFormData({...formData, user: user.username});
        });
    }, []);

    async function fetchMessages() {
        const apiData = await API.graphql(graphqlOperation(getMessagesByTimestamp, {sortDirection: 'ASC', type: 'swrpg'}));
        setMessages(apiData.data.getMessagesByTimestamp.items);
    }

    async function subscribeMessages() {
        await API.graphql(graphqlOperation(onCreateMessage)).subscribe({
            next: subonCreateMessage => {
                //console.log(`subscribed message: ${JSON.stringify(subonCreateMessage.value.data.onCreateMessage)}`);
                setMessages([...latestMessages.current, subonCreateMessage.value.data.onCreateMessage]);
            }
        })
    }

    async function createMessage(timestamp) {
        if (!formData.message || !formData.user || !formData.type) return;
        await API.graphql({ query: createMessageMutation, variables: { input: {...formData, timestamp: timestamp} } });
        // Subscription takes care of rerender
        setFormData({...initialFormState, user: user});
    }

     async function deleteMessage({ id }) {
        await API.graphql({ query: deleteMessageMutation, variables: { input: { id } }});
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
            //console.log(`${formData.user}: ${formData.message}, ${formData.type}`);
            const timestamp = new Date().toISOString();
            createMessage(timestamp);
        }}>
            <input
                style={{marginTop: "30px", marginBottom: "30px"}}
                onChange={e => setFormData({ ...formData, 'message': e.target.value})}
                placeholder=""
                value={formData.message}
            />
        </form>
        <br/>
        <button
            onClick={(event) => {
                event.preventDefault();
                messages.map((msg) => {
                    deleteMessage({id: msg.id});
                    return 0;
                })
            }}
        >
            DELETE ALL
        </button>
      <AmplifySignOut/>
    </div>
    );
}

export default withAuthenticator(App);

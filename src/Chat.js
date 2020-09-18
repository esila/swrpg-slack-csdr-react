import React, { useContext, useState, useEffect, useRef } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { getMessagesByTimestamp } from './graphql/queries';
import { createMessage as createMessageMutation, deleteMessage as deleteMessageMutation } from "./graphql/mutations";
import { onCreateMessage } from "./graphql/subscriptions";
import './Chat.css';
import StarBorderOutlinedIcon from "@material-ui/icons/StarBorderOutlined"
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined"

const initialFormState = { message: "", type: "swrpg" };

function Chat({ userContext }) {
    const user = useContext(userContext);
    const [messages, setMessages] = useState([]);
    const [formData, setFormData] = useState({...initialFormState, user: user});

    // useRef to update current messages since I can't seem to access state in the async subscribe
    const latestMessages = useRef([]);
    latestMessages.current = messages;

    useEffect(() => {
        fetchMessages();
        subscribeMessages();
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
    <div className="chat">
        <div className="chat__header">
            <div className="chat__headerLeft">
                <h4 className="chat__channelName">
                    <strong>  #PLACEHOLDER_TEXT  </strong>
                    <StarBorderOutlinedIcon/>
                </h4>
            </div>
            <div className="chat__headerRight">
                <p>
                    <InfoOutlinedIcon /> Details
                </p>
            </div>
        </div>
        <div className="chat__messages">
            {messages.map((message, idx) => (
                <div key={idx}>
                    <p><strong>{message.user}:</strong>  {message.message}</p>
                </div>
            ))}
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
        </div>
        <div>
            <form onSubmit={(event) => {
                event.preventDefault();
                console.log(`${formData.user}: ${formData.message}, ${formData.type}`);
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
        </div>
    </div>
    );
}

export default Chat;

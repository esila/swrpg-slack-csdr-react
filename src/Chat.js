import React, { useState, useEffect, useRef } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { getMessagesByTimestamp } from './graphql/queries';
import { deleteMessage as deleteMessageMutation } from "./graphql/mutations";
import { onCreateMessage } from "./graphql/subscriptions";
import Message from "./Message"
import MessageInput from "./MessageInput"
import './Chat.css';
import StarBorderOutlinedIcon from "@material-ui/icons/StarBorderOutlined"
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined"

function AutoScroller(props) {
    const scrollerRef = useRef();
    const autoScrollingRef = useRef(true);

    function scrollToBottom() {
        const scroller = scrollerRef.current;
        if (scroller && autoScrollingRef.current === true) {
            scroller.scrollTop = scroller.scrollHeight;
        }
    }

    useEffect(scrollToBottom);

    function handleScroll(event) {
        const scroller = event.target;
        const distanceToBottom = scroller.scrollHeight - (scroller.scrollTop + scroller.offsetHeight);
        autoScrollingRef.current = distanceToBottom < 10
    }

    return <div {...props} onScroll={(e) => handleScroll(e)} ref={scrollerRef} />
}

function Chat() {
    const [messages, setMessages] = useState([]);

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

     async function deleteMessage({ id }) {
        await API.graphql({ query: deleteMessageMutation, variables: { input: { id } }});
    }


    return (
    <div className="chat">
        <div className="chat__header">
            <div className="chat__headerLeft">
                <h4 className="chat__channelName">
                    <strong>  #FFG-STARWARS-RPG  </strong>
                    <StarBorderOutlinedIcon/>
                </h4>
            </div>
            <div className="chat__headerRight">
                <p>
                    <InfoOutlinedIcon /> Details
                </p>
            </div>
        </div>
        <AutoScroller className="chat__messages">
            {messages.map((message, idx) => (
                <Message
                    key={idx}
                    message={message.message}
                    timestamp={message.timestamp}
                    user={message.user}
                    userImage={message.userImage}
                 />
            ))}
        </AutoScroller>
        <MessageInput/>
        <button
            className="chat__delete"
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
    );
}

export default Chat;

import React, { useState, useContext } from 'react'
import { UserContext} from "./App";
import { API } from 'aws-amplify';
import "./MessageInput.css"
import {createMessage as createMessageMutation} from "./graphql/mutations";

const initialFormState = { message: "", type: "swrpg" };

function MessageInput() {
    const user = useContext(UserContext);
    const [formData, setFormData] = useState({...initialFormState, user: user});

    async function createMessage(timestamp) {
        if (!formData.message || !formData.user || !formData.type) return;
        await API.graphql({ query: createMessageMutation, variables: { input: {...formData, timestamp: timestamp} } });
        // Subscription takes care of rerender
        setFormData({...initialFormState, user: user});
    }

    return (
        <div className="chatInput">
            <form>
                <input
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, 'message': e.target.value})}
                    placeholder={`Type here:`}
                />
                <button
                    type="submit"
                    onClick={(event) => {
                        event.preventDefault();
                        console.log(`${formData.user}: ${formData.message}, ${formData.type}`);
                        const timestamp = new Date().toISOString();
                        createMessage(timestamp);
                    }}
                >
                    SEND
                </button>
            </form>

        </div>
    );
}

export default MessageInput;

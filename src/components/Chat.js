import React, {useEffect, useState, useRef, Fragment} from 'react';
import axios from 'axios';
import Pusher from 'pusher-js';
import './Chat.css'

export default function Chat(props) {
    const [chatBox,setChatBox] = useState([]);
    const [msg,setMsg] = useState({});
    const [type, setType] = useState('Shout');
    const [chat, setChat] = useState("chat-off");
    const [help, setHelp] = useState("help-off");
    const chatBoxEnd = useRef(null);

    useEffect(() => {
        const newChatBox = [...chat, msg]
        setChatBox(newChatBox);
    },[chat, msg])

    useEffect(() => {
        if(props.uuid) {
            const pusher = new Pusher(process.env.REACT_APP_PUSHER_APP_KEY, {
                cluster: process.env.REACT_APP_PUSHER_CLUSTER,
                encrypted: true
            });
            const channel = pusher.subscribe(`p-channel-${props.uuid}`);
            channel.bind('broadcast', data => {
                
                if(Object.keys(data).length > 1) {
                    //joined lobby
                    if(data.joining) {
                        props.incrementNumPlayers();
                        //console.log(data.message)
                        //setMsg(data.message);
                    }
                    //start game
                    else if (data.init && !props.history.location.pathname.includes("game")) {
                        props.startGame();
                    }
                    //end game
                    else if (data.ending !== undefined) {
                        //props.gameEnded(data.message);
                    }
                } else {
                    setMsg(data);
                    scrollToBottom();
                }
            });
        }
    },[props, props.uuid])

    const chatHandler = (event) => {
        event.preventDefault();
        const message = event.target.message.value;
        const type = event.target.type.value;
        const token = localStorage.getItem('token');
                
        axios
        .post(`${process.env.REACT_APP_SERVER}/api/adv/${type}/`, {message}, { headers: { Authorization: `Token ${token}` } })
        .then()
        .catch(error => {
            console.log(error.message)
        })

        //Update chat box
        const newChatBox = [...chatBox, { message: `${props.user.username}: ` + message }]
        setChatBox(newChatBox);
        scrollToBottom();
    
    }
    
    const typeHandler = (event) => {
        const type = event.target.value
        setType(type.charAt(0).toUpperCase() + type.slice(1))
    }

    const scrollToBottom = () => {
        if (chatBoxEnd.current) {
            chatBoxEnd.current.scrollIntoView({ behavior: "smooth" });
        }
    }

    const chatToggleHandler = () => {        
        if (chat === 'chat-off') {
            setChat('chat-on')
        } else {
            setChat('chat-off')
        }
    }

    const helpToggleHandler = () => {
        if (help === 'help-off') {
            setHelp('help-on')
        } else {
            setHelp('help-off')
        }
    }

    return (
        <Fragment>
            <div className={chat}>
                <div className="chat-box">
                    {chatBox.map((mess,i)=><div key={i}>{mess.message}</div>)}
                    {props.moveResponse && props.moveResponse.players && props.moveResponse.players.length > 0 && <span>{props.moveResponse.players.map((p,i) => <span key={i}>{p} is already here!</span>)}</span>}
                    <br/>
                    <div style={{ float: "left", clear: "both" }}
                        ref={chatBoxEnd}>
                    </div>
                </div>
                <form className="chat-form" onSubmit={chatHandler}>
                    <input id="message" type="text"/>
                    <select id="type" onChange={typeHandler}>
                        <option value="shout">Shout</option>
                        <option value="say">Say</option>
                    </select><br/>
                    <button type="submit">{type}</button>
                </form>
            </div>
            <div className={help}>
                <h1>Directions:</h1> <br/>
                <h3 className="directions">
                    1. You are inside a maze, so try to escape from it!
                </h3>
                <h3 className="directions">
                    2. There may be doors you can exit through to your North, South, East, or West!
                </h3>
                <h3 className="directions desktop">
                    3. Move with your arrow keys, or user the W, A, S or D keys
                </h3>
                <h3 className="directions mobile">
                    3. Move by dragging your finger in the direction you want to go
                </h3>
                <h3 className="directions mobile">
                    4. If you want to stop or change directions, then lift your finger off the screen
                    and drag in a new direction
                </h3>
            </div>
            <div className="chat-buttons">
                {
                    help === 'help-off' &&
                    <button className="chat-button" onClick={chatToggleHandler}>
                        {chat === 'chat-off' ? 'Chat' : 'Close Chat'}
                    </button>
                }
                {
                    chat === 'chat-off' &&
                    <button className="help-button" onClick={helpToggleHandler} >
                        {help === 'help-off' ? 'Help' : 'Close Help'}
                    </button>
                }
            </div>
        </Fragment>
    )
}

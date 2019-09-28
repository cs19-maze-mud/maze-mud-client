import React, {useEffect, useState, useRef} from 'react';
import axios from 'axios';
import Pusher from 'pusher-js';
import './Chat.css'

export default function Chat(props) {
    const [chat,setChat] = useState([]);
    const [msg,setMsg] = useState({});
    const [type, setType] = useState('Shout');
    const chatBoxEnd = useRef(null);

    useEffect(() => {
        const newChat = [...chat, msg]
        setChat(newChat);
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
        const newChat = [...chat, { message: `${props.user.username}: ` + message }]
        setChat(newChat);
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

    return (
        <div>
            <div className="chat-box">
                {chat.map((mess,i)=><div key={i}>{mess.message}</div>)}
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
    )
}

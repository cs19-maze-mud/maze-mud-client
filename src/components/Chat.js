import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Pusher from 'pusher-js';
import './Chat.css'

export default function Chat(props) {
    const [chat,setChat] = useState([]);
    const [msg,setMsg] = useState({});
    const [type,setType] = useState('Shout');

    useEffect(() => {
        console.log('hook triggered',msg)
        const newChat = [...chat, msg]
        setChat(newChat);
    },[msg])

    useEffect(() => {
        if(props.uuid) {
            const pusher = new Pusher(process.env.PUSHER_APP_KEY, {
                cluster: process.env.PUSHER_CLUSTER,
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
                }
            });
        }
    },[props.uuid])

    const chatHandler = (event) => {
        event.preventDefault();
        const message = event.target.message.value;
        const type = event.target.type.value;
        const token = localStorage.getItem('token');
                
        axios
        .post(`https://maze-mud-server.herokuapp.com/api/adv/${type}/`, {message}, { headers: { Authorization: `Token ${token}` } })
        .then()
        .catch(error => {
            console.log(error.message)
        })
    
    }
    
    const typeHandler = (event) => {
        const type = event.target.value
        setType(type.charAt(0).toUpperCase() + type.slice(1))
    }

    return (
        <div>
            <div className="chat-box">
                {chat.reverse().map((mess,i)=><div key={i}>{mess.message}</div>)}
                {props.moveResponse && props.moveResponse.players && props.moveResponse.players.length > 0 && <span>{props.moveResponse.players.map((p,i) => <span key={i}>{p} is already here!</span>)}</span>}
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

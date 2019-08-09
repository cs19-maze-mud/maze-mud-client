import React, {useRef, useEffect, useState} from 'react';
import "./game.css";
import Chat from './Chat';

function Game(props) {
    const mazeCanvasRef = useRef(null);
    const [bitMaps,
        setBitMaps] = useState([]);
    const [moveResponse,
        setMoveResponse] = useState(null);

    useEffect(() => {
        setMoveResponse(props.startingRoom)
        if (bitMaps.length === document.images.length) {
            const helloWorker = new Worker("main.worker.js");
            helloWorker.onmessage = function ({data}) {
                setMoveResponse(data)
            }
            const offscreen = mazeCanvasRef
                .current
                .transferControlToOffscreen();

            const assetsObj = {
                canvas: offscreen
            }
            bitMaps.forEach(e => {
                assetsObj[Object.keys(e)[0]] = Object.values(e)[0];
            })
            const assetsArray = bitMaps.map(e => Object.values(e)[0]);

            helloWorker.postMessage({
                token: (localStorage.getItem('token')),
                startingRoom: props.startingRoom,
                server: process.env.REACT_APP_SERVER
            });
            helloWorker.postMessage(assetsObj, [
                offscreen, ...assetsArray
            ]);

            const keyHandler = function (event) {
                helloWorker.postMessage({
                    msg: {
                        [event.type]: event.code
                    }
                });
            }

            document.addEventListener("keyup", keyHandler)
            document.addEventListener("keydown", keyHandler)

            return () => document.addEventListener("keypress", keyHandler)
        }
    },[props.startingRoom])

    const loadHandler = event => {
        const name = event.target.id
        createImageBitmap(event.target, 0, 0, event.target.naturalWidth, event.target.naturalHeight).then(res => {
            setBitMaps([
                ...bitMaps, {
                    [name]: res
                }
            ])
        }).catch(err => console.log(err))
    }

    if (moveResponse && moveResponse.in_progress) {
        var roomStuff = <div className="room-stuff">
            <h4>{moveResponse.title}</h4>
            {moveResponse.description}
            <br/>
        </div>
    } else if (moveResponse && !moveResponse.in_progress) {
        var message = <div className="room-stuff endgame">{moveResponse.message}</div>
    }

    return (
        <div>
            <canvas ref={mazeCanvasRef} id="room-canvas" width="500" height="500"/> {/* <canvas ref={roomCanvasRef} id="maze-canvas" width="500" height="500" /> */}
            <img
                onLoad={loadHandler}
                id="background"
                src="Dungeon_Tileset.png"
                style={{
                "display": "none"
            }}
                alt="hidden_image"/>
            <img
                onLoad={loadHandler}
                id="player"
                src="player.png"
                style={{
                "display": "none"
            }}
                alt="hidden_image"/> {roomStuff}
            {message}
            <Chat {...props} uuid={props.uuid} moveResponse={moveResponse}/>
        </div>
    );
}

export default Game;
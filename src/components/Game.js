import React, {useRef, useEffect, useState} from 'react';
import "./game.css";
import Chat from './Chat';
import mainCanvas from '../canvas/main';

function Game(props) {
    const mazeCanvasRef = useRef(null);
    const [bitMaps,
        setBitMaps] = useState([]);
    const [moveResponse,
        setMoveResponse] = useState(null);
    const [loaded,
        setLoaded] = useState(false);

    useEffect(() => {
        //Make sure the bitMaps and room info are both fully loaded
        //Ensure the canvas was not already sent offscreen
        if (bitMaps.length === 2 && props.currentRoom && props.currentRoom.title && !loaded) {
            setLoaded(true)
            setMoveResponse({ ...props.currentRoom, in_progress: true })
            const canvas = mazeCanvasRef.current
            const assets = {
                canvas
            }
            bitMaps.forEach(e => {
                assets[Object.keys(e)[0]] = Object.values(e)[0];
            })
            // const assetsArray = bitMaps.map(e => Object.values(e)[0]);

            mainCanvas.initializeCanvas(
                setMoveResponse,
                props.currentRoom,
                assets,
                canvas
            )

            const keyHandler = function (event) {
                mainCanvas.userInputHandler({
                    [event.type]: event.code
                })
            }

            document.addEventListener("keyup", keyHandler)
            document.addEventListener("keydown", keyHandler)
        }
    },[bitMaps, loaded, props.currentRoom])

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
        setTimeout(()=>props.getGame(),3000)
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
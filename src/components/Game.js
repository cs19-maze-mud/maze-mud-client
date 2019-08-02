import React, {useRef, useEffect,useState} from 'react';
import WebWorker from "./WebWorker"
import HelloWorker from './GameWorker.js';
import "./game.css"

function Game() {
    const mazeCanvasRef = useRef(null);
    const [bitMaps,setBitMaps] = useState([]);
    const [moveResponse,setMoveResponse] = useState(null);

useEffect(() => {
    if(bitMaps.length === document.images.length){



        const helloWorker = new Worker("main.worker.js");
        // const helloWorker = new WebWorker(HelloWorker);
        helloWorker.onmessage = function({data}) {
            setMoveResponse(data)
        }
        
        const offscreen = mazeCanvasRef.current.transferControlToOffscreen();

        const assetsObj = {canvas: offscreen}
        bitMaps.forEach(e => {
            assetsObj[Object.keys(e)[0] ] = Object.values(e)[0]
        })
        const assetsArray = bitMaps.map(e => Object.values(e)[0])


        helloWorker.postMessage(assetsObj, [offscreen, ...assetsArray ]);
        helloWorker.postMessage({token: (localStorage.getItem('token'))});
        

        const keyHandler = function(event){
            helloWorker.postMessage({msg: {[ event.type ]: event.code}});
        }

        document.addEventListener("keyup",keyHandler)
        document.addEventListener("keydown",keyHandler)


        return () => document.addEventListener("keypress",keyHandler)
    }
},[bitMaps])

const loadHandler = event => {
    const name = event.target.id
    createImageBitmap(event.target, 0, 0, event.target.naturalWidth, event.target.naturalHeight)
    .then(res => {
        setBitMaps([...bitMaps,{[name]:res}])
    })
    .catch(err => console.log(err))
}

if(moveResponse && moveResponse.in_progress) {
    var roomStuff = <div className="room-stuff">
        <h4>Room Stuff:</h4>
        <strong>Room:</strong> {moveResponse.title} <br/>
        <strong>Description:</strong> {moveResponse.description} <br/>
        <strong>Players In Room:</strong> {moveResponse.players.length > 0 ? moveResponse.players.map(p => <span>{p}</span>) : "None"} <br/>
    </div>
} else if (moveResponse && !moveResponse.in_progress) {
    var message = <div className="room-stuff">{moveResponse.message}</div>
}

    return (
        <div>
            <canvas ref={mazeCanvasRef} id="room-canvas" width="500" height="500" />
            {/* <canvas ref={roomCanvasRef} id="maze-canvas" width="500" height="500" /> */}
            <img onLoad={loadHandler} id="background" src="https://maze-mud-image-server.herokuapp.com/Dungeon_Tileset.png" style={{"display":"none"}} alt="hidden_image"/>
            <img onLoad={loadHandler} id="player" src="https://maze-mud-image-server.herokuapp.com/player.png" style={{"display":"none"}} alt="hidden_image"/>
            {roomStuff}
            {message}
        </div>
    );
}

export default Game;
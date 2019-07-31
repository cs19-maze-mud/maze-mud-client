import React, {useRef, useEffect,useState} from 'react';
import WebWorker from "./WebWorker"
import HelloWorker from './GameWorker.js';
import "./game.css"

function Game() {
    const mazeCanvasRef = useRef(null);
    const roomCanvasRef = useRef(null);
    const [bitMaps,setBitMaps] = useState([])

useEffect(() => {
    if(bitMaps.length === document.images.length){
        const helloWorker = new WebWorker(HelloWorker);
        const offscreen = mazeCanvasRef.current.transferControlToOffscreen();

        const assetsObj = {canvas: offscreen}
        bitMaps.forEach(e => {
            assetsObj[Object.keys(e)[0] ] = Object.values(e)[0]
        })
        const assetsArray = bitMaps.map(e => Object.values(e)[0])


        helloWorker.postMessage(assetsObj, [offscreen, ...assetsArray ]);

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

    return (
        <React.Fragment>
            <canvas ref={mazeCanvasRef} id="room-canvas" width="500" height="500" />
            <canvas ref={roomCanvasRef} id="maze-canvas" width="500" height="500" />
            <img onLoad={loadHandler} id="background" src="https://maze-mud-image-server.herokuapp.com/Dungeon_Tileset.png" style={{"display":"none"}} alt="hidden_image"/>
            <img onLoad={loadHandler} id="player" src="https://maze-mud-image-server.herokuapp.com/player.png" style={{"display":"none"}} alt="hidden_image"/>
        </React.Fragment>
    );
}

export default Game;
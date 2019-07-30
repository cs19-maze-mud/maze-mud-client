import React, {useRef, useEffect,useState} from 'react';
import WebWorker from "./WebWorker"
import HelloWorker from './GameWorker.js';
import "./game.css"

function Game() {
    const assets = ["http://localhost:5000/pokemon_terrain.jpg","http://localhost:5000/pokemon_terrain_copy.jpg","http://localhost:5000/pokemon_terrain_copy.jpg"]
    const canvasRef = useRef(null);
    const [bitMaps,setBitMaps] = useState([])

useEffect(() => {
    if(bitMaps.length === document.images.length){
        const helloWorker = new WebWorker(HelloWorker);
        const offscreen = canvasRef.current.transferControlToOffscreen();
        helloWorker.postMessage({canvas: offscreen,assets:bitMaps[0]}, [offscreen,bitMaps[0]]);

        const keyHandler = function(event){
            helloWorker.postMessage({msg: event.code});
        }

        document.addEventListener("keypress",keyHandler)

        return () => document.addEventListener("keypress",keyHandler)
    }
},[bitMaps])

const loadHandler = event => {

    createImageBitmap(event.target, 0, 0, event.target.naturalWidth, event.target.naturalHeight)
    .then(res => {
        const background = res
        setBitMaps([...bitMaps,background])
    })
    .catch(err => console.log(err))
}

    return (
        <React.Fragment>
            <canvas ref={canvasRef} id="canvas" width="500" height="500" />
            <img onLoad={loadHandler} id="background" src="http://localhost:5000/pokemon_terrain.jpg" style={{"display":"none"}} alt="hidden_image"/>
            <img onLoad={loadHandler} id="another" src="http://localhost:5000/pokemon_terrain_copy.jpg" style={{"display":"none"}} alt="hidden_image"/>
        </React.Fragment>
    );
}

export default Game;
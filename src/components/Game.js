import React, {
    useRef,
    useEffect,
    useState,
    useCallback
} from 'react';
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
    //Variables used to determine direction of swipe on mobile
    const [xDown,setXDown] = useState(null);
    const [yDown,setYDown] = useState(null);
    const [keyDownInterval,setKeyDownInterval] = useState(null);
    const [swipeToKey,setSwipeToKey] = useState(null);

    useEffect(() => {
        //Make sure the bitMaps and room info are both fully loaded
        //Ensure the canvas was not already sent offscreen
        if (bitMaps.length === 2 && props.currentRoom && props.currentRoom.title && !loaded) {
            setLoaded(true)
            setMoveResponse({ ...props.currentRoom, in_progress: true })

            //Prepare assets and send them to /canvas/main.js
            const canvas = mazeCanvasRef.current
            const assets = {
                canvas
            }
            bitMaps.forEach(e => {
                assets[Object.keys(e)[0]] = Object.values(e)[0];
            })
            mainCanvas.initializeCanvas(
                setMoveResponse,
                props.currentRoom,
                assets,
                canvas
            )
        }
    }, [bitMaps, loaded, props.currentRoom])

    function loadHandler(event) {
        const name = event.target.id
        createImageBitmap(event.target, 0, 0, event.target.naturalWidth, event.target.naturalHeight).then(res => {
            setBitMaps([
                ...bitMaps, {
                    [name]: res
                }
            ])
        }).catch(err => console.log(err))
    }

    const keyHandler = (event) => {
        mainCanvas.userInputHandler({
            [event.type]: event.code
        })
    }

    const getTouches = (evt) => {
        return evt.touches || // browser API
            evt.originalEvent.touches; // jQuery
    }

    //Initialize xDown and yDown at start of touch event
    const handleTouchStart = useCallback((evt) => {
        const firstTouch = getTouches(evt)[0];
        setXDown(firstTouch.clientX)
        setYDown(firstTouch.clientY)
    }, [setXDown,setYDown])

    //Calculate which direction the swipe was in and send event to /canvas/main.js
    const handleTouchMove = useCallback((evt) => {
        if (!xDown || !yDown) {
            return;
        }

        //Get x,y coordinates of touchstart/touchmove events
        //Then calculate their differences
        var xUp = evt.touches[0].clientX;
        var yUp = evt.touches[0].clientY;
        var xDiff = xDown - xUp;
        var yDiff = yDown - yUp;

        //Calculate difference (whether it was an up, down, left, or right swipe)
        if (Math.abs(xDiff) > Math.abs(yDiff)) {
            if (xDiff > 0) {
                /* left swipe */
                convertSwipe('ArrowLeft')
            } else {
                /* right swipe */
                convertSwipe('ArrowRight')
            }
        } else {
            if (yDiff > 0) {
                /* up swipe */
                convertSwipe('ArrowUp')
            } else {
                /* down swipe */
                convertSwipe('ArrowDown')
            }
        }
        /* reset values */
        setXDown(null);
        setYDown(null);
    }, [setXDown, setYDown, xDown, yDown])

    const convertSwipe = (keyPressed) => {
        setSwipeToKey(keyPressed)
        setKeyDownInterval(setInterval(() => {
            mainCanvas.userInputHandler({
                keydown: keyPressed
            })
        }, 35))
    }

    const handleTouchEnd = () => {
        clearInterval(keyDownInterval)
        mainCanvas.userInputHandler({
            keyup: swipeToKey
        })
    }

    /*
        Add event listeners using a custom hook
        The hook ensures event listeners are cleaned up properly
        When the component unmounts
    */

    //Desktop events
    useEventListener('keyup', keyHandler)
    useEventListener('keydown', keyHandler)
    //Mobile events
    useEventListener('touchstart', handleTouchStart)
    useEventListener('touchmove', handleTouchMove)
    useEventListener('touchend', handleTouchEnd)
    
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
        <div className="game-container">
            <canvas ref={mazeCanvasRef} id="room-canvas" width="500" height="500"/>
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

function useEventListener(eventName, handler, element = window) {
    // Create a ref that stores handler
    const savedHandler = useRef();

    // Update ref.current value if handler changes.
    // This allows our effect below to always get latest handler ...
    // ... without us needing to pass it in effect deps array ...
    // ... and potentially cause effect to re-run every render.
    useEffect(() => {
        savedHandler.current = handler;
    }, [handler]);

    useEffect(
        () => {
            // Make sure element supports addEventListener
            // On 
            const isSupported = element && element.addEventListener;
            if (!isSupported) return;

            // Create event listener that calls handler function stored in ref
            const eventListener = event => savedHandler.current(event);

            // Add event listener
            element.addEventListener(eventName, eventListener);

            // Remove event listener on cleanup
            return () => {
                element.removeEventListener(eventName, eventListener);
            };
        },
        [eventName, element] // Re-run if eventName or element changes
    );
};
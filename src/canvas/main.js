/* eslint-disable no-undef */
/* eslint-disable no-restricted-globals */

var ctx = null;
var bg = null;
var top = null
var ptrn = null;
var bottom = null;
var sides = null;
var player1 = null;
var door = null;
var sideDoor = null;
var chain = null;
var torch = null;
var skull = null;
var box = null;
var banner = null;
var sidetorch = null;
var useStateSetter = null;

//AVAILABLE DOORS IN CURRENT ROOM
var s = 1
var n = 1
var w = 1
var e = 1

const handleMove = (direction) => {
    fetch(`${process.env.REACT_APP_SERVER}/api/adv/move/`, {
            method: 'post',
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                'Authorization': `Token ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                direction
            })
        })
        .then(res => res.json())
        .then(function (data) {
            n = data.n
            s = data.s
            e = data.e
            w = data.w
            useStateSetter(data)
        })
        .catch(function (error) {
            console.log('Request failed', error);
        });
}

function nextRoom(direction) {
    if (direction === 'south') {
        player1.y = 40
        player1.x = 250
        handleMove('s')
    } else if (direction === 'north') {
        player1.y = 430
        player1.x = 250
        handleMove('n')
    } else if (direction === 'west') {
        player1.x = 450
        player1.y = 250
        handleMove('w')
    } else {
        player1.x = 20
        player1.y = 250
        handleMove('e')
    }
}

function Player(image) {
    this.x = 250
    this.y = 250
    this.image = image
    this.keypress = {}
    this.currentDirection = 'stand';
    this.animation = [0, 0];
    this.update = function () {

        if (this.keypress["KeyW"] || this.keypress["ArrowUp"]) {
            this.collision(0, -10)
            this.changeDirections('up')
        }

        if (this.keypress["KeyS"] || this.keypress["ArrowDown"]) {
            this.collision(0, 10)
            this.changeDirections('down')
        }

        if (this.keypress["KeyD"] || this.keypress["ArrowRight"]) {
            this.collision(10, 0)
            this.changeDirections('right')
        }

        if (this.keypress["KeyA"] || this.keypress["ArrowLeft"]) {
            this.collision(-10, 0)
            this.changeDirections('left')
        }

    }

    //DIAGONAL
    this.move = function (key) {
        if (key.keydown) {
            this.keypress[key.keydown] = true
        }

        if (key.keyup) {
            delete this.keypress[key.keyup]
        }

        this.update()

    }

    this.changeDirections = function (direction) {
        switch (direction) {
            //MOVE SOUTH
            case 'down':
                if (this.currentDirection === 'stand') {
                    this.currentDirection = 'down-1'
                    this.animation = [17, 0]

                } else if (this.currentDirection === 'down-1') {
                    this.currentDirection = 'down-2'
                    this.animation = [34, 0]

                } else if (this.currentDirection === 'down-2') {
                    this.currentDirection = 'down-1'
                    this.animation = [17, 0]

                } else {
                    this.currentDirection = 'stand'
                    this.animation = [0, 0]
                }
                break;

            //MOVE NORTH
            case 'up':
                if (this.currentDirection === 'stand') {
                    this.currentDirection = 'up-1'
                    this.animation = [125, 0]

                } else if (this.currentDirection === 'up-1') {
                    this.currentDirection = 'up-2'
                    this.animation = [142, 0]

                } else if (this.currentDirection === 'up-2') {
                    this.currentDirection = 'up-1'
                    this.animation = [125, 0]

                } else {
                    this.currentDirection = 'stand'
                    this.animation = [0, 0]

                }
                break;

            //MOVE WEST
            case 'left':
                if (this.currentDirection === 'stand') {
                    this.currentDirection = 'left-1'
                    this.animation = [69, 0]

                } else if (this.currentDirection === 'left-1') {
                    this.currentDirection = 'left-2'
                    this.animation = [87, 0]

                } else if (this.currentDirection === 'left-2') {
                    this.currentDirection = 'left-1'
                    this.animation = [69, 0]

                } else {
                    this.currentDirection = 'stand'
                    this.animation = [0, 0]
                }
                break;

            //MOVE EAST
            case 'right':
                if (this.currentDirection === 'stand') {
                    this.currentDirection = 'right-1'
                    this.animation = [160, 0]

                } else if (this.currentDirection === 'right-1') {
                    this.currentDirection = 'right-2'
                    this.animation = [178, 0]

                } else if (this.currentDirection === 'right-2') {
                    this.currentDirection = 'right-1'
                    this.animation = [160, 0]

                } else {
                    this.currentDirection = 'stand'
                    this.animation = [0, 0]

                }
                break;
            default:
                break;
        }
    }

    //PLAYER IMAGE
    this.draw = function () {
        ctx.drawImage(this.image, this.animation[0], this.animation[1], 17, 16, this.x, this.y, 40, 39)
    }

    this.collision = function (x_mov, y_mov) {

        if (this.x + x_mov <= 450 && this.x + x_mov >= 10) {
            this.x += x_mov
        }

        if (this.y + y_mov <= 450 && this.y + y_mov >= 10) {
            this.y += y_mov
        }

        console.log(this.x,this.y)

        //DOOR TO THE EAST
        if (this.x + x_mov >= 460 && this.y + y_mov >= 210 && this.y + y_mov <= 280) {
            if (e >= 0) {
                nextRoom('east');
            }
        }

        //DOOR TO WEST
        if (this.x + x_mov === 10 && this.y + y_mov >= 210 && this.y + y_mov <= 280) {
            if (w >= 0) {
                nextRoom('west')
            }
        }

        //DOOR TO NORTH
        if (this.x + x_mov >= 210 && this.x + x_mov <= 280 && this.y + y_mov === 10) {
            if (n >= 0) {
                nextRoom('north')
            }
        }

        //DOOR TO SOUTH
        if (this.x + x_mov >= 210 && this.x + x_mov <= 280 && this.y + y_mov === 460) {
            if (s >= 0) {
                nextRoom('south')
            }
        }
    }
}

function initializeCanvas(
    setMoveResponse,
    currentRoom,
    assets,
    canvas
) {
    //Save reference to setMoveResponse useState setter
    //To update react app state when a player changes rooms
    useStateSetter = setMoveResponse
    //Set avaliable exits for current room
    n = currentRoom.n
    s = currentRoom.s
    e = currentRoom.e
    w = currentRoom.w
    //Setup HTML5 Canvas which is attached via useRef in Game.js React component
    ctx = canvas.getContext("2d")
    //Map game assets
    bg = assets.background
    //Create a Player with the player game asset
    player1 = new Player(assets.player)

    Promise.all([
            createImageBitmap(bg, 17, 17, 64, 46),
            createImageBitmap(bg, 9, 0, 78, 17),
            createImageBitmap(bg, 9, 64, 78, 14),
            createImageBitmap(bg, 9, 0, 7, 71),
            createImageBitmap(bg, 96, 50, 32, 15),
            createImageBitmap(bg, 101, 65, 6, 31),
            createImageBitmap(bg, 83, 113, 12, 12),
            createImageBitmap(bg, 0, 143, 13, 13),
            createImageBitmap(bg, 113, 113, 13, 13),
            createImageBitmap(bg, 3, 131, 14, 12),
            createImageBitmap(bg, 65, 115, 14, 14),
            createImageBitmap(bg, 16, 146, 6, 14),
        ])
        .then(res => {
            bg = res[0]
            top = res[1]
            bottom = res[2]
            sides = res[3]
            door = res[4]
            sideDoor = res[5]
            chain = res[6]
            torch = res[7]
            skull = res[8]
            box = res[9]
            banner = res[10]
            sidetorch = res[11]

            function render() {
                ctx.clearRect(0, 0, 500, 500);

                //FLOOR
                ptrn = ctx.createPattern(bg, 'repeat');
                ctx.fillStyle = ptrn;
                ctx.fillRect(0, 0, 500, 500);

                //TOP WALL
                ptrn = ctx.createPattern(top, 'repeat');
                ctx.fillStyle = ptrn;
                ctx.fillRect(0, 0, 500, 17);

                //BOTTOM WALL
                ptrn = ctx.createPattern(bottom, 'repeat');
                ctx.fillStyle = ptrn;
                ctx.fillRect(0, 484, 500, 17);

                //LEFT WALL
                ptrn = ctx.createPattern(sides, 'repeat');
                ctx.fillStyle = ptrn;
                ctx.fillRect(0, 0, 7, 500, 17, 16);

                //RIGHT WALL
                ptrn = ctx.createPattern(sides, 'repeat');
                ctx.fillStyle = ptrn;
                ctx.fillRect(493, 0, 7, 500);

                //TOP DOOR
                if (n !== -1) {
                    ctx.drawImage(door, 230, 0, 50, 17);
                }

                //RIGHT DOOR  
                if (e !== -1) {
                    ctx.drawImage(sideDoor, 490, 230, 10, 50);
                }

                //LEFT DOOR    
                if (w !== -1) {
                    ctx.drawImage(sideDoor, -2, 230, 11, 50)
                }

                //BOTTOM DOOR 
                if (s !== -1) {
                    ctx.drawImage(door, 230, 485, 50, 17);
                }

                //CHAIN
                ctx.drawImage(chain, 290, 480, 20, 17);
                ctx.drawImage(chain, 200, 480, 20, 17);
                ctx.drawImage(chain, 140, 480, 20, 17);
                ctx.drawImage(chain, 350, 480, 20, 17);

                //TOP TORCH
                ctx.drawImage(torch, 350, -5, 20, 17);
                ctx.drawImage(torch, 145, -5, 20, 17);
                ctx.drawImage(sidetorch, 6, 200, 10, 15);
                ctx.drawImage(sidetorch, 6, 300, 10, 15);

                //SKULL
                ctx.drawImage(skull, 470, 15, 20, 17);

                //BOX
                ctx.drawImage(box, 15, 460, 20, 17);
                ctx.drawImage(box, 34, 470, 20, 17);
                ctx.drawImage(box, 434, 450, 20, 17);
                ctx.drawImage(box, 460, 460, 20, 17);
                ctx.drawImage(box, 460, 430, 20, 17);

                //BANNER
                ctx.drawImage(banner, 200, -2, 20, 17);
                ctx.drawImage(banner, 290, -2, 20, 17);
                ctx.drawImage(banner, 100, -2, 20, 17);
                ctx.drawImage(banner, 400, -2, 20, 17);

                //LOCATION
                // if ( currentRoom !== null ) {
                //     ctx.font = "25px Arial";
                //     ctx.fillStyle = "white";
                //     ctx.strokeText(`${currentRoom}`, 10, 40);
                // }

                player1.draw()
                // ctx.drawImage(event.data.player,0,0,17,16,this.x,this.y,17,16)
                requestAnimationFrame(render)
            }
            requestAnimationFrame(render)
        })
        .catch(err => console.log(err))
}

function userInputHandler(data) {
    player1.move(data)
}

export default {
    userInputHandler,
    initializeCanvas
}
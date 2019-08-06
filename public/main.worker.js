/* eslint-disable no-undef */
/* eslint-disable no-restricted-globals */
self.importScripts("player.worker.js")


// self.postMessage({ message: 'Hello' });

// self.addEventListener('message', event => {
//     Game()
//     self.postMessage({ status: 'Worker started' });
// })

// export default () => {
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
    var token = null;
    var currentRoom = null;

    //AVAILABLE DOORS IN CURRENT ROOM
    var s = 1
    var n = 1
    var w = 1
    var e = 1

    var currentDirection = 'stand';
    var animation = [0, 0];



    const handleMove = (direction) => {
        fetch('https://maze-mud-server.herokuapp.com/api/adv/move/', {
            method: 'post',
            headers: {
              "Content-type": "application/json; charset=UTF-8",
              'Authorization': `Token ${token}`
            },
            body: JSON.stringify({direction})
        })
        .then( res => res.json() )
        .then(function (data) {
            n = data.n
            s = data.s
            e = data.e
            w = data.w
            let room = data.title
            currentRoom = room
            postMessage(data)
        })
        .catch(function (error) {
            console.log('Request failed', error);
        });
        
        
        
        
    }

    function nextRoom( direction ) {
        if ( direction === 'south' ) {
            player1.y = 10
            handleMove('s')
        } else if ( direction === 'north' ) {
            player1.y = 470
            handleMove('n')
        } else if ( direction === 'west' ) {
            player1.x = 470
            player1.y = 250
            handleMove('w')
        } else {
            player1.x = 20
            handleMove('e')
        }

        
    }




    self.addEventListener('message', event => { // eslint-disable-line no-restricted-globals
        if (Object.keys(event.data).includes('token')) {
            token = event.data.token;

            const startingRoom = event.data.startingRoom;
            n = startingRoom.n
            s = startingRoom.s
            e = startingRoom.e
            w = startingRoom.w
        }
        else if (event.data.msg) {
            player1.move(event.data.msg)
        }

        if (event.data.canvas) {

            ctx = event.data.canvas.getContext("2d");
            bg = event.data.background
            player1 = new Player(event.data.player)

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
                        if ( n !== -1 ) {
                            ctx.drawImage(door, 230, 0, 50, 17);
                        }

                        //RIGHT DOOR  
                        if ( e !== -1 ) {
                            ctx.drawImage(sideDoor, 490, 230, 10, 50);
                        }

                        //LEFT DOOR    
                        if ( w !== -1 ) {
                            ctx.drawImage(sideDoor, -2, 230, 11, 50)
                        }

                        //BOTTOM DOOR 
                        if ( s !== -1 )    {   
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


                        requestAnimationFrame(render);


                    }
                    requestAnimationFrame(render);
                })
                .catch(err => console.log(err))


        }

    })


// };

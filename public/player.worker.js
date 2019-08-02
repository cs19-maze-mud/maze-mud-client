/* eslint-disable no-undef */
/* eslint-disable no-restricted-globals */




function Player(image) {
    this.x = 250
    this.y = 250
    this.image = image
    this.keypress = {}
    this.update = function ( ) {

        if (this.keypress["KeyW"] || this.keypress["ArrowUp"]) {
            this.collision(0, -10)
            changeDirections( 'up' )
        }

        if (this.keypress["KeyS"] || this.keypress["ArrowDown"]) {
            this.collision(0, 10)
            changeDirections( 'down' )
        }

        if (this.keypress["KeyD"] || this.keypress["ArrowRight"]) {
            this.collision(10, 0)
            changeDirections( 'right' )
        }

        if (this.keypress["KeyA"] || this.keypress["ArrowLeft"]) {
            this.collision(-10, 0)
            changeDirections( 'left' )
        }

    }

    //DIAGINAL
    this.move = function (key) {
        if (key.keydown) {
            this.keypress[key.keydown] = true
        } 

        if (key.keyup) {
            delete this.keypress[key.keyup]
        }

        this.update( )

    }

    function changeDirections( direction ) {

        switch( direction ) {

            //MOVE SOUTH
            case 'down':
                if ( currentDirection === 'stand' ) {
                    currentDirection = 'down-1'
                    animation = [17, 0]

                } else if ( currentDirection === 'down-1' ) {
                    currentDirection = 'down-2'
                    animation = [34, 0]

                }  else if ( currentDirection === 'down-2') {
                    currentDirection = 'down-1'
                    animation = [17, 0]

                } else {
                    currentDirection = 'stand'
                    animation = [0, 0]
                }
                break;

            //MOVE NORTH
            case 'up':
                if ( currentDirection === 'stand' ) {
                    currentDirection = 'up-1'
                    animation = [125, 0]

                } else if ( currentDirection === 'up-1' ) {
                    currentDirection = 'up-2'
                    animation = [142, 0]

                }  else if ( currentDirection === 'up-2' ) {
                    currentDirection = 'up-1'
                    animation = [125, 0]

                } else {
                    currentDirection = 'stand'
                    animation = [0, 0]

                }
                break;

            //MOVE WEST
            case 'left':
                if ( currentDirection === 'stand' ) {
                    currentDirection = 'left-1'
                    animation = [69, 0]

                } else if ( currentDirection === 'left-1' ) {
                    currentDirection = 'left-2'
                    animation = [87, 0]

                } else if ( currentDirection === 'left-2' ) {
                    currentDirection = 'left-1'
                    animation = [69, 0]

                } else {
                    currentDirection = 'stand'
                    animation = [0, 0]
                }
                break;

            //MOVE EAST
            case 'right':
                if ( currentDirection === 'stand' ) {
                    currentDirection = 'right-1'
                    animation = [160, 0]

                } else if ( currentDirection === 'right-1' ) {
                    currentDirection = 'right-2'
                    animation = [178, 0]

                }  else if ( currentDirection === 'right-2') {
                    currentDirection = 'right-1'
                    animation = [160, 0]

                } else {
                    currentDirection = 'stand'
                    animation = [0, 0]

                }
                break;
            default:
                break;
        }
    }

    //PLAYER IMAGE
    this.draw = function () {
        ctx.drawImage( this.image, animation[0], animation[1], 17, 16, this.x, this.y, 40, 39 )
    }

    this.collision = function (x_mov, y_mov) {

        if (this.x + x_mov <= 470 && this.x + x_mov >= 20) {
            this.x += x_mov
        }

        if (this.y + y_mov <= 470 && this.y + y_mov >= 20) {
            this.y += y_mov
        }


        //DOOR TO THE EAST
        if (this.x + x_mov >= 470 && this.y + y_mov >= 230 && this.y + y_mov <= 260) {
            if ( e >= 0 ) {
                nextRoom( 'east' );
            }
        }

        //DOOR TO WEST
        if (this.x + x_mov === 20 && this.y + y_mov >= 230 && this.y + y_mov <= 260) {
            if ( w >= 0 ) {
                nextRoom( 'west' )
            }
        }

        //DOOR TO NORTH
        if (this.x + x_mov >= 230 && this.x + x_mov <= 260 && this.y + y_mov === 20) {
            if ( n >= 0 ) {
                nextRoom( 'north' )
            }
        }

        //DOOR TO SOUTH
        if (this.x + x_mov >= 225 && this.x + x_mov <= 260 && this.y + y_mov === 470) {
            if ( s >= 0 ) {
                nextRoom( 'south' )
            }
        }
    }
}
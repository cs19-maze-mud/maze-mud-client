

export default () => {
    var ctx = null;
    var bg = null;
    var top = null
    var ptrn = null;
    var bottom = null;
    var sides = null;
    var player1 = null

    function Player(image){
        this.x = 250
        this.y = 250
        this.image = image
        this.update = function(key){
            if(key === "KeyW"){
                this.collision(0,-5)
            }
    
            if(key === "KeyS"){
                this.collision(0,5)
            }
    
            if(key === "KeyD"){
                this.collision(5,0)
            }
    
            if(key === "KeyA"){
                this.collision(-5,0)
            }
        }
        this.collision = function(x_mov,y_mov){
            if(this.x + x_mov <= 470 && this.x + x_mov >= 20){
                this.x += x_mov
            }
    
            if(this.y + y_mov <= 470 && this.y + y_mov >= 20){
                this.y += y_mov
            }
        }
        this.draw = function(){
            ctx.drawImage(this.image,0,0,17,16,this.x,this.y,17,16)
        }
    }







    self.addEventListener('message', event => { // eslint-disable-line no-restricted-globals

        if(event.data.msg){
            player1.update(event.data.msg)
        }

        if(!event.data.msg){

            ctx = event.data.canvas.getContext("2d");
            bg = event.data.background
            player1 = new Player(event.data.player)

            Promise.all([
                createImageBitmap(bg, 17, 17, 64, 46),
                createImageBitmap(bg, 9, 0, 78, 17),
                createImageBitmap(bg, 9, 64, 78, 14),
                createImageBitmap(bg, 9, 0, 7, 71),
            ])
            .then(res => {
                   bg = res[0]
                   top = res[1]
                   bottom = res[2]
                   sides = res[3]

                   function render() {
                    ctx.clearRect(0,0,500,500);
    
                    ptrn = ctx.createPattern(bg, 'repeat');
                    ctx.fillStyle = ptrn;
                    ctx.fillRect(0, 0, 500, 500);

                    ptrn = ctx.createPattern(top, 'repeat');
                    ctx.fillStyle = ptrn;
                    ctx.fillRect(0, 0, 500, 17);

                    ptrn = ctx.createPattern(bottom, 'repeat');
                    ctx.fillStyle = ptrn;
                    ctx.fillRect(0, 484, 500, 17);

                    ptrn = ctx.createPattern(sides, 'repeat');
                    ctx.fillStyle = ptrn;
                    ctx.fillRect(0, 0, 7, 500, 17, 16);

                    ptrn = ctx.createPattern(sides, 'repeat');
                    ctx.fillStyle = ptrn;
                    ctx.fillRect(493, 0, 7, 500);
                    
                    player1.draw()
                    // ctx.drawImage(playerImage,0,0,17,16,x,y,17,16)


                    requestAnimationFrame(render);
        

                  }
                requestAnimationFrame(render);
            })
            .catch(err => console.log(err))

            
        }

    })
        

};
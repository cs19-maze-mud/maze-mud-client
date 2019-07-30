
export default () => {
    var x = 250;
    var y = 250;
    var ctx = null
    var bg = null
    self.addEventListener('message', event => { // eslint-disable-line no-restricted-globals


        if(event.data.msg === "KeyW"){
            y -= 5
        }

        if(event.data.msg === "KeyS"){
            y += 5
        }

        if(event.data.msg === "KeyD"){
            x += 5
        }

        if(event.data.msg === "KeyA"){
            x -= 5
        }



        if(!event.data.msg){

            ctx = event.data.canvas.getContext("2d");
            bg = event.data.assets

            function render() {
                ctx.clearRect(0,0,500,500);
                ctx.drawImage(bg, 0, 0);
      

                
                ctx.fillRect(x, y, 50, 50);
                const done = requestAnimationFrame(render);
    
                if(x > 350){
                    cancelAnimationFrame(done);
                }
              }
            requestAnimationFrame(render);
        }

    })
        

};
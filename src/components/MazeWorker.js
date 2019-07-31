export default () => {

    function Room(i,j){
        this.i = i
        this.j = j
        this.north = true
        this.east = true
        this.south = true
        this.west = true
        this.visited = false
    }

    function Maze(columns){
        this.columns = columns
        this.grid = []
        this.current = null

        this.gen_grid = function(){
            for(let i = 0;i< this.columns;i++){
                for(let j = 0;j<this.columns;j++){
                    this.grid.append(new Room(j,i))
                    this.current = this.grid[0]
                }
            }
        }

        this.remove_walls = function(a,b){
            const x = a.i - b.i
            if( x === 1){
                a.west = false
                b.east = false
            } else if( x === -1){
                a.east = false
                b.west = false
            }
                

            const y = a.j - b.j
            if(y === 1){
                a.north = false
                b.south = false
            }else if(y === -1){
                a.south = false
                b.north = false
            }   
        }
                    

        this.index_finder = function(i,j){
            if( i < 0 || j < 0 || i > this.columns-1 || j > this.columns-1){
                return undefined
            } else {
                return i + j * this.columns
            }
        }

        this.check_neighboor = function(){
            const neighbors = []

            const i = this.current.i 
            const j = this.current.j

            const top    = this.grid[this.index_finder(i, j - 1)] ? this.index_finder(i, j - 1) : undefined
            const right  = this.grid[this.index_finder(i + 1, j)] ? this.index_finder(i + 1, j) : undefined
            const bottom = this.grid[this.index_finder(i, j + 1)] ? this.index_finder(i, j + 1) : undefined
            const left   = this.grid[this.index_finder(i - 1, j)] ? this.index_finder(i - 1, j) : undefined

            if( top && !top.visited){
                neighbors.push(top)
            }
                
            if( right && !right.visited){
                neighbors.push(right)
            }
                
            
            if( bottom && !!bottom.visited){
                neighbors.push(bottom)
            }
            
            if( left && !left.visited){
                neighbors.push(left)
            }
                
            if( neighbors.lenth > 0){
                const r = Math.random() * neighbors.length|0
                return neighbors[r]
            } else {
                return undefined
            }

        }

        this.gen_maze = function(){
            const stack = []
            this.current.visited = true
            let next_cell = this.check_neighboor()
            next_cell.visited = true
            stack.push(this.current)
            this.remove_walls(this.current, next_cell)
            this.current = next_cell
            function dfs(){
                if( stack.length === 0){
                    return
                } else {
                    next_cell = this.check_neighboor()
                    if( next_cell){
                        next_cell.visited = true
                        stack.append(this.current)
                        this.remove_walls(this.current,next_cell)
                        this.current = next_cell
                    } else if(stack.length > 0){
                        this.current = stack.pop()
                    }
                    dfs()
                }      

            }
            dfs()

        }


    }
    


    self.addEventListener('message', event => { // eslint-disable-line no-restricted-globals

        if(event.data.canvas){

            const canvas = event.data.canvas;
            const ctx = canvas.getContext("2D");

            const maze = new Maze(5);
            maze.gen_grid()
            maze.gen_maze()
            console.log(maze.grid)

        }
    })
}
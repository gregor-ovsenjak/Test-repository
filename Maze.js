function count_neighbours(Matrix,i,j) {
    let neighbours = [-1,1];
        let rows = []
        let cols = []
        neighbours.forEach(row => {

                if (Matrix[i+row][j] == 0){
                    rows.push(i+row)
                    cols.push(j)
                }
                if (Matrix[i][j+row] == 0){
                    rows.push(i)
                    cols.push(j+row)
                }

        })
        return [rows,cols];
}





const Maze = {

    elements: {
        MazeContainer: null,
        matrix:null
    },


    difficulty: 10,

    init() {

        // create Maze-container div
        this.elements.MazeContainer = document.createElement('div');
        this.elements.MazeContainer.classList.add("MazeContainerClass")
        // append an event (change) to a select DOM element
        var select = document.querySelector("#ChoseDiff");
        select.addEventListener('change', (event) => {
            //choose a difficulty
            this.difficulty = parseInt(event.target.value)
            //removes a grid
            this.elements.MazeContainer.innerHTML = "";
            //creates a grid according to a chosen difficulty
            this.elements.MazeContainer.appendChild(this._createGrid());
            //append MazeContainer to document
            document.body.appendChild(this.elements.MazeContainer);
            // creates a matrix that mirrors the grid and is filled with zeroes
            this._createMatrix()
            //initialization of Recursive Backtracker algorithm for creating a maze
            this._createMaze(this.elements.matrix,1,1);
        });

        //first initialization of a grid ==> by default on easy difficulty
        this.elements.MazeContainer.appendChild(this._createGrid());
        document.body.appendChild(this.elements.MazeContainer);
        this._createMatrix();
        this._createMaze(this.elements.matrix,1,1);
        

    },


    _createGrid() {

        const fragment = document.createDocumentFragment();
        const difficulty = this.difficulty;
        const width = 100/difficulty;

        for (var i = 0; i<difficulty; i++){
                row = document.createElement('div');
                row.classList.add("row");
                

            for (var j = 0; j<difficulty; j++){
                const MazeCell = document.createElement('div');
                MazeCell.setAttribute("id",i+"_"+j)
                // set CSS properties of a cell
                MazeCell.classList.add("MazeCell");


                row.appendChild(MazeCell);
            }
            fragment.appendChild(row);


        }
        // set the width of a row in percent
        rowList = fragment.querySelectorAll(".row");
        rowList.forEach(row => {
            row.style.width = width + "%";
        });

        return fragment;
    },

    _createMatrix() {
        // creates a matrix of dimensions (Difficulty+2)X(Difficulty+2)
        /*
            11111
            10001  a 5X5 matrix looks like this
            10001  the borders are filled with 1's because we constrict the movement of the Recursive Algorithm
            10001  to the areas only filled with 0's 
            11111

        */

        const matrix = new Array(this.difficulty+2).fill(0).map(() => new Array(this.difficulty+2).fill(0));
        for (var i= 0; i < matrix.length; i++){
            matrix[0][i]=1;
            matrix[i][0]=1;
            matrix[matrix.length-1][i] = 1
            matrix[i][matrix.length-1] = 1
            
        }
        this.elements.matrix = matrix;
    },
    




    _createMaze(Matrix,i,j) {
        // if cell is visited change value to 1
        Matrix[i][j] = 1;

        // check for unvisited neigbhours UP,DOWN,LEFT,RIGHT
        let array = count_neighbours(Matrix,i,j);
        let rows = array[0]
        let cols = array[1]
        //randomly choose an unvisited neighbour
        const random = Math.floor(Math.random() * rows.length);
        // if no unvisited neighbours --> backtrack
        if (count_neighbours(Matrix,i,j)[0].length == 0) {
            return false
        // else continue to carve a path
        }else{
            // how to remove borders when we move from cell to cell
            const I = rows[random] - i;
            const J = cols[random] -j ;
            if (I == 0 && J == 1){
                document.getElementById((cols[random]-1)+"_"+(rows[random]-1)).style.borderLeft = "1px solid transparent";
                document.getElementById((j-1)+"_"+(i-1)).style.borderRight = "1px solid transparent";
                // move RIGHT
            }
            if (I == 0 && J ==-1){
                document.getElementById((j-1)+"_"+(i-1)).style.borderLeft = "1px solid transparent";
                document.getElementById((cols[random]-1)+"_"+(rows[random]-1)).style.borderRight = "1px solid transparent";
                //move LEFT
            }
            if (I == -1 && J == 0){
                document.getElementById((cols[random]-1)+"_"+(rows[random]-1)).style.borderBottom = "1px solid transparent";
                document.getElementById((j-1)+"_"+(i-1)).style.borderTop = "1px solid transparent";
                //move UP
            }
            if (I == 1 && J == 0){
                document.getElementById((j-1)+"_"+(i-1)).style.borderBottom = "1px solid transparent";
                document.getElementById((cols[random]-1)+"_"+(rows[random]-1)).style.borderTop = "1px solid transparent";
               // move DOWN
            }
            // recursive call
            this._createMaze(Matrix,rows[random],cols[random])

        }
        // continue the search for unvisited cells when you already backtracked from the previous cell
        // recursive call 
        this._createMaze(Matrix,rows[random],cols[random])
    },

}


window.addEventListener("DOMContentLoaded",function(){
    //Initialize a maze
    Maze.init()
    

})
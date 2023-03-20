//This file will use the matterjs library to create a maze, render an object like a ball and map keystrokes (W,S,A,D) to movements within the matterjs engine.
//I might also change the circle to a clipart corn, because it'd be funny to call this app 'The Maize'

const {Engine, Render, Runner, World, Bodies} = Matter; //destructuring from matterjs library

const cells = 3;
const width = 600;
const height = 600;
const engine = Engine.create();
const {world} = engine; //World is deconstructed from engine

const render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    // wireframes:false, //this option can be invoked if only outlines are desired. 
    width: width, 
    height: height
  }
});

Render.run(render);
Runner.run(Runner.create(),engine);

//Walls
const walls = [
  Bodies.rectangle(width/2, 0        , width,     40,{isStatic:true}), //top border
  Bodies.rectangle(width/2, height   , width,     40,{isStatic:true}), //bottom border
  Bodies.rectangle(0      , height /2,    40, height,{isStatic:true}), //left border
  Bodies.rectangle(width  , height /2,    40, height,{isStatic:true}) //right border
];

World.add(world,walls);

/*As for the maze itself, the build will go as follows:
  [create a grid of cells]
  [pick a random starting cell]
  [for that cell build a randomly-ordered list of neighbors]<-----------<------------<-------
  [if a neighbor has benn visited before, remove it from the list]                          |
  [For each remaining neighbor, 'move' to it and remove hte wall between those two cells]   |
  [Repeat for this new neighbor]->--------------------->----------------->------------------|
*/

//the grid will be a 2d array 
//there will be a verticals array to track separations between columns
//there will be a horizontals array to track separations between rows. 
/*
both arrays will be structured like this:
[
  [0,1,0],
  [0,0,1]
]
where 0 are open and 1s are closed.
*/

//maze generation

/*
 [_][_][_]
 [_][_][_]
 [_][_][_]
*/

const mkArr = (row, col) => {
  return Array(row)
    .fill()
    .map(() => Array(col)
                .fill(false));
};

//grid
const grid = mkArr(cells,cells);

//verticals => has 3 rows and 2 columns 
const verticals = mkArr(cells, cells - 1);

//horizontals => has 2 rows and 3 columns  
const horizontals = mkArr(cells - 1, cells);

//choost starting 
const startRow = Math.floor(Math.random() * cells);
const startCol = Math.floor(Math.random() * cells);

//iterate through maze to create maze
const stepIntoCell = (row, col) => {
  //if I have visited the cell at [row,col], then return
  if(grid[row][col]){
    return;
  }
  //mark cell as visited
  grid[row][col] = true;
  //assemble randomly-ordered list of neighbors
  const neighbors = [
    [row - 1, col    ], //above
    [row    , col + 1], //right
    [row + 1, col    ], //below    
    [row    , col - 1]  //left  
  ]
  //for each neigbor

  //check if the neighbor is out of bounds

  //if we have visited neighbor, continue to next neighbor

  //remove wall from either horizontals or verticals

  //visit next cell
};

stepIntoCell(startRow,startCol);
console.log(grid);

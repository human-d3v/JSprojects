//This file will use the matterjs library to create a maze, render an object like a ball and map keystrokes (W,S,A,D) to movements within the matterjs engine.
//I might also change the circle to a clipart corn, because it'd be funny to call this app 'The Maize'

const {Engine, Render, Runner, World, Bodies} = Matter; //destructuring from matterjs library

const cells = 15;
const width = 600;
const height = 600;
const wallThickness = 5;

const unitLen = width/cells; //each cell's width is a fraction of the possible width

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
  Bodies.rectangle(width/2, 0        , width,      2,{isStatic:true}), //top border
  Bodies.rectangle(width/2, height   , width,      2,{isStatic:true}), //bottom border
  Bodies.rectangle(0      , height /2,     2, height,{isStatic:true}), //left border
  Bodies.rectangle(width  , height /2,     2, height,{isStatic:true}) //right border
];

World.add(world, walls);


//maze generation

const shuffle = arr =>{
  let counter = arr.length;

  while (counter > 0) {
    const index = Math.floor(Math.random() * counter);
    counter--;
    const temp = arr[counter];
    arr[counter] = arr[index];
    arr[index] = temp;
  }

  return arr;
};

const mkArr = (row, col) => {
  return Array(row)
    .fill()
    .map(() => Array(col)
                .fill(false));
};

// // //grid
const grid = mkArr(cells,cells);

// // //verticals => has 3 rows and 2 columns 
const verticals = mkArr(cells, cells - 1);

// // //horizontals => has 2 rows and 3 columns  
const horizontals = mkArr(cells - 1, cells);

//choost starting 
const startRow = Math.floor(Math.random() * cells);
const startCol = Math.floor(Math.random() * cells);

//iterate through maze to create maze
const stepIntoCell = (r, c) => {
  //if I have visited the cell at [row,col], then return
  if(grid[r][c]){
    return;
  }
  //mark cell as visited
  grid[r][c] = true;
  //assemble randomly-ordered list of neighbors
  const neighbors = shuffle([
    [r - 1, c    ,    'up'], //above
    [r    , c + 1, 'right'], //right
    [r + 1, c    ,  'down'], //below    
    [r    , c - 1,  'left']  //left  
  ]);

  //for each neigbor
  for (let n of neighbors){
    const [nextRow, nextColumn, direction] = n; //destructuring from iteration 
    
    //check if the neighbor is out of bounds
    if (
      nextRow < 0 || 
      nextRow >= cells || 
      nextColumn<0 || 
      nextColumn >= cells
      ){
      continue;
    }
    //if we have visited neighbor, continue to next neighbor
    if(grid[nextRow][nextColumn]){
      continue;
    }
    //remove wall from either horizontals or verticals
    if(direction === 'left'){
      verticals[r][c - 1] = true;
    } else if (direction === 'right'){
      verticals[r][c] = true;
    } else if (direction === 'up'){
      horizontals[r -1][c] = true;
    } else if (direction === 'down'){
      horizontals[r][c] = true;
    }

    stepIntoCell(nextRow,nextColumn);
  };
  //visit next cell 
};

stepIntoCell(startRow,startCol);

// this function accepts an array and a string, the string determine the function to be performed when creating the rectangles. 
const mkWalls = (arr, tag) => {
  arr.forEach((row, rowIndex) => {
    row.forEach((open, columnIndex) => {
      if(open){
        return;
      };
      const wall = Bodies.rectangle(
        tag === 'h'? (columnIndex * unitLen) + (unitLen / 2) : (columnIndex * unitLen) + unitLen,
        tag === 'h'? (rowIndex * unitLen) + unitLen : (rowIndex * unitLen) + (unitLen / 2), 
        tag === 'h'? unitLen : wallThickness,
        tag === 'h'? wallThickness : unitLen,
        {isStatic:true});
      World.add(world,wall);
    });
  });
}

mkWalls(horizontals,'h');
mkWalls(verticals,'v');

//goal

const mkGoal = () => {
  const goal = Bodies.rectangle(
    width - unitLen/2,
    height - unitLen/2,
    unitLen * .7,
    unitLen * .7,
    {isStatic:true}
  );
  World.add(world, goal);
};

const goal = mkGoal();

//ball
const mkBall = () => {
  const ball = Bodies.circle(
    unitLen/2, //first cell 
    unitLen/2,
    unitLen/4,
  );
  World.add(world, ball);
}

const ball = mkBall();

  //add velocity to ball
  document.addEventListener('keydown', event => {
    if(event.code === 'KeyW'){

    }
    if(event.code === 'KeyW'){

    }
    if(event.code === 'KeyW'){

    }
    if(event.code === 'KeyW'){

    }

  })

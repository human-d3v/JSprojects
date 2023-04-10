//This file will use the matterjs library to create a maze, render an object like a ball and map keystrokes (W,S,A,D) to movements within the matterjs engine.

const {Engine, Render, Runner, World, Bodies, Body, Events} = Matter; //destructuring from matterjs library

const cellsH = 4;
const cellsV = 3;
const width = window.innerWidth;
const height = window.innerHeight;
const wallThickness = 5;

const unitLenX = width/cellsH; //each cell's width is a fraction of the possible width
const unitLenY = height/cellsV; 

const engine = Engine.create();
engine.world.gravity.y=0; //disable gravity
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
  Bodies.rectangle(width/2, 0        , width,      5,{isStatic:true}), //top border
  Bodies.rectangle(width/2, height   , width,      5,{isStatic:true}), //bottom border
  Bodies.rectangle(0      , height /2,     5, height,{isStatic:true}), //left border
  Bodies.rectangle(width  , height /2,     5, height,{isStatic:true}) //right border
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
const grid = mkArr(cellsV,cellsH);

// // //verticals => has 3 rows and 2 columns 
const verticals = mkArr(cellsV, cellsH - 1);

// // //horizontals => has 2 rows and 3 columns  
const horizontals = mkArr(cellsV - 1, cellsH);

//choost starting 
const startRow = Math.floor(Math.random() * cellsV);
const startCol = Math.floor(Math.random() * cellsH);

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
      nextRow >= cellsV || 
      nextColumn<0 || 
      nextColumn >= cellsH
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
        tag === 'h'? (columnIndex * unitLenX) + (unitLenX / 2) : (columnIndex * unitLenX) + unitLenX,
        tag === 'h'? (rowIndex * unitLenY) + unitLenY : (rowIndex * unitLenY) + (unitLenY / 2), 
        tag === 'h'? unitLenX : wallThickness,
        tag === 'h'? wallThickness : unitLenY,
        {
          label: 'wall',
          isStatic:true
        });
      World.add(world,wall);
    });
  });
}

mkWalls(horizontals,'h');
mkWalls(verticals,'v');

//goal


const goal = Bodies.rectangle(
    width - unitLenX/2,
    height - unitLenY/2,
    unitLenX * .7,
    unitLenY * .7,
    {
      label: 'goal',
      isStatic:true
    });
World.add(world, goal);

const ballRadius = Math.min(unitLenX,unitLenY)/4
const ball = Bodies.circle(
  unitLenX/2,
  unitLenY/2,
  ballRadius,
  {label: 'ball'}
)
World.add(world,ball);
  //add velocity to ball
  document.addEventListener('keypress', event => {
    const {x, y} = ball.velocity;
    if(event.code === 'KeyW'){
      Body.setVelocity(ball, {x, y:-5});
    }
    if(event.code === 'KeyA'){
      Body.setVelocity(ball, {x:x-5, y});
    }
    if(event.code === 'KeyD'){
      Body.setVelocity(ball, {x:x+5, y})
    }
    if(event.code === 'KeyS'){
      Body.setVelocity(ball, {x, y:y+5})
    }
  });

//win condition

Events.on(engine, 'collisionStart', event =>{
  event.pairs.forEach(collision => {
    const labels = ['ball','goal'];
    if(labels.includes(collision.bodyA.label) &&
     labels.includes(collision.bodyB.label)){
      world.gravity.y=1; //turn gravity back on to make everything collapse on itself
      world.bodies.forEach(body => {
        if(body.label === 'wall'){
          body.isStatic = false;
        }
      })
    }
});
});

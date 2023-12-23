import { count } from "console";
import { readLines } from "../utils.mjs";

const lines = await readLines('input');

let maxX = 0, maxY = 0, maxZ =0;

const allBricks = [];
for(let line of lines){    
    const [x1, y1, z1, x2, y2, z2] = line.match(/^([0-9]+),([0-9]+),([0-9]+)~([0-9]+),([0-9]+),([0-9]+)$/).slice(1).map(v => parseInt(v));    
    allBricks.push({
        start: {x: x1, y: y1, z: z1},
        end: {x: x2, y: y2, z: z2}
    });
    maxX = Math.max(x1, x2, maxX);
    maxY = Math.max(y1, y2, maxY);
    maxZ = Math.max(z1, z2, maxZ);
}

for(let brick of allBricks){
    if(brick.start.x > brick.end.x || brick.start.y > brick.end.y || brick.start.z > brick.end.z){
        const temp = brick.start;
        brick.start = brick.end;
        brick.end = temp;
    }
}

allBricks.sort((a, b) => a.start.z - b.start.z);

const occupation = [];
for(let x = 0; x <= maxX; x++){
    occupation[x] = [];
    for(let y = 0; y <= maxY; y++){
        occupation[x][y] = [];
        for(let z = 0; z <= maxZ; z++){
            occupation[x][y][z] = false;
        }
    }
}

function setOccupation(brick, value){
    for(let x = brick.start.x; x <= brick.end.x; x++){
        for(let y = brick.start.y; y <= brick.end.y; y++){
            for(let z = brick.start.z; z <= brick.end.z; z++){
                occupation[x][y][z] = value;
            }
        }
    }
}

function saveBrick(brick){
    setOccupation(brick, brick);
}

function removeBrick(brick){
    setOccupation(brick, false);
}

function checkForBrick(brick, z, dz){
    let others = [];
    for(let x = brick.start.x; x <= brick.end.x; x++){
        for(let y = brick.start.y; y <= brick.end.y; y++){
            const maybeBrick = occupation[x][y][z+dz];
            if(maybeBrick && others.indexOf(maybeBrick) < 0){
                others.push(maybeBrick);
            }
        }
    }
    return others;
}

function checkForBrickBelow(brick){
    return checkForBrick(brick, brick.start.z, -1);
}

function checkForBrickAbove(brick){
    return checkForBrick(brick, brick.end.z, 1);
}

for(let brick of allBricks){
    saveBrick(brick);
}

let moved = true;
while( moved ) {
    moved = false;
    for(let brick of allBricks){
        if(!brick.settled){
            if(brick.start.z === 1){
                brick.settled = true;
            } else {
                const below = checkForBrickBelow(brick);
                if(below.length > 0){
                    brick.settled = true;
                } else {
                    removeBrick(brick);
                    brick.start.z -= 1;
                    brick.end.z -= 1;
                    saveBrick(brick);
                    moved = true;
                }
            }
        }
    }
}

function countBelow(brick){
    return checkForBrickBelow(brick).length;
}

let counter = 0;
for(let brick of allBricks){
    const above = checkForBrickAbove(brick);
    if(above.length == 0 || !above.some(brickAbove => countBelow(brickAbove) === 1)) {
        counter++;
    }
}

console.log(counter);
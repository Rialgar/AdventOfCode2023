import { intersect2D, readLines } from "../utils.mjs";

const minXY = 200000000000000;
const maxXY = 400000000000000;

const lines = await readLines('input');
const stoneLines = [];

for(let line of lines){
    const [x, y, z, vx, vy, vz] = line.match(/^(-?[0-9]+), *(-?[0-9]+), *(-?[0-9]+) *@ *(-?[0-9]+), *(-?[0-9]+), *(-?[0-9]+)$/).slice(1).map(v => parseInt(v));
    stoneLines.push({position: {x, y, z}, velocity: {x: vx, y:vy, z:vz}});    
}

let count = 0;

for(let i = 0; i < stoneLines.length; i++){
    const stoneA = stoneLines[i];
    for(let j = i+1; j < stoneLines.length; j++){
        const stoneB = stoneLines[j];
        const intersection = intersect2D(stoneA, stoneB);
        if(intersection){
            if(intersection === true){
                throw new Error("same line, did not expect for this puzzle ", stoneA, stoneB);
            } else if(intersection.t1 > 0
                && intersection.t2 > 0
                && intersection.position.x >= minXY
                && intersection.position.x <= maxXY
                && intersection.position.y >= minXY
                && intersection.position.y <= maxXY){
                    count += 1;
            }
        }
    }
}

console.log(count);
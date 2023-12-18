import { initMap, readLines } from "../utils.mjs";

const dirMap = {
    '0': 'R',
    '1': 'D',
    '2': 'L',
    '3': 'U'
}

const lines = await readLines('input');
const plan = lines.map(line => {
    const parts = line.match(/\(#([0-9a-f]{5})([0-9a-f])\)/);
    const distance = parseInt(parts[1], 16);
    const direction = dirMap[parts[2]];
    return { direction, distance };
});

let maxX = 0;
let minX = 0;
let minY = 0
let maxY = 0;

const loop = [{x: 0,y: 0}];
let planIndex = 0;

do {
    let next = {... loop[loop.length-1]};
    switch (plan[planIndex].direction) {
        case "U":
            next.y -= plan[planIndex].distance;
            minY = Math.min(minY, next.y);
        break;
        case "D":
            next.y += plan[planIndex].distance;
            maxY = Math.max(maxY, next.y);
        break;
        case "L":
            next.x -= plan[planIndex].distance;
            minX = Math.min(minX, next.x);
        break;
        case "R":
            next.x += plan[planIndex].distance;
            maxX = Math.max(maxX, next.x);
        break;
    }
    loop.push(next);
    planIndex = (planIndex+1) % plan.length;
} while(loop[0].x !== loop[loop.length-1].x || loop[0].y !== loop[loop.length-1].y);

console.log(loop.length, minX, maxX, minY, maxY);


// Pick's Theorem: Area = Inner + Border/2 - 1;
// We want Inner + Border = Area + Border/2 + 1

// Shoelace Formula / Gauß'sche Trapezformel gives us Area
let sum = 0;
for(let i = 0; i < loop.length-1; i++){
    sum += (loop[i].y+loop[i+1].y)*(loop[i].x - loop[i+1].x); // enclosed Area (with border centered in map squares) (Area in Pick's)
    sum += Math.abs((loop[i].y-loop[i+1].y)+(loop[i].x - loop[i+1].x)); //push out border by half a square (Border/2 in Pick's)
};
sum /= 2;

sum += 1 //Corners that we missed when extending ( +1 in Pick's)

console.log(sum);
import { initMap, readLines } from "../utils.mjs";

const dirMap = {
    '0': 'R',
    '1': 'D',
    '2': 'L',
    '3': 'U'
}

const lines = await readLines('example');
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
loop.pop();

console.log(loop.length, minX, maxX, minY, maxY);

//TODO welp, this coredumps

const map = initMap(maxX - minX + 1, maxY - minY + 1, ' ', ' ');

for (let i = 0; i < loop.length; i++) {
    const start = loop[i];
    const end = loop[(i+1) % loop.length];
    const next = loop[(i+2) % loop.length];

    const xSign = Math.sign(end.x - start.x);
    const ySign = Math.sign(end.y - start.y);
    if(xSign !== 0){
        for(let x = start.x + xSign; x != end.x; x += xSign){
            map.set(x - minX, start.y - minY, '═');
        }
    } else {
        for(let y = start.y + ySign; y != end.y; y += ySign){
            map.set(start.x - minX, y - minY, '║');
        }
    }

    if(next.x > end.x){
        if(end.y > start.y){
            map.set(end.x - minX, end.y - minY, '╚');
        } else {
            map.set(end.x - minX, end.y - minY, '╔');
        }
    } else if(next.x < end.x){
        if(end.y > start.y){
            map.set(end.x - minX, end.y - minY, '╝');
        } else {
            map.set(end.x - minX, end.y - minY, '╗');
        }
    } else if(next.y > end.y){
        if(end.x > start.x){
            map.set(end.x - minX, end.y - minY, '╗');
        } else {
            map.set(end.x - minX, end.y - minY, '╔');
        }
    } else if(next.y < end.y){
        if(end.x > start.x){
            map.set(end.x - minX, end.y - minY, '╝');
        } else {
            map.set(end.x - minX, end.y - minY, '╚');
        }
    }
}

let count = 0;
for(let y = 0; y < map.height; y++) {
    let inside = false;
    let lastCorner = false;
    for(let x = 0; x < map.width; x++) {
        if(map.get(x, y).data !== ' '){
            count += 1;
        } else if(inside){
            count += 1;
            map.set(x, y, '#');
        }

        if(map.get(x, y).data === '╔'){
            lastCorner = '╔';
        } else if(map.get(x, y).data === '╚'){
            lastCorner = '╚';
        } else if(map.get(x, y).data === '╗'){
            if(lastCorner === '╚'){
                inside = !inside;
            }
            lastCorner = '╗';
        } else if(map.get(x, y).data === '╝'){
            if(lastCorner === '╔'){
                inside = !inside;
            }
            lastCorner = '╝';
        } else if(map.get(x, y).data === '║'){
            inside = !inside;
        }
    }
}

console.log(count);
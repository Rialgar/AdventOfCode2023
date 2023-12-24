import { readMap } from "../utils.mjs";

const map = await readMap('input', (v) => v || '#');

const start = map.get(1, 0);
const goal = map.get(map.width-2, map.height-1);

const neighbours = [{x:-1, y:0}, {x:1, y:0}, {x:0, y:-1}, {x:0, y:1}];

// Assumption: no arrow field on a crossroads, so we can filter on step in, instead of step out
function isValid(field, next){
    if(next.data === '#'){
        return false;
    }
    if(next.data === '.'){
        return true;
    }
    if(next.data === '>'){
        return next.x > field.x;
    }
    if(next.data === 'v'){
        return next.y > field.y;
    }
    // even though the description mentions them there are no up or left arrows in the data
    // (can we make a map of height-levels and use that to sub-divide the search-space?)
    throw new Error('unhandled field data: ' + next.data);
}

// let's try exhaustive search...
let longest = [];

const paths = [[start]];
while(paths.length > 0){
    
    const path = paths.pop(); //depth first to keep number of simultaneously considered paths low
    const tip = path[0];

    if(tip === goal){
        console.log(path.length-1);
        if(path.length > longest.length){
            longest = path;
        }
    } else {
        for(let n of neighbours){
            const next = map.get(tip.x + n.x, tip.y + n.y)
            if(isValid(tip, next) && path.indexOf(next) < 0){
                const newPath = [next, ...path];
                paths.push(newPath);
            }
        }
    }
}

console.log(longest.length-1);
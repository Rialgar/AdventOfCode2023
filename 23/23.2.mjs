import { readMap } from "../utils.mjs";

const map = await readMap('input', (v) => v || '#');

const start = map.get(1, 0);
const goal = map.get(map.width-2, map.height-1);

const neighbours = [{x:-1, y:0}, {x:1, y:0}, {x:0, y:-1}, {x:0, y:1}];

function isValid(field, next){
    return next.data != "#";
}

// let's try exhaustive search...
let longest = [];

const paths = [[start]];
while(paths.length > 0){
    
    const path = paths.pop(); //depth first to keep number of simultaneously considered paths low
    const tip = path[0];

    if(tip === goal){        
        if(path.length > longest.length){
            console.log(path.length-1);
            longest = path;
        } else {
            process.stdout.write('.');
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
import { readMap } from "../utils.mjs";

const neighbours = [{x:-1, y:0}, {x:1, y:0}, {x:0, y:-1}, {x:0, y:1}];

const map = await readMap('input', (v) => v || '#');
const start = map.find(v => v === 'S');

let reachable = [start];
for(let steps = 0; steps < 64; steps++){
    const prev = reachable;
    reachable = [];
    for(let field of prev){
        for(let n of neighbours){
            const next = map.get(field.x + n.x, field.y + n.y)
            if(next.data !== '#' && reachable.indexOf(next) < 0){
                reachable.push(next);
            }
        }
    }
}

console.log(reachable.length);
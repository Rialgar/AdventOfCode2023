import { readMap } from "../utils.mjs";

const neighbours = [{x:-1, y:0}, {x:1, y:0}, {x:0, y:-1}, {x:0, y:1}];

const map = await readMap('example');
map.loop = true;

const start = map.find(v => v === 'S');

let reachable = [start];
let data = []
for(let steps = 0; steps < 121; steps++){
    const prev = reachable;
    reachable = [];
    for(let field of prev){
        for(let n of neighbours){
            const next = map.get(field.x + n.x, field.y + n.y)
            if(next.data !== '#' && reachable.findIndex(e => e.x === next.x && e.y === next.y) < 0){
                reachable.push(next);
            }
        }
    }    
    data.push(reachable.length);
}

for(let start = 0; start < data.length; start += 11){
    console.log(data.slice(start, start+11).join(','));
}
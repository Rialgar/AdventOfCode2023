import { a_star, readMap } from "../utils.mjs";

const map = await readMap('input', char => char && parseInt(char));

const start = map.get(0, 0);
const goal = map.get(map.width-1, map.height-1);

//we know it is a straight line
const cost = (next, current) => {
    const minX = Math.min(next.x, current.x);
    const maxX = Math.max(next.x, current.x);
    const minY = Math.min(next.y, current.y);
    const maxY = Math.max(next.y, current.y);

    let sum = 0;
    for(let x = minX; x <= maxX; x++){
        for(let y = minY; y <= maxY; y++){
            sum += map.get(x, y).data;
        }
    }

    sum -= current.data;

    return sum;
};

const filter = fields => {
    if(fields.length < 3){
        return true;
    }
    const lastXDir = Math.sign(fields[0].x - fields[1].x);
    const lastYDir = Math.sign(fields[0].y - fields[1].y);
    
    const prevXDir = Math.sign(fields[1].x - fields[2].x);
    const prevYDir = Math.sign(fields[1].y - fields[2].y);
    return lastXDir * prevXDir === 0 && lastYDir * prevYDir === 0;
};

const visitedKey = tiles => {
    let out = `${tiles[0].x}:${tiles[0].y}`;
    if(tiles.length > 1){
        if(tiles[1].x !== tiles[0].x){
            out += 'x'
        } else {
            out += 'y'
        }
    }
    return out;
}

const movement_candidates = [];
for(let i = 1; i <= 3; i++){
    movement_candidates.push({x:i, y:0}, {x:-i, y:0}, {x:0, y:i}, {x:0, y:-i});
}

console.log(a_star(map, start, goal, {cost, filter, visitedKey, movement_candidates}));
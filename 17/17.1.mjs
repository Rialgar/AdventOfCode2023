import { a_star, insert, readMap } from "../utils.mjs";

const map = await readMap('example', char => char && parseInt(char));

const start = map.get(0, 0);
const goal = map.get(map.width-1, map.height-1);

goal.shortest = 0;
const shortestKnown = [goal];

//fast way to get the cheapest path for each node ignoring the "don't go straight for too long" requirement
while(shortestKnown.length > 0){
    const current = shortestKnown.shift();
    const movement_candidates = [{x:-1, y:0}, {x:1, y:0}, {x:0, y:-1}, {x:0, y:1}];
    for (const candidate of movement_candidates) {
        const neighbour = map.get(current.x + candidate.x, current.y + candidate.y);
        if(neighbour.data && !neighbour.shortest){
            neighbour.shortest = current.shortest + current.data;            
            insert(shortestKnown, neighbour, (a,b) => a.shortest-b.shortest);
        }
    }
}
console.log(start.shortest); //lower limit, 615

const cost = next => next.data;
const filter = fields => {
    if(fields.length < 3){
        return true;
    }
    if(fields[0] === fields[2]){
        return false;
    }
    if(fields.length < 5){
        return true;
    }    
    const lastXDir = fields[0].x - fields[1].x;
    const lastYDir = fields[0].y - fields[1].y;
    for(let i of [1, 2, 3]){
        if(fields[i].x - fields[i+1].x !== lastXDir){
            return true;
        }
        if(fields[i].y - fields[i+1].y !== lastYDir){
            return true;
        }
    }
    return false;
};

const visitedKey = tiles => {
    let segments = [];
    for(let i = 0; i < Math.min(6, tiles.length); i++){
        segments.push(`${tiles[i].x}:${tiles[i].y}`);
    }
    return segments.join(';');
}
console.log(a_star(map, start, goal, {cost, filter, visitedKey}).cost);
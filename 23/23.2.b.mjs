import { readMap } from "../utils.mjs";

const map = await readMap('input', (v) => v || '#');

const start = map.get(1, 0);
const goal = map.get(map.width-2, map.height-1);

const neighbours = [{x:-1, y:0}, {x:1, y:0}, {x:0, y:-1}, {x:0, y:1}];

function isValid(field, next){
    return next.data != "#";
}

function getValids(field){
    return neighbours.map(n => map.get(field.x + n.x, field.y + n.y)).filter(next => isValid(field, next));
}

// process the map into a graph

const startNode = {field: start, connections: []};
const goalNode = {field: goal, connections: []};
const nodes = [startNode, goalNode];
const unprocessed = [startNode];

while(unprocessed.length > 0){
    const startNode = unprocessed.pop();
    for(let firstStep of getValids(startNode.field)){
        let path = [firstStep, startNode.field];
        let nextValids = getValids(path[0]);
        while(nextValids.length === 2 && path[0] !== goal){
            path.unshift(nextValids.find(n => n != path[1]));
            nextValids = getValids(path[0]);
        }
        let node = nodes.find(n => n.field === path[0]);
        if(!node){
            node = {field: path[0], connections: []};
            unprocessed.push(node);
            nodes.push(node);
        }
        if(!node.connections.some((con) => con.node === startNode)){
            node.connections.push({node: startNode, length: path.length-1});
            startNode.connections.push({node, length: path.length-1});
        }
    }
}

// let's try exhaustive search...
let longest = {nodes: [], length: 0};

const paths = [{nodes: [startNode], length: 0}];
while(paths.length > 0){
    
    const path = paths.pop(); //depth first to keep number of simultaneously considered paths low
    const tip = path.nodes[0];

    if(tip === goalNode){        
        if(path.length > longest.length){
            console.log(path.length);
            longest = path;
        } else {
            //process.stdout.write('.');
        }
    } else {
        for(let con of tip.connections){
            if(path.nodes.indexOf(con.node) < 0){
                const newPath = {nodes: [con.node, ...path.nodes], length: path.length + con.length};
                paths.push(newPath);
            }
        }
    }
}
process.stdout.write('\n');

console.log(longest.length);
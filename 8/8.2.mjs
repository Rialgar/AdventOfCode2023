import { largest_common_divider, readLines, smallest_common_multiple, smallest_common_multiple_2 } from "../utils.mjs";

const lines = await readLines('input');

const instructions = lines[0];

const nodes = {};

let startNodes = [];

function parseNode(spec){
    const name = spec.substr(0,3);
    const L = spec.substr(7,3);
    const R = spec.substr(12,3);
    nodes[name] = {name, L, R};

    if(name[2] === 'A'){
        startNodes.push(name);
    }
}

for(let i = 2; i < lines.length; i++){
    parseNode(lines[i]);
}

const cycles = [];

for(let i = 0; i < startNodes.length; i++){
    let currentNode = startNodes[i];
    let goalsReached = [];
    let step = 0;
    while(true){
        while(currentNode[2] != 'Z'){
            currentNode = nodes[currentNode][instructions[step % instructions.length]];
            step += 1;
        }
        if(goalsReached.some(goal => goal.node === currentNode)){
            goalsReached.push({
                node: currentNode,
                step: step
            });
            break;
        } else {
            goalsReached.push({
                node: currentNode,
                step: step
            });
            currentNode = nodes[currentNode][instructions[step % instructions.length]];
            step += 1;
        }
    }
    cycles[i] = {offset: goalsReached[0].step, length: goalsReached[1].step - goalsReached[0].step};
}

console.log(cycles);
//turns out offset and length is always equal, phew
console.log(smallest_common_multiple(...cycles.map(c => c.length)));
console.log(smallest_common_multiple_2(...cycles.map(c => c.length)));
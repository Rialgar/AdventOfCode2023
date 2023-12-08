import { readLines } from "../utils.mjs";

const lines = await readLines('input');

const instructions = lines[0];

const nodes = {};

function parseNode(spec){
    const name = spec.substr(0,3);
    const L = spec.substr(7,3);
    const R = spec.substr(12,3);
    nodes[name] = {name, L, R}
}

for(let i = 2; i < lines.length; i++){
    parseNode(lines[i]);
}

let currentNode = 'AAA';
let step = 0;
while(currentNode != 'ZZZ'){
    currentNode = nodes[currentNode][instructions[step % instructions.length]];
    step += 1;
}

console.log(step);
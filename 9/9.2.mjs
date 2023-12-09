import { readLines, sumArray } from "../utils.mjs";

const lines = await readLines('input');

const sequences = [];
for (let i = 0; i < lines.length; i++) {
    sequences.push([lines[i].split(' ').map(v =>  parseInt(v))]);
}

function derive(list){
    const result = [];
    for (let i = 1; i < list.length; i++) {
        result.push(list[i] - list[i-1]);
    }
    return result;
}

function deriveTillZero(seq) {
    let highestDer = seq[0];
    while(highestDer.some(num => num !== 0)){
        highestDer = derive(highestDer);
        seq.push(highestDer);
    }    
}

function calculatePrev(seq){
    seq[seq.length-1].unshift(0);
    for(let der = seq.length-2; der >=0; der--){
        const first = seq[der][0];
        const step = seq[der+1][0];
        seq[der].unshift(first-step);
    }
}

sequences.forEach(deriveTillZero);
sequences.forEach(calculatePrev);

console.log(sumArray(sequences.map(seq => seq[0][0])));
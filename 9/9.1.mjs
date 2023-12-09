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

function calculateNext(seq){
    seq[seq.length-1].push(0);
    for(let der = seq.length-2; der >=0; der--){
        const last = seq[der][seq[der].length-1];
        const step = seq[der+1][seq[der+1].length-1];
        seq[der].push(last+step);
    }
}

sequences.forEach(deriveTillZero);
sequences.forEach(calculateNext);

console.log(sumArray(sequences.map(seq => seq[0][seq[0].length-1])));
import { readLines, sumArray } from "../utils.mjs";

const lines = await readLines('input');

const steps = lines[0].split(",");

function hash(string){
    let current = 0;
    for (let i = 0; i < string.length; i++) {
        current += string.charCodeAt(i);
        current *= 17;
        current %= 256;        
    }
    return current;
}

const result = sumArray(steps.map(hash));
console.log(result);
import { readLines } from "../utils.mjs";

const lines = await readLines('input');

const copies = [];
for(let i = 0; i < lines.length; i++){
    copies[i] = 1;
}

let sum = 0;

lines.forEach((line, index) => {    
    sum += copies[index];
    const card = line.split(':')[1].split('|');
    const winners = card[0].match(/[0-9]+/g);
    const have = card[1].match(/[0-9]+/g);
    const count = have.filter(number => winners.indexOf(number) >= 0).length;
    for(let i = index + 1; i <= index + count && i < copies.length; i++){
        copies[i] += copies[index];
    }
})

console.log(sum);
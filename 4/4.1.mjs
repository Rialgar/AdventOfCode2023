import { readLines } from "../utils.mjs";

const lines = await readLines('input');

let sum = 0;

lines.forEach(line => {
    const card = line.split(':')[1].split('|');
    const winners = card[0].match(/[0-9]+/g);
    const have = card[1].match(/[0-9]+/g);
    const count = have.filter(number => winners.indexOf(number) >= 0).length;
    if(count > 0){
        sum += Math.pow(2, count-1);
    }
})

console.log(sum);
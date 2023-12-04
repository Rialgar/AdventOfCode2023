import { readLines } from "../utils.mjs";

function readNum(num){
    switch(num){
        case 'one': return '1';
        case 'two': return '2';
        case 'three': return '3';
        case 'four': return '4';
        case 'five': return '5';
        case 'six': return '6';
        case 'seven': return '7';
        case 'eight': return '8';
        case 'nine': return '9';
        default: return num;
    }
}

let sum = 0;
const lines = await readLines('./input');
lines.forEach(line => {
    const first = line.match(/[0-9]|one|two|three|four|five|six|seven|eight|nine/)[0]
    const last = line.split('').reverse().join('').match(/[0-9]|eno|owt|eerht|ruof|evif|xis|neves|thgie|enin/)[0].split('').reverse().join('')
    sum += parseInt(readNum(first) + readNum(last));
})

console.log(sum);
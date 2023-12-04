import { readLines } from "../utils.mjs";

let sum = 0;
const lines = await readLines('./input');
lines.forEach(line => {
    const digits = line.match(/[0-9]/g)
    sum += parseInt(digits[0] + digits[digits.length - 1]);
})

console.log(sum);
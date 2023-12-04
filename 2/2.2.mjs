import { readLines } from "../utils.mjs";

let sum = 0;

const lines = await readLines('./input');
lines.forEach(line => {
    const a = line.split(':');
    const index = parseInt(a[0].split(' ')[1]);

    const needed = {
        red: 0,
        green: 0,
        blue: 0
    }
    const sets = a[1].split(';');
    for(let set of sets){
        const colors = set.split(",");
        for (let color of colors){
            const [_, count, name] = color.split(' ');
            needed[name] = Math.max(needed[name], count);
        }
    }
    sum += needed.red * needed.green * needed.blue;
})
console.log(sum);
import { readLines } from "../utils.mjs";

let sum = 0;

const max = {
    red: 12,
    green: 13,
    blue: 14
}

const lines = await readLines('./input');
lines.forEach(line => {
    const a = line.split(':');
    const index = parseInt(a[0].split(' ')[1]);
    const sets = a[1].split(';');
    for(let set of sets){
        const colors = set.split(",");
        for (let color of colors){
            const [_, count, name] = color.split(' ');
            if(max[name] < parseInt(count)){       
                return;
            }
        }
    }
    sum += index;
})
console.log(sum);
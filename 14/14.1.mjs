import { readChars } from "../utils.mjs";

const lines = await readChars('input');
const height = lines.length;
const width = lines[0].length;

let sum = 0;

for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
        if(lines[y][x] === 'O'){
            let y2 = y
            while(y2 > 0 && lines[y2-1][x] === '.'){
                y2--;
            }
            if(y2 !== y){
                lines[y2][x] = 'O';
                lines[y][x] = '.';   
            }
            sum += height-y2;
        }
    }    
}

console.log(sum);
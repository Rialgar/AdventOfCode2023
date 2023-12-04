import { readLines } from "../utils.mjs";

let sum = 0;

const lines = await readLines('input');

function processNumber(y, xStart, xEnd){
    for(let yTest = y-1; yTest <= y+1; yTest++){        
        if(yTest >= 0 && yTest < lines.length && lines[yTest].substring(Math.max(xStart-1, 0), Math.min(xEnd+1, lines[yTest].length-1)).match(/[^0-9.]/)){            
            const num = parseInt(lines[y].substring(xStart, xEnd));            
            sum += num;
            return;
        }
    }    
}

for(let y = 0; y < lines.length; y++){
    let xStart = -1, reading = false;    
    for(let x = 0; x < lines[y].length; x++){        
        if(lines[y][x].match(/[0-9]/)) {            
            if(!reading){
                xStart = x;
                reading = true;
            }
        } else if(reading) {
            processNumber(y, xStart, x);
            reading = false;
        }
    }
    if(reading){
        processNumber(y, xStart, lines[y].length);
    }
};

console.log(sum);
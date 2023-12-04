import { readLines } from "../utils.mjs";

const gears = {};

const lines = await readLines('input');

function processNumber(y, xStart, xEnd){
    for(let yTest = y-1; yTest <= y+1; yTest++){        
        for(let xTest = xStart-1; xTest < xEnd+1; xTest++){            
            if(yTest >= 0 && yTest < lines.length && xTest >= 0 && xTest < lines[yTest].length){
                if (lines[yTest][xTest] === '*' ){
                    const num = parseInt(lines[y].substring(xStart, xEnd));
                    const gearId = yTest + ':' + xTest;
                    if(!gears[gearId]){
                        gears[gearId] = []
                    }
                    gears[gearId].push(num);
                }
            }
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

let sum = 0;

for(let key in gears){
    if(gears[key].length == 2){
        sum += gears[key][0]*gears[key][1];
    }
}

console.log(sum);
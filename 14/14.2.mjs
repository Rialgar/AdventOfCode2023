import { readChars } from "../utils.mjs";

const map = await readChars('input');
const height = map.length;
const width = map[0].length;

let numRocks = 0
for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
        if(map[y][x] === 'O'){
            numRocks += 1;
        }
    }
}

function moveNorth(){
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if(map[y][x] === 'O'){
                let y2 = y
                while(y2 > 0 && map[y2-1][x] === '.'){
                    y2--;
                }
                if(y2 !== y){
                    map[y2][x] = 'O';
                    map[y][x] = '.';   
                }            
            }
        }    
    }
}

function moveSouth(){
    for (let y = height-1; y >=0; y--) {
        for (let x = 0; x < width; x++) {
            if(map[y][x] === 'O'){
                let y2 = y
                while(y2+1 < height && map[y2+1][x] === '.'){
                    y2++;
                }
                if(y2 !== y){
                    map[y2][x] = 'O';
                    map[y][x] = '.';   
                }            
            }
        }    
    }
}

function moveEast(){
    for (let y = 0; y < height; y++) {
        for (let x = width-1; x >= 0; x--) {
            if(map[y][x] === 'O'){
                let x2 = x
                while(x2+1 < width && map[y][x2+1] === '.'){
                    x2++;
                }
                if(x2 !== x){
                    map[y][x2] = 'O';
                    map[y][x] = '.';   
                }            
            }
        }    
    }
}

function moveWest(){
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if(map[y][x] === 'O'){
                let x2 = x
                while(x2 > 0 && map[y][x2-1] === '.'){
                    x2--;
                }
                if(x2 !== x){
                    map[y][x2] = 'O';
                    map[y][x] = '.';   
                }            
            }
        }    
    }
}

function cycle(){
    moveNorth();
    moveWest();
    moveSouth();
    moveEast();
}

function hashCurrent(){
    let sum = 0;
    let i = 0;
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if(map[y][x] === 'O'){
                sum += x * numRocks * numRocks * (height+1) + y * i;
                i++;
            }
        }
    }
    return sum;
}

//console.log(hashCurrent(await readChars('90')))
//console.log(hashCurrent(await readChars('127')))
//process.exit();


function weighCurrent(){
    let sum = 0;
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if(map[y][x] === 'O'){
                sum += height-y;
            }
        }
    }
    return sum;
}

const cycleCount = 1000000000;

const history = [];

let repetitionStart = 0;
let repetitionLength = 0;
for(let i = 0; i < cycleCount; i++){    
    const hash = hashCurrent();
    const weight = weighCurrent();
    const previous = history.findIndex(prev => prev.hash === hash);
    history.push({
        hash,
        weight
    });
    if(repetitionLength === 0 && previous >= 0){
        repetitionStart = previous;
        repetitionLength = i-previous;
        break;
    }
    cycle();
}

const endIndex = (cycleCount-repetitionStart)%repetitionLength + repetitionStart;
const endState = history[endIndex];

console.log(endState.weight);
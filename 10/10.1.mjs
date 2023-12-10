import {bash, readLines} from '../utils.mjs'

const lines = await readLines('input');

const directions = ['north', 'east', 'south', 'west'];
const connectionMap = {
    '|': {north:true , east: false, south: true , west: false},
    '-': {north:false, east: true , south: false, west: true },
    'L': {north:true , east: true , south: false, west: false},
    'J': {north:true , east: false, south: false, west: true },
    '7': {north:false, east: false, south: true , west: true },
    'F': {north:false, east: true , south: true , west: false},
    '.': {north:false, east: false, south: false, west: false},
}

const map = [];
const start = { x:-1, y:-1 };

for (let y = 0; y < lines.length; y++) {
    map[y] = [];
    for (let x = 0; x < lines[y].length; x++) {
        if(lines[y][x] === 'S'){
            start.x = x;
            start.y = y;
            map[y][x] = {x , y};
        } else {
            map[y][x] = {...connectionMap[lines[y][x]], x , y};
        }
    }
}

function getTile(x, y, dir){
    if(dir){
        if(dir === 'north'){
            y -= 1;
        } else if(dir === 'south'){
            y += 1;
        } else if(dir === 'east'){
            x += 1;
        } else if(dir === 'west'){
            x -= 1;
        }
    }
    if(x<0 || y<0 || y>=map.length || x>=map[y].length){
        return {north:false, east: false, south: false, west: false};
    } else {
        return map[y][x];
    }
}

const startTile = getTile(start.x, start.y);
startTile.north = getTile(start.x, start.y, 'north').south;
startTile.east = getTile(start.x, start.y, 'east').west;
startTile.south = getTile(start.x, start.y, 'south').north;
startTile.west = getTile(start.x, start.y, 'west').east;
startTile.inLoop = true;
startTile.dist = 0;


let maxTile = startTile;

const current = [startTile];
while(current.length > 0){
    const tile = current.shift();
    for(let dir of directions){
        if(tile[dir]){
            const nextTile = getTile(tile.x, tile.y, dir);
            if(!nextTile.inLoop) {
                nextTile.inLoop = true;
                nextTile.dist = tile.dist+1;
                current.push(nextTile);
                if(nextTile.dist > maxTile.dist) {
                    maxTile = nextTile;
                }
            }
        }
    }
}

function toBoxChar(tile){    
    if(tile.north && tile.south){
        return '║'
    } else if(tile.east && tile.west){
        return '═'
    } else if(tile.north && tile.east){
        return '╚'
    } else if(tile.north && tile.west){
        return '╝'
    } else if(tile.south && tile.west){
        return '╗';
    } else if(tile.south && tile.east){
        return '╔';
    } else {
        return ' '
    }
}

function print(){
    let out = '';
    for (let y = 0; y < map.length; y++) {        
        for (let x = 0; x < map[y].length; x++) {
            const char = toBoxChar(map[y][x]);
            if(x === start.x && y === start.y){
                out += bash().red().of(char);
            } else if (map[y][x].inLoop) {
                out += bash().green().of(char);
            } else {
                out += char;
            }            
        }
        out += '\n';
    }
    console.log(out);
}

print();
console.log(maxTile);
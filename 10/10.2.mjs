import {bash, initArrayFactory, readLines} from '../utils.mjs'

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

function getTile(x, y, dir, chosenMap){
    if(!chosenMap){
        chosenMap = map;
    }
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
    if(x<0 || y<0 || y>=chosenMap.length || x>=chosenMap[y].length){
        return {fake: true};
    } else {
        return chosenMap[y][x] || {fake: true};
    }
}

const startTile = getTile(start.x, start.y);
startTile.north = getTile(start.x, start.y, 'north').south;
startTile.east = getTile(start.x, start.y, 'east').west;
startTile.south = getTile(start.x, start.y, 'south').north;
startTile.west = getTile(start.x, start.y, 'west').east;
startTile.inLoop = true;
startTile.dist = 0;

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
            }
        }
    }
}

const blownOutMap = initArrayFactory(map.length*3, () => []);
function addTileToBlownOutMap(tile){
    blownOutMap[tile.y][tile.x] = tile;
}
function blowOutTile(tile){
    //corners, never connected to anything
    addTileToBlownOutMap({
        x: tile.x*3,
        y: tile.y*3,
    });
    addTileToBlownOutMap({
        x: tile.x*3+2,
        y: tile.y*3,
    });
    addTileToBlownOutMap({
        x: tile.x*3,
        y: tile.y*3+2,
    });
    addTileToBlownOutMap({
        x: tile.x*3+2,
        y: tile.y*3+2,
    });

    //center, identical to original    
    addTileToBlownOutMap({
        ...tile,
        x: tile.x*3+1,
        y: tile.y*3+1
    });

    //edges, straight lines if there was a connection
    addTileToBlownOutMap({ //north
        x: tile.x*3+1,
        y: tile.y*3,
        north: tile.north,
        south: tile.north,
        inLoop: tile.inLoop && tile.north
    });
    addTileToBlownOutMap({//east
        x: tile.x*3+2,
        y: tile.y*3+1,
        east: tile.east,
        west: tile.east,
        inLoop: tile.inLoop && tile.east
    });
    addTileToBlownOutMap({//south
        x: tile.x*3+1,
        y: tile.y*3+2,
        north: tile.south,
        south: tile.south,
        inLoop: tile.inLoop && tile.south
    });
    addTileToBlownOutMap({//west
        x: tile.x*3,
        y: tile.y*3+1,
        east: tile.west,
        west: tile.west,
        inLoop: tile.inLoop && tile.west
    });
}
for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
        blowOutTile(getTile(x, y));
    }
}

function checkNextOutside(next){
    if(!next.fake && !next.inLoop && !next.outside){
        next.outside = true;
        current.push(next);
    }
}

for(let x = 0; x < blownOutMap[0].length; x++){
    checkNextOutside(getTile(x, 0, false, blownOutMap));
    checkNextOutside(getTile(x, blownOutMap.length-1), false, blownOutMap);
}

for(let y = 0; y < blownOutMap.length; y++){
    checkNextOutside(getTile(0, y, false, blownOutMap));
    checkNextOutside(getTile(blownOutMap[y].length-1, y), false, blownOutMap);
}

while(current.length > 0){
    const tile = current.shift();
    for(let dir of directions){
        const next = getTile(tile.x, tile.y, dir, blownOutMap);
        checkNextOutside(next);
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

function print(chosenMap){
    let out = '';
    for (let y = 0; y < chosenMap.length; y++) {
        for (let x = 0; x < chosenMap[y].length; x++) {            
            const tile = getTile(x, y, false, chosenMap);
            let char = toBoxChar(tile);
            if (tile.inLoop) {
                out += bash().green().of(char);   
            } else if (tile.outside) {
                out += bash().bgRed().of(char);
            } else {
                out += char;
            }
        }
        out += '\n';
    }
    console.log(out);
}

print(map);

function collapseTile(x, y){
    const tile = getTile(x, y);
    const blownOutTiles = [];
    for(let bX = 0; bX < 3; bX++){
        for(let bY = 0; bY < 3; bY++){
            blownOutTiles.push(getTile(x*3+bX, y*3+bY, false, blownOutMap));
        }
    }
    tile.outside = blownOutTiles.every(bT => bT.outside);
    tile.border = !tile.outside && blownOutTiles.some(bT => bT.outside);
}

for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
        collapseTile(x, y);        
    }
}

let count = 0;
for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
        const tile = getTile(x, y);
        if(!tile.outside && !tile.inLoop){
            count++;
        }
    }
}

print(map);
console.log(count);
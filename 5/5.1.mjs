import { readLines } from "../utils.mjs";

const lines = await readLines('input');

let values = lines[0].split(':')[1].trim().split(' ').map(s => parseInt(s));
let currentType = 'seed';

const maps = {};

let lineNo = 2;

function readMap(){
    const map = {};
    const nameMatch = lines[lineNo].match(/(.*)-to-(.*) map:/);
    map.from = nameMatch[1];
    map.to = nameMatch[2];
    map.ranges = [];
    lineNo += 1;

    while (lineNo < lines.length && lines[lineNo].length > 0){
        const rangeMatch = lines[lineNo].match(/([0-9]+) ([0-9]+) ([0-9]+)/);
        map.ranges.push({
            destStart: parseInt(rangeMatch[1]),
            sourceStart: parseInt(rangeMatch[2]),
            length: parseInt(rangeMatch[3])
        })
        lineNo += 1;
    }

    lineNo += 1;
    maps[map.from] = map;
}

while(lineNo < lines.length){
    readMap(lineNo);
}

function isInRange(range, num){
    return num >= range.sourceStart && num < range.sourceStart + range.length;
}

function mapWithRange(range, num){
    if(range){
        return range.destStart + num - range.sourceStart;
    } else {
        return num;
    }
}

function mapValue(map, value){
    const range = map.ranges.find(range => isInRange(range, value));
    return mapWithRange(range, value);
}

while(currentType != 'location'){
    const map = maps[currentType];
    values = values.map(value => mapValue(map, value));
    currentType = map.to;    
}
console.log(Math.min.apply(this, values));
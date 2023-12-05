import { readLines } from "../utils.mjs";

const lines = await readLines('input');

const seedConfig = lines[0].split(':')[1].trim().split(' ').map(s => parseInt(s));
const ranges = [];
for(let i = 0; i < seedConfig.length; i += 2){
    ranges.push({
        start: seedConfig[i],
        length: seedConfig[i+1]
    })
}
const total = ranges.reduce((sum, range) => sum+range.length, 0)
const percent = Math.floor(total/100);
let processed = 0;

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

let min = Infinity;

let currentRangeID = 0;
const startTime = Date.now();
while(currentRangeID < ranges.length){
    let currentRangePos = 0;
    while(currentRangePos < ranges[currentRangeID].length){
        let currentType = 'seed';
        let value = ranges[currentRangeID].start + currentRangePos;
        while(currentType != 'location'){
            const map = maps[currentType];
            value = mapValue(map, value);
            currentType = map.to;    
        }
        min = Math.min(min, value);
        currentRangePos++;
        processed++;
        if(processed%percent === 0){
            const now = Date.now();
            const timePassed = now-startTime;
            const timeNeeded = Math.round(timePassed/processed * total);
            const timeLeft = timeNeeded - timePassed;
            console.log(Math.floor(processed/total*100), timePassed, timeLeft, min);
        }
    }
    currentRangeID++;
}

console.log(min);
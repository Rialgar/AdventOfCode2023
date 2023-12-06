import { readLines } from "../utils.mjs";

const lines = await readLines('input');

const times = lines[0].split(':')[1].trim().split(/ +/).map(a => parseInt(a));
const records = lines[1].split(':')[1].trim().split(/ +/).map(a => parseInt(a));

function getDistance(raceTime, buttonTime){
    const travelTime = raceTime - buttonTime;
    return buttonTime*travelTime;
}

function countWaysToBeat(raceTime, record){
    let count = 0;
    for(let i = 1; i < raceTime; i++){
        if(getDistance(raceTime, i) > record){
            count += 1
        }
    }
    return count;
}

const waysToBeat = [];
for(let i = 0; i < times.length; i++){
    waysToBeat[i] = countWaysToBeat(times[i], records[i]);
}

console.log(waysToBeat);
console.log(waysToBeat.reduce((product, v) => product*v, 1));
import { readLines } from "../utils.mjs";

const lines = await readLines('input');

const time = parseInt(lines[0].split(':')[1].trim().split(/ +/).join(''));
const record = parseInt(lines[1].split(':')[1].trim().split(/ +/).join(''));

console.log(time);

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
        if(i % 627375 === 0){
            console.log(i/627375);
        }
    }
    return count;
}

console.log('result', countWaysToBeat(time, record));
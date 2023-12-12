import { readLines, select, sumArray } from "../utils.mjs";

const lines = await readLines('input');

function parseLine(line){
    const operational = [];
    const damaged = [];
    const unknown = [];
    let groups = [];
    for(let i = 0; i < line.length; i++){
        const char = line[i];
        if(char === ' '){
            groups = line.substring(i+1).split(',').map(v => parseInt(v));
            break;
        } else if(char === '.') {
            operational.push(i);
        } else if(char === '#') {
            damaged.push(i);
        } else if(char === '?') {
            unknown.push(i);
        }
    }
    return {
        operational,
        damaged,
        unknown,
        groups
    }
}

function checkGroups(damaged, groups){
    let currentGroupLength = 1;
    let currentGroupIndex = 0;
    for(let i = 1; i < damaged.length; i++){
        if(damaged[i] === damaged[i-1]+1){
            currentGroupLength += 1;
        } else if (currentGroupLength !== groups[currentGroupIndex]){
            return false;
        } else {
            currentGroupIndex += 1;
            currentGroupLength = 1;
        }
    }
    return currentGroupLength === groups[currentGroupIndex];
}

function countPossibilites(rowSpec) {
    const sum = sumArray(rowSpec.groups);
    const known = rowSpec.damaged.length;
    let valid = 0;
    for(let attempt of select(rowSpec.unknown, sum-known)){
        const damaged = rowSpec.damaged.concat(attempt).sort((a, b) => a-b);
        if(checkGroups(damaged, rowSpec.groups)){
            valid += 1;
        }
    }
    return valid;
}

const result = sumArray(lines.map(parseLine).map(countPossibilites));
console.log(result);
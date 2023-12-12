import { initArray, readLines, sumArray } from "../utils.mjs";

const lines = await readLines('input');

function unfold(line){
    const [springs, groups] = line.split(' ');
    return initArray(5, springs).join('?') + ' ' + initArray(5, groups).join(',');
};

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
        line: line.split(' ')[0],
        operational,
        damaged,
        unknown,
        groups
    }
}

let cache = {};

class MatchCounter {
    groupsToMatch = [];
    lineToMatch = '';
    targetLength = 0;

    position = 0;
    nextGroupIndex = 0;

    choicesMade = [];
    done = false;

    minimumFieldsNeeded = 0;
    lastGroup = false;    
    
    validCount = 0;

    constructor({line, groups}){
        this.lineToMatch = line;        
        this.targetLength = this.lineToMatch.length;
        this.groupsToMatch = groups;
        this.updateFieldsNeeded();
    }

    updateFieldsNeeded(){
        if(this.nextGroupIndex < this.groupsToMatch.length) {
            const groupsLeft = this.groupsToMatch.slice(this.nextGroupIndex);
            this.minimumFieldsNeeded = sumArray(groupsLeft) + groupsLeft.length-1;
        } else {
            this.minimumFieldsNeeded = 0;
        }
        this.lastGroup = this.nextGroupIndex == this.groupsToMatch.length -1 ? this.groupsToMatch[this.nextGroupIndex] : false;
    }

    step(){
        if(this.done){
            throw new Error(`Already done for ${this.lineToMatch} with groups ${this.groupsToMatch}, found ${this.validCount} options.`);
        } else if(this.position === this.targetLength){
            this.validCount++;
            this.backToLastChoice();
        } else if(this.minimumFieldsNeeded === 0 && !this.lineToMatch.substring(this.position).includes('#')){
            this.validCount++;
            this.backToLastChoice();
        } else if(this.minimumFieldsNeeded > this.targetLength - this.position){
            this.backToLastChoice();
        } else if(this.lastGroup && this.position + this.lastGroup === this.targetLength){
            //try matching the entire remaining string to the last group (or we would have exited above, we can exit here instead of advancing)
            const remainder = this.lineToMatch.substring(this.position)
            if(remainder.match(/^(#|\?)+$/)){
                this.validCount++;
            }
            this.backToLastChoice();
        } else if(this.lineToMatch[this.position] === '.'){
            this.position += 1;
        } else if(this.lineToMatch[this.position] === '#') {
            const nextGroup = this.groupsToMatch[this.nextGroupIndex];            
            const maybeMatch = this.lineToMatch.substring(this.position, this.position + nextGroup + 1);
            if(maybeMatch.match(/^(#|\?)+(\.|\?)$/)){
                this.position += nextGroup + 1;
                this.nextGroupIndex += 1;
                this.updateFieldsNeeded();
            } else {
                this.backToLastChoice();
            }
        } else {
            // next is ? check if the next group can match, if so, try that and mark that as a choice
            // if not, try operational, which is NOT a choice
            const nextGroup = this.groupsToMatch[this.nextGroupIndex];            
            const maybeMatch = this.lineToMatch.substring(this.position, this.position + nextGroup + 1);
            if(maybeMatch.match(/^(#|\?)+(\.|\?)$/)){
                this.choicesMade.push({
                    position: this.position,
                    nextGroupIndex: this.nextGroupIndex,
                });
                this.position += nextGroup + 1;
                this.nextGroupIndex += 1;
                this.updateFieldsNeeded();
            } else {
                this.position += 1;
            }
        }
        if(!this.done && !this.lastGroup){
            const lineLeft = this.lineToMatch.substring(this.position);
            const groupsLeft = this.groupsToMatch.slice(this.nextGroupIndex)

            const cacheKey = lineLeft + ' ' + groupsLeft.join(',');
            if(cache[cacheKey] === undefined){
                const subCounter = new MatchCounter({
                    line: lineLeft,
                    groups: groupsLeft
                })
                while(!subCounter.done){
                    subCounter.step();
                }
                cache[cacheKey] = subCounter.validCount;
            }
            this.validCount += cache[cacheKey];
            this.backToLastChoice();
        }
    }

    backToLastChoice(){
        // if there is no choice on the stack, we are done,
        // if not, pop the last choice and revert the state,
        // since we chose to try damaged for a ?, we try operational instead
        if(this.choicesMade.length === 0){
            this.done = true;            
        } else {
            const choiceUndone = this.choicesMade.pop();
            this.position = choiceUndone.position + 1;
            this.nextGroupIndex = choiceUndone.nextGroupIndex;
            this.updateFieldsNeeded();
        }
    }
}

function countPossibilites(rowSpec) {
    const counter = new MatchCounter(rowSpec);
    while(!counter.done){
        counter.step();
    }
    return counter.validCount;
}

const unfolded = lines.map(unfold);
const result = [];
unfolded.forEach((line, index) => {
    //clear cache to preserve memory
    cache = {};
    console.log(index, lines.length);
    console.log(line);
    const count = countPossibilites(parseLine(line));
    console.log(count);
    result.push(count);
});
console.log(result, sumArray(result));
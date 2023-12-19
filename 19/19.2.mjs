import { readLines } from "../utils.mjs";

const lines = await readLines('input');

const instructions = {};

class Rule {

    constructor({field, comparator, value, target}){
        this.field = field;
        this.comparator = comparator;
        this.value = value;
        this.target = target;
    }

    evaluate(part){
        switch (this.comparator){
            case '<':
                if(part[this.field] < this.value){
                    return this.target;
                }
            break;
            case '>':
                if(part[this.field] > this.value){
                    return this.target;
                }
            break;
            default:
                return this.target;
        }
        return false;
    }
}

const changePoints = {
    x: [4000],
    m: [4000],
    a: [4000],
    s: [4000]
}

let line = lines.shift();
while(line.length > 0){
    const outerMatch = line.match(/([a-z]+)\{([^}]+)\}/);
    const name = outerMatch[1];    
    const rulesString = outerMatch[2]
    const rules = rulesString.split(',').map(ruleString => {
        const ruleMatch = ruleString.match(/([xmas])([<>])([0-9]+):([a-z]+|A|R)/);
        if(ruleMatch){
            const rule = new Rule ({
                field: ruleMatch[1],
                comparator: ruleMatch[2],
                value: parseInt(ruleMatch[3]),
                target: ruleMatch[4]
            });
            changePoints[rule.field].push(rule.comparator == '<' ? rule.value-1 : rule.value);
            return rule;
        } else {
            return new Rule ({
                target: ruleString
            });
        }
    })
    instructions[name] = rules;

    line = lines.shift();
}

function onlyUnique(value, index, array) {
    return array.indexOf(value) === index;
}

console.log(changePoints.x.length * changePoints.m.length * changePoints.a.length * changePoints.s.length);

changePoints.x = changePoints.x.filter(onlyUnique);
changePoints.x.sort((a,b) => a-b);

changePoints.m = changePoints.m.filter(onlyUnique);
changePoints.m.sort((a,b) => a-b);

changePoints.a = changePoints.a.filter(onlyUnique);
changePoints.a.sort((a,b) => a-b);

changePoints.s = changePoints.s.filter(onlyUnique);
changePoints.s.sort((a,b) => a-b);

function processPart(part){
    let current = 'in';
    while(current !== 'R' && current !== 'A'){
        const rules = instructions[current];
        for(let rule of rules){
            const candidate = rule.evaluate(part);
            if(candidate){
                current = candidate;
                break;
            }
        }
    }    
    if(current === 'A'){
        return true;
    }
    return false;
}

let sum = 0;
for (let xIndex = 0; xIndex < changePoints.x.length; xIndex++) {
    console.log(xIndex, changePoints.x.length);
    const x = changePoints.x[xIndex];
    const xPrev = xIndex === 0 ? 0 : changePoints.x[xIndex-1];
    for (let mIndex = 0; mIndex < changePoints.m.length; mIndex++) {
        const m = changePoints.m[mIndex];
        const mPrev = mIndex === 0 ? 0 : changePoints.m[mIndex-1];
        for (let aIndex = 0; aIndex < changePoints.a.length; aIndex++) {
            const a = changePoints.a[aIndex];
            const aPrev = aIndex === 0 ? 0 : changePoints.a[aIndex-1];
            for (let sIndex = 0; sIndex < changePoints.s.length; sIndex++) {
                const s = changePoints.s[sIndex];
                const sPrev = sIndex === 0 ? 0 : changePoints.s[sIndex-1];
                const part = {x, m, a, s};
                if(processPart(part)){
                    sum += (x-xPrev) * (m-mPrev) * (a-aPrev) * (s-sPrev);
                }                
            }
        }
    }
}

console.log(sum);
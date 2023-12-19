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

let line = lines.shift();
while(line.length > 0){
    const outerMatch = line.match(/([a-z]+)\{([^}]+)\}/);
    const name = outerMatch[1];    
    const rulesString = outerMatch[2]
    const rules = rulesString.split(',').map(ruleString => {
        const ruleMatch = ruleString.match(/([xmas])([<>])([0-9]+):([a-z]+|A|R)/);
        if(ruleMatch){
            return new Rule ({
                field: ruleMatch[1],
                comparator: ruleMatch[2],
                value: parseInt(ruleMatch[3]),
                target: ruleMatch[4]
            })
        } else {
            return new Rule ({
                target: ruleString
            });
        }
    })
    instructions[name] = rules;

    line = lines.shift();
}

function readPart(line){
    const match = line.match(/\{x=([0-9]+),m=([0-9]+),a=([0-9]+),s=([0-9]+)\}/);
    return {
        x: parseInt(match[1]),
        m: parseInt(match[2]),
        a: parseInt(match[3]),
        s: parseInt(match[4])
    }
}

let sum = 0;
while(lines.length > 0){
    line = lines.shift();
    const part = readPart(line);
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
        sum += part.x;
        sum += part.m;
        sum += part.a;
        sum += part.s;
    }
}

console.log(sum);
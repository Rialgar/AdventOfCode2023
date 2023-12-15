import { initArrayFactory, readLines, sumArray } from "../utils.mjs";

const lines = await readLines('input');

const steps = lines[0].split(",");

function hash(string){
    let current = 0;
    for (let i = 0; i < string.length; i++) {
        current += string.charCodeAt(i);
        current *= 17;
        current %= 256;        
    }
    return current;
}

const boxes = initArrayFactory(256, () => []);

function addLens(label, focal){
    const box = boxes[hash(label)];
    const index = box.findIndex(lens => lens.label === label);
    if(index >= 0){
        box[index] = {label, focal};
    } else {
        box.push({label, focal});
    }
}

function removeLens(label){
    const box = boxes[hash(label)];
    const index = box.findIndex(lens => lens.label === label);
    if(index >= 0){
        box.splice(index, 1);
    }
}

steps.forEach(step => {
    const addInstruction = step.match(/^([a-z]+)=([0-9]+)$/);
    if(addInstruction){
        addLens(addInstruction[1], addInstruction[2]);
    } else {
        const removeInstruction = step.match(/^([a-z]+)-$/);
        if(removeInstruction){
            removeLens(removeInstruction[1]);
        } else {
            throw new Error(`No match for step: ${step}`)
        }
    }
});

let sum = 0;
boxes.forEach((box, boxIndex) => {
    box.forEach((lens, lensIndex) => {
        sum += (boxIndex + 1) * (lensIndex + 1) * lens.focal;
    });
});

console.log(sum);
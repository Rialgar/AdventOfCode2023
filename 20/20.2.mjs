import { readLines, smallest_common_multiple } from "../utils.mjs";

// % -> flipflop
//      ignores high, toggles on low, sends high when turning on, low when turning off
// & -> conjunction
//   -> on each pulse, if latest pulse of all inputs was low, send high, else low
// broadcast -> send low each iteration
class Module {
    constructor({name, type, outputs}){
        this.name = name;
        this.type = type;
        this.outputs = outputs;
        if(this.type === '%'){
            this.isOn = false;
        } else if (this.type === '&'){
            this.inputsHigh = {};
            this.inputList = [];
        }
    }

    connectInput(inputName){
        if(this.type === '&'){
            this.inputsHigh[inputName] = false;
            this.inputList.push(inputName);
        }
    }

    sendPulse(isHigh, source){
        if(this.type === '%'){
            if(!isHigh){
                this.isOn = !this.isOn;
                return this.outputs.map(target => ({
                    target,
                    source: this.name,
                    isHigh: this.isOn,
                }));
            } else {
                return [];
            }
        } else if(this.type === '&') {
            this.inputsHigh[source] = isHigh;
            const allHigh = this.inputList.every(name => this.inputsHigh[name]);
            return this.outputs.map(target => ({
                target,
                source: this.name,
                isHigh: !allHigh,
            }));
        } else { //broadcast
            return this.outputs.map(target => ({
                target,
                source: this.name,
                isHigh
            }));
        }
    }
}

const lines = await readLines('input');
const modules = {};
lines.forEach(line => {
    const [ id, outputList ] = line.split("->").map(part => part.trim());
    const [_, type, name] = id.match(/([%&])?([a-z]+)/);
    const outputs = outputList.split(',').map(part => part.trim());
    modules[name] = new Module({name, type, outputs});
});
Object.values(modules).forEach( module => {
    module.outputs.forEach(output => {
        if(modules[output]){
            modules[output].connectInput(module.name);
        }
    })
})

// I know that rx is connected to a single &qt
const timesHigh = {};
modules['qt'].inputList.forEach(name => {
    timesHigh[name] = [];
})
let buttonCount = 0;
while(buttonCount < 10000){ // verified it till 100000, but 10000 is sufficient to find the numbers
    buttonCount += 1;
    const pulses = [{isHigh: false, source: 'button', target: 'broadcaster'}];
    while(pulses.length > 0){
        const {isHigh, source, target} = pulses.shift();
        if(modules[target]){
            const result = modules[target].sendPulse(isHigh, source);
            pulses.push(...result);
            if(target === 'qt' && isHigh){
                timesHigh[source].push(buttonCount);
            }
        }
    }
}

Object.entries(timesHigh).forEach(([name, list]) => console.log(name, list));
Object.entries(timesHigh).forEach(([name, list]) => console.log(name, list.map(v => v/list[0])));

const loops = [];
Object.values(timesHigh).forEach((list) => loops.push(list[0]));
console.log(smallest_common_multiple(...loops));
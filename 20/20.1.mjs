import { readLines } from "../utils.mjs";

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

let highCount = 0;
let lowCount = 0;
for(let i = 0; i < 1000; i++){
    console.log(i, lowCount, highCount, lowCount*highCount);
    const pulses = [{isHigh: false, source: 'button', target: 'broadcaster'}];
    while(pulses.length > 0){
        const {isHigh, source, target} = pulses.shift();
        // console.log(source, isHigh ? '-high->' : '-low->', target);
        if(isHigh){
            highCount += 1;
        } else {
            lowCount += 1;
        }
        if(modules[target]){
            const result = modules[target].sendPulse(isHigh, source);
            pulses.push(...result);
        }
    }
}

console.log(1000, lowCount, highCount, lowCount*highCount);
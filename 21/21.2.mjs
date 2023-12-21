import { readMap } from "../utils.mjs";

const neighbours = [{x:-1, y:0}, {x:1, y:0}, {x:0, y:-1}, {x:0, y:1}];

// initWindow 2 is sufficient for input
// but 7 is needed for example, that seems to take longer to stabilize compared to map size
const initWindow = 2;
const maxSteps = 26501365;
const map = await readMap('input');
map.loop = true;

const start = map.find(v => v === 'S');

const checked = {};
const getCacheKey = ({x, y}) => `${x}:${y}`;

let reachable = [start];
const countsList = []
const stepsList = [];
let countEven = 0;
let countOdd = 0;

const initSteps = map.width * initWindow + maxSteps%map.width;

for(let steps = 0; steps <= initSteps; steps++){
    const prev = reachable;
    reachable = [];
    for(let field of prev){
        const cacheKey = getCacheKey(field);
        if(checked[cacheKey]){
            continue;
        }
        if(steps%2 === 0){
            countEven++;
        } else {
            countOdd++;
        }
        checked[cacheKey] = true;
        for(let n of neighbours){
            const next = map.get(field.x + n.x, field.y + n.y)
            if(next.data !== '#'){
                reachable.push(next);
            }
        }
    }
    if(steps%map.width === maxSteps%map.width){
        if(steps%2 === 0){
            countsList.push(countEven);
        } else {
            countsList.push(countOdd);
        }
        stepsList.push(steps);
        console.log(steps, countsList[countsList.length-1]);
    }
}

//console.log(stepsList, countsList);


const derivations = [countsList];
for(let i = 0; i<3; i++){
    const last = derivations[derivations.length-1];
    derivations.push(last.slice(0, last.length-1).map((v, index) => last[index+1]-v));
}

console.log(derivations);

function calculateMoreCycles(n){
    const d2 = derivations[2][initWindow-2];
    const d1_0 = derivations[1][initWindow-1]
    const d1_n = d1_0 + d2 * n;
    const d0_0 = derivations[0][initWindow];
    const d0_n = d0_0 + d1_0 * n + n*(n+1)/2 * d2;

    console.log(n, 0, d2, d1_n, d0_n);
    return d0_n;
}

const cycles = Math.floor(maxSteps/map.width) - initWindow;
console.log(calculateMoreCycles(cycles));

import { add3D, crossProduct3D, intersect2D, readLines, scale3D, vectorLengthSq3D, bigMath, intersectLinePlane3D, scaleInverse3D } from "../utils.mjs";

const lines = await readLines('input');
const stoneLines = [];

for(let line of lines){
    const [x, y, z, vx, vy, vz] = line
        .match(/^(-?[0-9]+), *(-?[0-9]+), *(-?[0-9]+) *@ *(-?[0-9]+), *(-?[0-9]+), *(-?[0-9]+)$/)
        .slice(1)
        .map(v => BigInt(parseInt(v)));
    stoneLines.push({position: {x, y, z}, velocity: {x: vx, y:vy, z:vz}});
}

function checkCandidate(candidate){
    for(let i = 0; i < stoneLines.length; i++){
        const intersection = intersect2D(stoneLines[i], candidate);
        if(!intersection){
            return false;
        }
        if(intersection === true){
            return false; //unlikely, let's hope this is not needed
        }
        if(intersection.t1 !== intersection.t2){
            return false;
        }
        const zC = intersection.t1 * candidate.velocity.z + candidate.position.z;
        const zS = intersection.t1 * stoneLines[i].velocity.z + stoneLines[i].position.z;
        if(zC !== zS){
            return false;
        }
    }
    return true;
}

const stoneA = stoneLines[0];

function makeGetValue(stoneB, stoneC, stoneD){
    const B = stoneB.position;
    const B1 = add3D(B, scale3D(stoneB.velocity, 1e11));
    const C = stoneC.position;
    const C1 = add3D(C, scale3D(stoneC.velocity, 1e11));
    const D = stoneD.position;
    const D1 = add3D(D, scale3D(stoneD.velocity, 1e11));

    return function getValue(tA){
        const A_tA = add3D(stoneA.position, scale3D(stoneA.velocity, tA));
        const minus_A_tA = scale3D(A_tA, -1);
        
        const n_B = crossProduct3D(add3D(B, minus_A_tA), add3D(B1, minus_A_tA)); // normal of plane with A_tA and line B
        const n_C = crossProduct3D(add3D(C, minus_A_tA), add3D(C1, minus_A_tA)); // normal of plane with A_tA and line C
        const n_D = crossProduct3D(add3D(D, minus_A_tA), add3D(D1, minus_A_tA)); // normal of plane with A_tA and line D

        // right angle to normal B and normal C, so inside both planes
        // -> direction of line through A_tA that intersects line B and line C
        const l_BC = crossProduct3D(n_B, n_C);

        // right angle to normal B and normal C, so inside both planes
        // -> direction of line through A_tA that intersects line B and line C
        const l_BD = crossProduct3D(n_B, n_D);

        // for our solution these need to be the same line, so the directions need to be parallel
        // so cross product needs to be 0. Let's use x coord to get a consistent sign.
        return crossProduct3D(l_BC, l_BD).x;
    }
}

function findSignChange(tBot, tTop, getValue){
    let vBot = getValue(tBot);
    let vTop = getValue(tTop);    
    while(tTop != tBot){
        const tMid = tBot + (tTop-tBot)/2n;
        if(tMid === tTop || tMid === tBot){
            break;
        }
        const vMid = getValue(tMid);
        if(vMid === 0n){
            tTop = tMid;
            tBot = tMid;
            vTop = 0n;
            vBot = 0n;
        } else if(vMid * vBot < 0n){
            tTop = tMid;
            vTop = vMid;
        } else if(vMid * vTop < 0n){
            tBot = tMid;
            vBot = vMid;
        } else {
            console.log(tBot, tMid, tTop, vBot, vMid, vTop);
            throw new Error("huh?!?");
        }
    }
    return [tBot, tTop, vBot, vTop];
}

// got start values by eyeballing in geogebra, use a couple different lines to do it with to check the results
let tA = false;
for(let i = 0; i < 100; i++){
    const a = 1+Math.floor(Math.random() * (stoneLines.length-1));
    let b = a;
    while(b === a){
        b = 1+Math.floor(Math.random() * (stoneLines.length-1));
    }
    let c = a;
    while(c === a || c === b){
        c = 1+Math.floor(Math.random() * (stoneLines.length-1));
    }
    const result = findSignChange(949000000000n, 951000000000n, makeGetValue(stoneLines[a], stoneLines[b], stoneLines[c]));
    if(result[0] != result[1] || result[2] !== 0n || result[3] !== 0n){
        console.log(a, b, c, result);
        throw new Error("non exact result!")
    }
    if(!tA){
        tA = result[0];
    } else if(tA != result[0]){
        console.log(a, b, c, result, tA);
        throw new Error("different result!")
    }
}

console.log(tA);

const A_tA = add3D(stoneA.position, scale3D(stoneA.velocity, tA));
const minus_A_tA = scale3D(A_tA, -1);

function getStartPoint(stoneB, stoneC){
    const B1 = add3D(stoneB.position, scale3D(stoneB.velocity, 1e11));
    const n_B = crossProduct3D(add3D(stoneB.position, minus_A_tA), add3D(B1, minus_A_tA));
    
    const tC = intersectLinePlane3D(stoneC.position, stoneC.velocity, A_tA, n_B);
    const C_tC = add3D(stoneC.position, scale3D(stoneC.velocity, tC));
    
    const AtoC = add3D(C_tC, minus_A_tA);
    const vP = scaleInverse3D(AtoC, tC-tA);
    
    const P0 = add3D(A_tA, scale3D(vP, -tA));
    return P0;
}

const P0 = getStartPoint(stoneLines[1], stoneLines[2]);
//do a couple to check they are the same
for(let i = 0; i < 100; i++){
    const a = 1+Math.floor(Math.random() * (stoneLines.length-1));
    let b = a;
    while(b === a){
        b = 1+Math.floor(Math.random() * (stoneLines.length-1));
    }
    const P0_2 = getStartPoint(stoneLines[a], stoneLines[b]);
    if(P0.x !== P0_2.x || P0.y !== P0_2.y, P0.z !== P0_2.z){
        console.log(P0, a, b, P0_2);
        throw new Error("different result!")
    }
}
console.log(P0.x + P0.y + P0.z);
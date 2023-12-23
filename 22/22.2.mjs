import { count } from "console";
import { readLines } from "../utils.mjs";

const lines = await readLines('input');

const allBricks = [];
for(let line of lines){
    const [x1, y1, z1, x2, y2, z2] = line.match(/^([0-9]+),([0-9]+),([0-9]+)~([0-9]+),([0-9]+),([0-9]+)$/).slice(1).map(v => parseInt(v));
    allBricks.push({
        start: {x: x1, y: y1, z: z1},
        end: {x: x2, y: y2, z: z2}
    });
}

for(let brick of allBricks){
    if(brick.start.x > brick.end.x || brick.start.y > brick.end.y || brick.start.z > brick.end.z){
        const temp = brick.start;
        brick.start = brick.end;
        brick.end = temp;
    }
}

allBricks.sort((a, b) => a.start.z - b.start.z);

class TowerOfBricks {
    constructor(allBricks){
        this.allBricks = allBricks;

        let maxX=0, maxY=0, maxZ=0;

        for(let brick of this.allBricks){
            maxX = Math.max(brick.start.x, brick.end.x, maxX);
            maxY = Math.max(brick.start.y, brick.end.y, maxY);
            maxZ = Math.max(brick.start.z, brick.end.z, maxZ);
        }

        this.occupation = [];
        for(let x = 0; x <= maxX; x++){
            this.occupation[x] = [];
            for(let y = 0; y <= maxY; y++){
                this.occupation[x][y] = [];
                for(let z = 0; z <= maxZ; z++){
                    this.occupation[x][y][z] = false;
                }
            }
        }

        for(let brick of this.allBricks){
            this.saveBrick(brick);
        }
    }

    setOccupation(brick, value){
        for(let x = brick.start.x; x <= brick.end.x; x++){
            for(let y = brick.start.y; y <= brick.end.y; y++){
                for(let z = brick.start.z; z <= brick.end.z; z++){
                    this.occupation[x][y][z] = value;
                }
            }
        }
    }

    saveBrick(brick){
        this.setOccupation(brick, brick);
    }

    removeBrick(brick){
        this.setOccupation(brick, false);
    }

    checkForBrick(brick, z, dz){
        let others = [];
        for(let x = brick.start.x; x <= brick.end.x; x++){
            for(let y = brick.start.y; y <= brick.end.y; y++){
                const maybeBrick = this.occupation[x][y][z+dz];
                if(maybeBrick && others.indexOf(maybeBrick) < 0){
                    others.push(maybeBrick);
                }
            }
        }
        return others;
    }

    checkForBrickBelow(brick){
        return this.checkForBrick(brick, brick.start.z, -1);
    }

    checkForBrickAbove(brick){
        return this.checkForBrick(brick, brick.end.z, 1);
    }

    settleOne(){
        let moved = [];
        for(let brick of this.allBricks){
            if(!brick.settled){
                if(brick.start.z === 1){
                    brick.settled = true;
                } else {
                    const below = this.checkForBrickBelow(brick);
                    if(below.length > 0){
                        brick.settled = true;
                    } else {
                        this.removeBrick(brick);
                        brick.start.z -= 1;
                        brick.end.z -= 1;
                        this.saveBrick(brick);
                        moved.push(brick);
                    }
                }
            }
        }
        return moved;
    }

    settleAll(){
        let moved = true;
        while( moved ) {
            moved = this.settleOne().length > 0;
        }
    }

    countBelow(brick){
        return this.checkForBrickBelow(brick).length;
    }
    
    countSaveBricks(){
        let counter = 0;
        for(let brick of this.allBricks){
            const above = this.checkForBrickAbove(brick);
            if(above.length == 0 || !above.some(brickAbove => this.countBelow(brickAbove) === 1)) {
                counter++;
            }
        }
        return counter;
    }
}

const settleTower = new TowerOfBricks(allBricks);
settleTower.settleAll();

console.log(settleTower.countSaveBricks());

let sum = 0;
for(let i = 0; i < allBricks.length; i++){
    const bricksCopy = allBricks.map(brick => ({start: {...brick.start}, end: {...brick.end}, settled: false}));
    const removed = bricksCopy.splice(i, 1);
    const tempTower = new TowerOfBricks(bricksCopy);

    const moved = tempTower.settleOne();
    sum += moved.length;

    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
    process.stdout.write(`${sum} ${i} ${allBricks.length}`);
}
process.stdout.write('\n');

console.log(sum);
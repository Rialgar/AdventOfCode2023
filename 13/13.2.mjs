import { readLines, sumArray } from "../utils.mjs";

const lines = await readLines('input');

//so we don't need post processing after the loop below
if(lines[lines.length-1].length > 0){
    lines.push('');
}

class Map{
    data = [];

    width = 0;
    height = 0;

    score = 0;

    constructor(data){
        this.data = data;
        this.height = this.data.length;
        this.width = this.height > 0 ? this.data[0].length : 0;
    }

    countColumnDifferences(x1, x2){
        if(x1 < 0 || x2 < 0 || x1 >= this.width || x2 >= this.width){
            return 0;
        }

        let count = 0;
        for(let y = 0; y < this.height; y++){
            if(this.data[y][x1] !== this.data[y][x2]){
                count += 1;
            }
        }

        return count;
    }

    countRowDifferences(y1, y2){
        if(y1 < 0 || y2 < 0 || y1 >= this.height || y2 >= this.height){
            return 0;
        }

        let count = 0;
        for(let x = 0; x < this.width; x++){
            if(this.data[y1][x] !== this.data[y2][x]){
                count += 1;
            }
        }

        return count;
    }

    isReflectionColumn(x){
        if(x < 0 || x+1 >= this.width){
            return false;
        }

        let count = 0;
        for(let i = 0; x+i+1 < this.width && x-i >= 0; i++){
            count += this.countColumnDifferences(x-i, x+i+1);
        }

        return count === 1;
    }

    isReflectionRow(y){
        if(y < 0 || y+1 >= this.height){
            return false;
        }

        let count = 0;
        for(let i = 0; y+i+1 < this.height && y-i >= 0; i++){
            count += this.countRowDifferences(y-i, y+i+1);
        }

        return count === 1;
    }

    calculateScore(){
        for(let x = 0; x+1 < this.width; x++){
            if(this.isReflectionColumn(x)){
                this.score = x+1;
                return;
            }
        }

        for(let y = 0; y+1 < this.height; y++){
            if(this.isReflectionRow(y)){
                this.score = (y+1) * 100;
                return;
            }
        }        
    }
}

const maps = [];

let buffer = [];
lines.forEach(line => {
    if(line.length == 0){
        maps.push(new Map(buffer));
        buffer = [];
    } else {
        buffer.push(line);
    }
});

maps.forEach(map => {
    map.calculateScore();
});
const scores = maps.map(map => map.score);
console.log(scores);
console.log(sumArray(scores));
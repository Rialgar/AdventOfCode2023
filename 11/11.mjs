import {readLines} from '../utils.mjs'

const EXPANSION = 1000000;

const lines = await readLines('input');

class StarMap { 
    rawData = [];
    galaxies = [];

    addGalaxy(x, y){
        this.galaxies.push({x, y, expandX: 0, expandY: 0});
    }

    parse(rawData){
        this.rawData = rawData;
        for(let y = 0; y < this.rawData.length; y++){
            for(let x = 0; x < this.rawData[y].length; x++){
                if(this.rawData[y][x] == '#'){
                    this.addGalaxy(x, y);
                }    
            }
        }
    }

    isEmptyColumn(rawX){
        for(let y = 0; y < this.rawData.length; y++){
            if(this.rawData[y][rawX] == '#'){
                return false;
            }
        }
        return true;
    }

    isEmptyRow(rawY){
        for(let x = 0; x < this.rawData[rawY].length; x++){
            if(this.rawData[rawY][x] == '#'){
                return false;
            }
        }
        return true;
    }

    expand(){
        for(let y = 0; y < this.rawData.length; y++){
            if(this.isEmptyRow(y)){
                this.galaxies.forEach(galaxy => {
                    if(galaxy.y > y){
                        galaxy.expandY += EXPANSION-1;
                    }
                });
            }
        }        
        for(let x = 0; x < this.rawData[0].length; x++){
            if(this.isEmptyColumn(x)){
                this.galaxies.forEach(galaxy => {
                    if(galaxy.x > x){
                        galaxy.expandX += EXPANSION-1;
                    }
                });
            }
        }
    }

    measure(){
        let sum = 0;
        this.galaxies.forEach((g1, i1) => {
            this.galaxies.forEach((g2, i2) => {
                if(i2 > i1){
                    const distX = Math.abs(g1.x + g1.expandX - g2.x - g2.expandX); 
                    const distY = Math.abs(g1.y + g1.expandY - g2.y - g2.expandY);
                    sum += distX + distY;
                }
            });
        });
        return sum;
    }
}

const map = new StarMap();
map.parse(lines);
map.expand();
console.log(map.measure());
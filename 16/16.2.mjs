import { initArrayFactory, readLines } from "../utils.mjs";

const lines = await readLines('input');
const height = lines.length;
const width = lines[0].length;

function countEnergized(startBeam){
    const beamMap = initArrayFactory(height, () => initArrayFactory(width, () => ({})));
    const beamTips = [startBeam];

    function getTile({x, y}){
        if(x < 0 || x >= width || y < 0 || y >= width){
            return null;
        } else {
            return lines[y][x];
        }
    }

    // .
    function move({x, y, facing}){
        switch(facing){
            case 'left':
                return {x: x-1, y, facing};
            case 'right':
                return {x: x+1, y, facing};
            case 'up':
                return {x, y: y-1, facing};
            case 'down':
                return {x, y: y+1, facing};
        }
    }

    // /
    function reflectSlash({x, y, facing}){
        switch(facing){
            case 'left':
                return move({x, y, facing: 'down'});
            case 'right':
                return move({x, y, facing: 'up'});
            case 'up':
                return move({x, y, facing: 'right'});
            case 'down':
                return move({x, y, facing: 'left'});
        }
    }

    // \
    function reflectBackSlash({x, y, facing}){
        switch(facing){
            case 'left':
                return move({x, y, facing: 'up'});
            case 'right':
                return move({x, y, facing: 'down'});
            case 'up':
                return move({x, y, facing: 'left'});
            case 'down':
                return move({x, y, facing: 'right'});
        }
    }

    function isHorizontal(facing){
        return facing === 'left' || facing === 'right';
    }


    // |
    function splitHorizontal({x, y, facing}){
        if(isHorizontal(facing)){
            return [move({x, y, facing: 'up'}), move({x, y, facing: 'down'})];
        } else {
            return [move({x, y, facing})];
        }
    }

    // -
    function splitVertical({x, y, facing}){
        if(!isHorizontal(facing)){
            return [move({x, y, facing: 'left'}), move({x, y, facing: 'right'})];
        } else {
            return [move({x, y, facing})];
        }
    }

    while(beamTips.length > 0){
        const beam = beamTips.shift();
        const tile = getTile(beam);

        if(!tile){
            continue
        }

        //console.log(beam.x, beam.y, width, height, tile);
        //console.log(beamMap);
        if(beamMap[beam.y][beam.x][beam.facing]){
            continue;
        }
        beamMap[beam.y][beam.x][beam.facing] = true;
        beamMap[beam.y][beam.x]['energized'] = true;

        switch(tile){
            case '.':
                beamTips.push(move(beam));
                break;
            case '/':
                beamTips.push(reflectSlash(beam));
                break;
            case '\\':
                beamTips.push(reflectBackSlash(beam));
                break;
            case '-':
                beamTips.push(...splitVertical(beam));
                break;
            case '|':
                beamTips.push(...splitHorizontal(beam));
                break;
        }
    }

    let count = 0;
    for(let x = 0; x < width; x++){
        for(let y = 0; y < height; y++){
            count += beamMap[y][x]['energized'] ? 1 : 0;
        }    
    }
    return count
}

let maxCount = 0;
for(let x = 0; x < width; x++){
    maxCount = Math.max(maxCount, countEnergized({x, y:0, facing:'down'}));
    maxCount = Math.max(maxCount, countEnergized({x, y:height-1, facing:'up'}));
}
for(let y = 0; y < height; y++){
    maxCount = Math.max(maxCount, countEnergized({x:0, y, facing:'right'}));
    maxCount = Math.max(maxCount, countEnergized({x:width-1, y, facing:'left'}));
}

console.log(maxCount);
import fs from 'node:fs/promises';
import { isInt8Array } from 'node:util/types';

export async function readLines(file){
    const contents = await fs.readFile(file, {encoding: 'utf8'});
    return contents.split('\n');
}

export function initArray(size, value){
    const arr = new Array(size);
    for(let i = 0; i <= size; i++){
        arr[i] = value;
    }
    return arr;
}
import fs from 'node:fs/promises';

export async function readLines(file){
    const contents = await fs.readFile(file, {encoding: 'utf8'});
    return contents.split('\n');
}
import { readLines } from "../utils.mjs";

const lines = await readLines('input');

const modules = {};
for(let line of lines){
    const [name, connectionString] = line.split(':').map(v => v.trim());
    const connections = connectionString.split(' ');
    if(!modules[name]){
        modules[name] = {connections: []};
    }
    for(let otherModule of connections){
        modules[name].connections.push(otherModule);
        if(!modules[otherModule]){
            modules[otherModule] = {connections: []};            
        }
        modules[otherModule].connections.push(name);
    }
}
const moduleList = Object.keys(modules);

function countConnections(from, to){
    let paths = [[from]];
    let completed = [];
    const used = {};
    let visited = {};
    while(paths.length > 0){
        const next = paths.shift();
        if(next.length === 2 && next[next.length-1] === to && completed.length > 0){
            //we will find this one over and over, just shortcut it
        } else if(next[next.length-1] === to){
            completed.push(next);
            for(let module of next){
                if(module != from){
                    used[module] = true;
                }
            }
            paths = [[from]];
            visited = {};
        } else if(!visited[next[next.length-1]] && !used[next[next.length-1]]){
            visited[next[next.length-1]] = true;
            paths.push(...modules[next[next.length-1]].connections.map(c => [...next, c]));
        }
    }
    return completed.length;
}

const start = moduleList[0];
const groupA = [start];
const groupB = [];
for(let target of moduleList.slice(1)){
    if(countConnections(start, target) > 3){
        groupA.push(target);
    } else {
        groupB.push(target);
    }
}

console.log(groupA.length, groupB.length, groupA.length * groupB.length);

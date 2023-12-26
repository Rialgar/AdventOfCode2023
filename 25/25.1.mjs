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
    const visited = {};
    while(paths.length > 0){
        const next = paths.shift();
        if(next[next.length-1] === to){
            completed.push(next);
            paths = paths.filter( p => !p.some(module => module != from && module != to && next.includes(module)));
        } else if(!visited[next[next.length-1]]){
            visited[next[next.length-1]] = true;
            paths.push(...modules[next[next.length-1]].connections.map(c => [...next, c]));
        }
    }
    return completed.length;
}

countConnections(moduleList[0], moduleList[1])

const group = [moduleList[0]];
const toProcess = [moduleList[0]];
const handled = {[moduleList[0]]: true};
while(toProcess.length > 0){
    console.log(group.length, toProcess.length, moduleList.length);
    const next = toProcess.shift();
    for(let name of moduleList){
        if(handled[name]){
            continue;
        }
        if(countConnections(next, name) > 3){
            handled[name] = true;
            group.push(name);
            toProcess.push(name);
        }
    }
}
console.log(group.length, moduleList.length-group.length, group.length * (moduleList.length-group.length));

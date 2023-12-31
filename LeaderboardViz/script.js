function formatNum(num, len=2, pad='0'){
    out = num.toString()
    while(out.length < len){
        out = pad + out;
    }
    return out;
}

function formatTime(totalseconds){
    const hours = Math.floor(totalseconds/60/60)
    const minutes = Math.floor((totalseconds - hours*60*60) / 60)
    const seconds = totalseconds - hours*60*60 - minutes*60
    return `${formatNum(hours, 3, ' ')}:${formatNum(minutes)}:${formatNum(seconds)}`
}

function formatDate(date){
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
}

let maxNameLen = 0

function formatName(name){
    out = name
    while(out.length < maxNameLen-1){
        out = ' ' + out + ' '
    }
    if(out.length < maxNameLen){
        out = ' ' + out
    }
    return out
}

const form = document.getElementById('form');

if(localStorage.json){
    form.json.value = localStorage.json
}

document.getElementById('Analyze').addEventListener('click', function (event) {
    event.preventDefault();
    json = form.json.value
    localStorage.json = json
    data = JSON.parse(json)
    console.log(data)
    days = [];
    for( let i=0; i < 25; i++){
        const day = {
            label: (i+1).toString(),
            first: [],
            second: []
        }
        for(playerId in data.members){
            maxNameLen = Math.max(maxNameLen, data.members[playerId].name.length);
            if(data.members[playerId].completion_day_level[day.label]){
                const playerDay = data.members[playerId].completion_day_level[day.label];
                if(playerDay && playerDay[1]){
                    day.first.push({
                        playerId: playerId,
                        name: data.members[playerId].name,
                        time: playerDay[1].get_star_ts
                    })
                }
                if(playerDay && playerDay[2]){
                    day.second.push({
                        playerId: playerId,
                        name: data.members[playerId].name,
                        time: playerDay[2].get_star_ts
                    })
                }
            }
        }
        days.push(day)
    }
    days.forEach(day => {
        day.first.sort((a, b) => a.time - b.time)
        day.second.sort((a, b) => a.time - b.time)

        const p1 = document.createElement('p');
        p1.className = 'privboard-row';
        p1.textContent = `${formatNum(day.label)}-1: `
        for(let i = 0; i < day.first.length; i++){
            if(i>0){
                delta = day.first[i].time - day.first[i-1].time
                p1.textContent += ` > ${formatTime(delta)} > `
            } else {
                const date = new Date(day.first[i].time * 1000)
                p1.textContent += `${formatDate(date)} > `
            }
            p1.textContent += formatName(day.first[i].name)
        }
        document.body.appendChild(p1)

        const p2 = document.createElement('p');
        p2.className = 'privboard-row';
        p2.textContent = `${formatNum(day.label)}-2: `
        for(let i = 0; i < day.second.length; i++){
            if(i>0){
                delta = day.second[i].time - day.second[i-1].time
                p2.textContent += ` > ${formatTime(delta)} > `
            } else {
                const date = new Date(day.second[i].time * 1000)
                p2.textContent += `${formatDate(date)} > `
            }
            p2.textContent += formatName(day.second[i].name)
        }
        document.body.appendChild(p2)
        form.style.display = 'none'
    });
});

document.getElementById('Timeline').addEventListener('click', function (event) {
    event.preventDefault();
    json = form.json.value
    localStorage.json = json
    data = JSON.parse(json)
    console.log(data)

    const container = document.createElement('div');
    document.body.appendChild(container);

    container.className = 'timeline';

    let offset = 10000;
    let zoom = 0.98;
    container.style.setProperty('--offset', offset);
    container.style.setProperty('--zoom', zoom);

    let maxNameLen = 0;
    let earliest = Number.MAX_SAFE_INTEGER;
    let latest = 0;
    for(member of Object.values(data.members)){
        maxNameLen = Math.max(maxNameLen, member.name.length);

        const rowContainer = document.createElement('div');
        container.appendChild(rowContainer);

        const nameDiv = document.createElement('div');
        nameDiv.textContent = member.name;
        rowContainer.appendChild(nameDiv);

        const row = document.createElement('div');
        rowContainer.appendChild(row);

        row.className = 'row';

        for(let [index, day] of Object.entries(member.completion_day_level)){
            if(day[1]){
                earliest = Math.min(earliest, day[1].get_star_ts);
                latest = Math.max(latest, day[1].get_star_ts);
                const star = document.createElement('a');
                row.appendChild(star);

                star.className = "privboard-star-firstonly timeline-item timeline-star";
                star.style.setProperty('--time', day[1].get_star_ts);
                star.textContent = "*";

                const date = new Date(day[1].get_star_ts * 1000);
                star.title = 'Day ' + index + ', Part 1, ' + formatDate(date);

                star.href = `https://adventofcode.com/${data.event}/day/${index}`;
            }
            if(day[2]){
                latest = Math.max(latest, day[2].get_star_ts);
                const star = document.createElement('a');
                row.appendChild(star);

                star.className = "privboard-star-both timeline-item timeline-star";
                star.style.setProperty('--time', day[2].get_star_ts);
                star.textContent = "*";

                const date = new Date(day[2].get_star_ts * 1000);
                star.title = 'Day ' + index + ', Part 2, ' + formatDate(date);

                star.href = `https://adventofcode.com/${data.event}/day/${index}`;
            }
        }

        row.addEventListener('wheel', (event) => {
            event.preventDefault();
            const mouseInRow = (event.clientX - row.clientLeft) / row.clientWidth;
            const mouseOffset = mouseInRow / zoom * (latest-earliest) - offset + earliest;
            if(event.deltaY < 0){
                zoom *= 1.05;
            } else {
                zoom /= 1.05;
            }
            const changedMouseOffset = mouseInRow / zoom * (latest-earliest) - offset + earliest;
            offset += changedMouseOffset - mouseOffset;
            container.style.setProperty('--offset', offset);
            container.style.setProperty('--zoom', zoom);
        });
        row.addEventListener('click', (event) => {
            offset = 10000;
            zoom = 0.98;
            container.style.setProperty('--offset', offset);
            container.style.setProperty('--zoom', zoom);
        })
    }

    const earliestStart = new Date(earliest*1000);
    if(earliestStart.getUTCHours() < 5){
        earliestStart.setUTCDate(earliestStart.getUTCDate()-1);
    }
    earliestStart.setUTCHours(5);

    const earliestLine = earliestStart.valueOf()/1000;

    for(let time = earliestLine; time < latest + 24*60*60; time += 24*60*60){
        const rows = Array.prototype.slice.apply(container.querySelectorAll('.row'));
        for(let row of rows){
            const line = document.createElement('div');
            line.className = 'timeline-item timeline-dateline';
            line.style.setProperty('--time', time);
            row.prepend(line);
        }
    }

    container.style.setProperty('--earliest', earliest);
    container.style.setProperty('--latest', latest);

    form.style.display = 'none'
})
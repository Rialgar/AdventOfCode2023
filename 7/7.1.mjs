import { initArray, readLines } from "../utils.mjs";

const HAND_SIZE = 5;
const CARDS = '23456789TJQKA';
const NUM_CARDS = CARDS.length;
const WEIGHTS = [];
for(let i = 0; i <= HAND_SIZE; i++){
    WEIGHTS[i] = Math.pow(NUM_CARDS, i);
}

const lines = await readLines('input');

function rateHand(hand) {
    let rating = 0;
    if(hand.length != HAND_SIZE){
        throw new Error('invalid hand: ', hand);
    }
    const counters = initArray(NUM_CARDS, 0);

    for(let i = 0; i < HAND_SIZE; i++){
        const card = hand[hand.length-i-1];
        const cardValue = CARDS.indexOf(card);
        if(cardValue < 0){
            throw new Error('invalid card: ', card, 'in hand: ', hand);
        }
        counters[cardValue] += 1;
        rating += cardValue * WEIGHTS[i];
    }

    const maxCounters = counters.filter(c => c>0).sort((a,b) => b-a);
    if(maxCounters[0] === 5){
        rating += 6 * WEIGHTS[HAND_SIZE];
    } else if(maxCounters[0] === 4){
        rating += 5 * WEIGHTS[HAND_SIZE];
    } else if(maxCounters[0] === 3 && maxCounters[1] === 2){
        rating += 4 * WEIGHTS[HAND_SIZE];
    } else if(maxCounters[0] === 3){
        rating += 3 * WEIGHTS[HAND_SIZE];
    } else if(maxCounters[0] === 2 && maxCounters[1] === 2){
        rating += 2 * WEIGHTS[HAND_SIZE];
    } else if(maxCounters[0] === 2){
        rating += 1 * WEIGHTS[HAND_SIZE];
    }
    return rating;
}

const handsAndBids = lines
    .map(line => line.split(' '))
    .map(([hand, bid]) => ({
        hand,
        bid:parseInt(bid),
        rating: rateHand(hand)
    }))
    .sort(({rating: a}, {rating: b}) => a-b);

console.log(handsAndBids);
let sum = 0;
for(let i = 0; i<handsAndBids.length; i++){
    const rank = i+1;
    sum += rank * handsAndBids[i].bid;
}
console.log(sum);
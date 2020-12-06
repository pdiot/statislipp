import { EXTERNALMOVES } from '../libs/constants';


export function getKeys(object) {
  return Object.keys(object);
}

export function getMoveName(moveId) {
  const move = EXTERNALMOVES.find(bm => bm.id === moveId);
  return move ? move.name : 'Weird move';
}

export function getStageName(stage) {
  if (stage === 'allStages') {
    return 'all stages';
  } else {
    return stage;
  }
}

export function removeLanding(landing) {
  return landing.split(' ')[0];
}

export function getTop3MostCommonMoves(moves) {
  let returnValue = [];
  let sortedMoves = moves.sort((moveA, moveB) => moveB.count - moveA.count);
  for (let i = 0; i < moves.length && i < 3; i++) {
    returnValue.push(sortedMoves[i]);
  }
  return returnValue;
}

export function minValueFromNumberArray(numbers) {
  let min;
  for (let num of numbers) {
    if (!min) {
      min = num;
    } else if (num < min) {
      min = num;
    }
  }
  return min;
}

export function maxValueFromNumberArray(numbers) {
  let max;
  for (let num of numbers) {
    if (!max) {
      max = num;
    } else if (num > max) {
      max = num;
    }
  }
  return max;
}

export function moyenneFromNumberArray(numbers) {
  let total = 0, count = 0;
  for (let num of numbers) {
    if (num) {
      total += num;
      count++;
    }
  }
  if (count !== 0) {
    return total / count;
  } else {
    return undefined;
  }
}
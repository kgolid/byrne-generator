import Chance from 'chance';

function getElementsFromArray(n, arr) {
  if (n > arr.length) return [];
  const chance = new Chance();
  return chance.shuffle(arr).slice(0, n);
}

function findCenter(points) {
  const x_min = Math.min(...points.map(pnt => pnt.x));
  const y_min = Math.min(...points.map(pnt => pnt.y));
  const x_max = Math.max(...points.map(pnt => pnt.x));
  const y_max = Math.max(...points.map(pnt => pnt.y));

  return [(x_min + x_max) / 2, (y_min + y_max) / 2];
}

export { getElementsFromArray, findCenter };

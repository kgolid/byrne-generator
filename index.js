import * as util from './util';
import * as trig from './trig';
import {
  Pnt,
  Line,
  Rectangle,
  Triangle,
  Circle,
  Angle,
  compareShapes,
  areConnected
} from './geom';

const paletteBright = {
  colors: ['#d94c18', '#f2b319', '#265899'],
  background: '#e8e7d4'
};

const palette = {
  colors: ['#c54514', '#dca215', '#23507f'],
  background: '#e8e7d4'
};

const fill_chance = 0.45;
const min_dim = 30;
const initial_dim = 150;
const angle_size = 50;
const number_of_steps = 15;
const done_pause = 8;

let sketch = function(p) {
  let THE_SEED;

  let points;
  let shapes;
  let steps;

  p.setup = function() {
    p.createCanvas(800, 800);
    THE_SEED = p.floor(p.random(9999999));
    p.randomSeed(THE_SEED);
    p.frameRate(8);
    p.strokeWeight(3);

    init_state();
  };

  p.draw = function() {
    if (steps >= number_of_steps) {
      if (steps >= number_of_steps + done_pause) {
        init_state();
      }
    } else {
      p.blendMode(p.BLEND);
      p.background(palette.background);
      p.blendMode(p.MULTIPLY);
      extendCollection(shapes, points);
      centerPoints(points, [p.width / 2, p.height / 2]);
      shapes.sort(compareShapes);
      shapes.forEach(shape => shape.display(p));
    }
    steps++;
  };

  p.keyPressed = function() {
    if (p.keyCode === 80) p.saveCanvas('sketch_' + THE_SEED, 'jpeg');
  };

  function init_state() {
    steps = 0;
    shapes = [];

    const p1pos = [Math.random() * p.width, Math.random() * p.height];
    const p2dir = Math.random() * Math.PI;
    const p2pos = trig.point_at_distance_and_angle(p1pos, initial_dim, p2dir);

    points = [new Pnt(...p1pos), new Pnt(...p2pos)];

    connectPointsWithLine(shapes, points[0], points[1], true, true);
  }

  function extendCollection(shapes, points) {
    let choice = Math.random();
    if (choice < 0.25) extendWithRectangle(shapes, points);
    else if (choice < 0.5) extendWithTriangle(shapes, points);
    else if (choice < 0.6) connectPointsWithCircleRandomly(shapes, points);
    else if (choice < 0.85) connectLinesWithAngle(shapes, points);
    else connectWithLineRandomly(shapes, points);
  }
};

function centerPoints(points, center) {
  const centering = util.findCenter(points);
  points.forEach(pnt => {
    pnt.x -= centering[0] - center[0];
    pnt.y -= centering[1] - center[1];
  });
}

function addPoint(points, x, y) {
  const pnt = new Pnt(x, y);
  points.push(pnt);
  return pnt;
}

function connectWithLineRandomly(coll, points) {
  const p1 = util.getElementFromArray(points);
  const independent = points.filter(pnt => !areConnected(p1, pnt, coll));
  if (independent.length == 0) return;

  const p2 = util.getElementFromArray(independent);
  connectPointsWithLine(coll, p1, p2, false, false);
}

function connectPointsWithCircleRandomly(coll, points) {
  const col = util.getElementFromArray(palette.colors);
  const [cp, rp] = util.getElementsFromArray(2, points);
  let radius = trig.dist([cp.x, cp.y], [rp.x, rp.y]);
  const circle = new Circle(cp, radius, col);
  coll.push(circle);
}

function connectPointsWithLine(coll, p1, p2, e_active, w_active) {
  const col = util.getElementFromArray(palette.colors);
  const line = new Line('solid', p1, p2, col, e_active, w_active);
  coll.push(line);
  return line;
}

function connectLinesWithAngle(coll, points) {
  const busyPoints = points
    .map(pnt => [
      pnt,
      coll.filter(s => s instanceof Line && (s.p1 == pnt || s.p2 == pnt))
    ])
    .filter(bp => bp[1].length > 1);

  if (busyPoints.length == 0) return;

  const pnt = util.getElementFromArray(busyPoints);
  const [l1, l2] = util.getElementsFromArray(2, pnt[1]);
  const angle1 = trig.angle_of_direction(
    pnt[0].toArray(),
    (l1.p1 == pnt[0] ? l1.p2 : l1.p1).toArray()
  );
  const angle2 = trig.angle_of_direction(
    pnt[0].toArray(),
    (l2.p1 == pnt[0] ? l2.p2 : l2.p1).toArray()
  );

  console.log(angle1, angle2, pnt);
  const col = util.getElementFromArray(palette.colors);

  if (
    trig.difference_between_angles(angle1, angle2) <
    trig.difference_between_angles(angle2, angle1)
  )
    coll.push(new Angle(pnt[0], angle_size, angle2, angle1, col));
  else {
    coll.push(new Angle(pnt[0], angle_size, angle1, angle2, col));
  }
}

function extendWithRectangle(coll, points) {
  const eligible = coll.filter(
    a => a instanceof Line && (a.e_active || a.w_active)
  );
  if (eligible.length == 0) return;

  const l1 = util.getElementFromArray(eligible);
  const p1 = l1.p1.toArray();
  const p2 = l1.p2.toArray();
  const angle = trig.angle_of_direction(p1, p2);
  const rotateWest = !l1.e_active || (l1.w_active && Math.random() < 0.5);
  const rotDir = rotateWest ? Math.PI / 2 : (3 * Math.PI) / 2;
  const rotDist = Math.max(min_dim, trig.dist(p1, p2) * (Math.random() + 0.15));

  const p3 = trig.point_at_distance_and_angle(p2, rotDist, angle + rotDir);
  const p4 = trig.point_at_distance_and_angle(p1, rotDist, angle + rotDir);
  const p3Obj = addPoint(points, ...p3);
  const p4Obj = addPoint(points, ...p4);
  const col = util.getElementsFromArray(1, palette.colors)[0];
  if (Math.random() < fill_chance)
    coll.push(new Rectangle(l1.p1, l1.p2, p3Obj, p4Obj, col));

  connectPointsWithLine(coll, l1.p2, p3Obj, rotateWest, !rotateWest);
  connectPointsWithLine(coll, p3Obj, p4Obj, rotateWest, !rotateWest);
  connectPointsWithLine(coll, p4Obj, l1.p1, rotateWest, !rotateWest);
  l1.e_active = l1.e_active && rotateWest;
  l1.w_active = l1.w_active && !rotateWest;
}

function extendWithTriangle(coll, points) {
  const eligible = coll.filter(
    a => a instanceof Line && (a.e_active || a.w_active)
  );
  const l1 = util.getElementFromArray(eligible);
  const p1 = l1.p1.toArray();
  const p2 = l1.p2.toArray();
  const angle = trig.angle_of_direction(p1, p2);
  const rotateWest = !l1.e_active || (l1.w_active && Math.random() < 0.5);
  const rotDir = rotateWest ? Math.PI / 2 : (3 * Math.PI) / 2;
  const rotDist = Math.max(min_dim, trig.dist(p1, p2) * (Math.random() + 0.15));

  const p3 = trig.point_at_distance_and_angle(
    Math.random() < 0.5 ? p1 : p2,
    rotDist,
    angle + rotDir
  );
  const p3Obj = addPoint(points, ...p3);

  const col = util.getElementFromArray(palette.colors);
  if (Math.random() < fill_chance)
    coll.push(new Triangle(l1.p1, l1.p2, p3Obj, col));

  connectPointsWithLine(coll, l1.p2, p3Obj, rotateWest, !rotateWest);
  connectPointsWithLine(coll, p3Obj, l1.p1, rotateWest, !rotateWest);
  l1.e_active = l1.e_active && rotateWest;
  l1.w_active = l1.w_active && !rotateWest;
}

// connectWithLine(p1,p2)
// connectWithArc(p1,p2)

// extendWithLine(p1)
// extendWithArc(p1)

// extendWithTriangle(l1)
// extendWithRectangle(l1)

new p5(sketch);

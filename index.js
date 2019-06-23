import * as util from './util';
import * as trig from './trig';
import * as tome from 'chromotome';
import { Pnt, Line, Rectangle, Triangle, Circle, compareShapes } from './geom';

const palette = {
  colors: [
    '#d94c18',
    '#f2b319',
    '#265899',
    '#d94c18',
    '#f2b319',
    '#265899',
    '#d94c18',
    '#f2b319',
    '#265899',
    '#000000'
  ],
  background: '#e8e7d4'
};

let sketch = function(p) {
  let THE_SEED;

  let points;
  let shapes;
  let steps;

  const padding = 300;

  p.setup = function() {
    p.createCanvas(800, 800);
    THE_SEED = p.floor(p.random(9999999));
    p.randomSeed(THE_SEED);
    p.frameRate(8);
    p.strokeWeight(3);

    init_state();
  };

  p.draw = function() {
    if (steps >= 15) {
      if (steps >= 25) {
        //p.saveCanvas('byrne', 'png');
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
    const p2pos = trig.point_at_distance_and_angle(p1pos, 120, p2dir);

    const p1 = new Pnt(p1pos[0], p1pos[1]);
    const p2 = new Pnt(p2pos[0], p2pos[1]);

    points = [p1, p2];

    connectPointsWithLine(shapes, points[0], points[1]);
  }

  function extendCollection(shapes, points) {
    let choice = Math.random();
    if (choice < 0.3) extendWithRectangle(shapes, points);
    else if (choice < 0.6) extendWithTriangle(shapes, points);
    else if (choice < 0.7) connectPointsWithCircleRandomly(shapes, points);
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
  const pair = util.getElementsFromArray(2, points);
  connectPointsWithLine(coll, ...pair);
}

function connectPointsWithCircleRandomly(coll, points) {
  const [cp, rp] = util.getElementsFromArray(2, points);
  let radius = trig.dist([cp.x, cp.y], [rp.x, rp.y]);
  let col = util.getElementsFromArray(1, palette.colors)[0];
  const circle = new Circle(cp, radius, col);
  coll.push(circle);
}

function connectPointsWithLine(coll, p1, p2) {
  const col = util.getElementsFromArray(1, palette.colors)[0];
  const line = new Line('solid', p1, p2, col);
  coll.push(line);
  return line;
}

function extendWithRectangle(coll, points) {
  const eligible = coll.filter(
    a => a instanceof Line && (a.e_active || a.w_active)
  );
  if (eligible.length == 0) return;

  const l1 = util.getElementsFromArray(1, eligible)[0];
  const p1 = [l1.p1.x, l1.p1.y];
  const p2 = [l1.p2.x, l1.p2.y];
  const angle = trig.angle_of_direction(p1, p2);
  const rotateWest = !l1.e_active || (l1.w_active && Math.random() < 0.5);
  const rotDir = rotateWest ? Math.PI / 2 : (3 * Math.PI) / 2;
  const rotDist = Math.max(20, trig.dist(p1, p2) * (Math.random() + 0.2));

  const p3 = trig.point_at_distance_and_angle(p2, rotDist, angle + rotDir);
  const p4 = trig.point_at_distance_and_angle(p1, rotDist, angle + rotDir);
  const p3Obj = addPoint(points, ...p3);
  const p4Obj = addPoint(points, ...p4);
  const col = util.getElementsFromArray(1, palette.colors)[0];
  if (Math.random() < 0.5)
    coll.push(new Rectangle(l1.p1, l1.p2, p3Obj, p4Obj, col));

  const l2 = connectPointsWithLine(coll, l1.p2, p3Obj);
  const l3 = connectPointsWithLine(coll, p3Obj, p4Obj);
  const l4 = connectPointsWithLine(coll, p4Obj, l1.p1);
  if (rotateWest) {
    l1.w_active = false;
    l2.w_active = false;
    l3.w_active = false;
    l4.w_active = false;
  } else {
    l1.e_active = false;
    l2.e_active = false;
    l3.e_active = false;
    l4.e_active = false;
  }
}

function extendWithTriangle(coll, points) {
  const eligible = coll.filter(
    a => a instanceof Line && (a.e_active || a.w_active)
  );
  const l1 = util.getElementsFromArray(1, eligible)[0];
  const p1 = [l1.p1.x, l1.p1.y];
  const p2 = [l1.p2.x, l1.p2.y];
  const angle = trig.angle_of_direction(p1, p2);
  const rotateWest = !l1.e_active || (l1.w_active && Math.random() < 0.5);
  const rotDir = rotateWest ? Math.PI / 2 : (3 * Math.PI) / 2;
  const rotDist = Math.max(20, trig.dist(p1, p2) * (Math.random() + 0.3));

  const p3 = trig.point_at_distance_and_angle(
    Math.random() < 0.5 ? p1 : p2,
    rotDist,
    angle + rotDir
  );
  const p3Obj = addPoint(points, ...p3);

  const col = util.getElementsFromArray(1, palette.colors)[0];
  if (Math.random() < 0.5) coll.push(new Triangle(l1.p1, l1.p2, p3Obj, col));

  const l2 = connectPointsWithLine(coll, l1.p2, p3Obj);
  const l3 = connectPointsWithLine(coll, p3Obj, l1.p1);

  if (rotateWest) {
    l1.w_active = false;
    l2.w_active = false;
    l3.w_active = false;
  } else {
    l1.e_active = false;
    l2.e_active = false;
    l3.e_active = false;
  }
}

// connectWithLine(p1,p2)
// connectWithArc(p1,p2)

// extendWithLine(p1)
// extendWithArc(p1)

// extendWithTriangle(l1)
// extendWithRectangle(l1)

new p5(sketch);

const Pnt = class {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  toArray() {
    return [this.x, this.y];
  }

  display(p) {
    p.stroke(0);
    p.noFill();
    p.ellipse(this.x, this.y, 8, 8);
  }
};

const Line = class {
  constructor(style, p1, p2, col, e_active, w_active) {
    this.p1 = p1;
    this.p2 = p2;
    this.style = style;
    this.col = col;
    this.e_active = e_active;
    this.w_active = w_active;
  }

  display(p) {
    p.blendMode(p.MULTIPLY);
    p.stroke(this.col);
    if (this.style == 'dashed') p.drawingContext.setLineDash(5, 15);
    p.line(this.p1.x, this.p1.y, this.p2.x, this.p2.y);
  }
};

const Rectangle = class {
  constructor(c1, c2, c3, c4, col) {
    this.c1 = c1;
    this.c2 = c2;
    this.c3 = c3;
    this.c4 = c4;
    this.col = col;
  }

  display(p) {
    p.blendMode(p.BLEND);
    p.noStroke();
    p.fill(this.col);
    p.beginShape();
    p.vertex(this.c1.x, this.c1.y);
    p.vertex(this.c2.x, this.c2.y);
    p.vertex(this.c3.x, this.c3.y);
    p.vertex(this.c4.x, this.c4.y);
    p.endShape(p.CLOSE);
  }
};

const Triangle = class {
  constructor(c1, c2, c3, col) {
    this.c1 = c1;
    this.c2 = c2;
    this.c3 = c3;
    this.col = col;
  }

  display(p) {
    p.blendMode(p.BLEND);
    p.noStroke();
    p.fill(this.col);
    p.beginShape();
    p.vertex(this.c1.x, this.c1.y);
    p.vertex(this.c2.x, this.c2.y);
    p.vertex(this.c3.x, this.c3.y);
    p.endShape(p.CLOSE);
  }
};

const Circle = class {
  constructor(c, r, col) {
    this.c = c;
    this.r = r;
    this.col = col;
  }

  display(p) {
    p.blendMode(p.MULTIPLY);
    p.stroke(this.col);
    p.noFill();
    p.ellipse(this.c.x, this.c.y, this.r * 2, this.r * 2);
  }
};

const Angle = class {
  constructor(c, size, angle1, angle2, col) {
    this.c = c;
    this.size = size;
    this.angle1 = angle1;
    this.angle2 = angle2;
    this.col = col;
  }

  display(p) {
    p.blendMode(p.BLEND);
    p.noStroke();
    p.fill(this.col);
    p.arc(this.c.x, this.c.y, this.size, this.size, this.angle1, this.angle2);
  }
};

const compareShapes = function(a, b) {
  return order(a) - order(b);
};

const order = function(a) {
  if (a instanceof Line) return 2;
  if (a instanceof Circle) return 2;
  if (a instanceof Angle) return 1;
  if (a instanceof Rectangle) return 0;
  if (a instanceof Triangle) return 0;
};

const areConnected = function(p1, p2, shapes) {
  if (p1 == p2) return true;
  return shapes.some(
    s => s instanceof Line && ((s.p1 == p1 && s.p2 == p2) || (s.p2 == p1 && s.p1 == p2))
  );
};

export { Pnt, Line, Triangle, Rectangle, Circle, Angle, compareShapes, areConnected };

const Pnt = class {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  display(p) {
    p.stroke(0);
    p.noFill();
    p.ellipse(this.x, this.y, 8, 8);
  }
};

const Line = class {
  constructor(style, p1, p2, col) {
    this.p1 = p1;
    this.p2 = p2;
    this.style = style;
    this.col = col;
    this.e_active = true;
    this.w_active = true;
  }

  display(p) {
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
    p.stroke(this.col);
    p.noFill();
    p.ellipse(this.c.x, this.c.y, this.r * 2, this.r * 2);
  }
};

const compareShapes = function(a, b) {
  if (a instanceof Line) return 1;
  if (a instanceof Circle) return 1;
  if (a instanceof Rectangle) return -1;
  if (a instanceof Triangle) return -1;
  return 0;
};

export { Pnt, Line, Triangle, Rectangle, Circle, compareShapes };

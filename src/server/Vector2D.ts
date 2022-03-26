'use strict';

export default class Vector2D {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  clone() {
    return new Vector2D(this.x, this.y);
  }

  add(other: Vector2D) {
    return new Vector2D(this.x + other.x, this.y + other.y);
  }

  floor(): Vector2D {
    return new Vector2D(Math.floor(this.x), Math.floor(this.y));
  }

  rotateAroundPoint(center: Vector2D): Vector2D {
    return new Vector2D(
      center.x - (this.y - center.y),
      center.y + (this.x - center.x)
    );
  }
};

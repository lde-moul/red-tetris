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
};

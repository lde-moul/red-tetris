'use strict';

export default interface Vector2D {
  x: number;
  y: number;
};

export const add2DVectors = (v1: Vector2D, v2: Vector2D): Vector2D => ({
  x: v1.x + v2.x,
  y: v1.y + v2.y
});

export const floor2DVector = (v: Vector2D): Vector2D => ({
  x: Math.floor(v.x),
  y: Math.floor(v.y)
});

export const rotatePoint = (point: Vector2D, center: Vector2D): Vector2D => ({
  x: center.x - (point.y - center.y),
  y: center.y + (point.x - center.x)
});

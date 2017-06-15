const toRadians = function(degree: number): number {
  return degree / 180.0 * Math.PI;
};

const unRotatePoint = function(rotation: number, point: Point, center: Point): Point {
  const { left, top } = point;
  const centerX = center.left;
  const centerY = center.top;

  const sinX = Math.sin(toRadians(rotation));
  const cosX = Math.cos(toRadians(rotation));

  return {
    left: centerX + (cosX * (left - centerX) + sinX * (top - centerY)),
    top: centerY + (-sinX * (left - centerX) + cosX * (top - centerY))
  };
};

const rotatePoint = function(rotation: number, point: Point, center: Point): Point {
  return unRotatePoint(-rotation, point, center);
};

const fromP1P3 = function(p1: Point, p3: Point): Rect {
  const left =  Math.min(p1.left, p3.left);
  const top = Math.min(p1.top, p3.top);
  const width = Math.abs(p1.left - p3.left);
  const height = Math.abs(p1.top - p3.top);

  return {
    left, top, width, height
  };
};

const fromP1P3WithRotation = function(p1: Point, p3: Point, rotation: number = 0): Rect {
  const center = {
    left: (p1.left + p3.left) / 2,
    top: (p1.top + p3.top) / 2
  };

  return fromP1P3(unRotatePoint(rotation, p1, center), unRotatePoint(rotation, p3, center));
};

const fromP2P4 = function (p2: Point, p4: Point) {
  const width = Math.abs(p4.left - p2.left);
  const height = Math.abs(p4.top - p2.top);

  const left = Math.max(p2.left, p4.left) - width;
  const top = Math.min(p2.top, p4.top);

  return {
    left,
    top,
    width,
    height
  };
};

const fromP2P4WithRotation = function(p2: Point, p4: Point, rotation: number = 0): Rect {
  const center = {
    left: (p2.left + p4.left) / 2,
    top: (p2.top + p4.top) / 2
  };

  return fromP2P4(unRotatePoint(rotation, p2, center), unRotatePoint(rotation, p4, center));
};

const fromC12C34WithRotation = function(c12: Point, c34: Point, rotation: number, width: number) {
  const center = {
    left: (c12.left + c34.left) / 2,
    top: (c12.top + c34.top) / 2
  };

  const origin12 = unRotatePoint(rotation, c12, center);
  const origin34 = unRotatePoint(rotation, c34, center);

  const height = Math.abs(origin12.top - origin34.top);

  return {
    left: Math.min(origin12.left, origin34.left) - width / 2,
    top: Math.min(origin12.top, origin34.top),
    width,
    height
  };
};

const fromC14C23WithRotation = function(c14: Point, c23: Point, rotation: number, height: number) {
  const center = {
    left: (c14.left + c23.left) / 2,
    top: (c14.top + c23.top) / 2
  };

  const origin12 = unRotatePoint(rotation, c14, center);
  const origin34 = unRotatePoint(rotation, c23, center);

  const width = Math.abs(origin12.left - origin34.left);

  return {
    left: Math.min(origin12.left, origin34.left),
    top: Math.min(origin12.top, origin34.top) - height / 2,
    width,
    height
  };
};

const TRANSFORM_MAP: any = {
  'n': { p1y: true },
  'w': { p1x: true },
  'e': { p3x: true },
  's': { p3y: true },
  'nw': { p1x: true, p1y: true },
  'ne': { p1y: true, p3x: true },
  'sw': { p3y: true, p1x: true },
  'se': { p3y: true, p3x: true }
};

const getDeltaOfVector = function(p1: Point, p2: Point, deltaX: number, deltaY: number) {
  const vector = {
    x: p1.left - p2.left,
    y: p1.top - p2.top
  };

  const vectorLength = Math.sqrt(vector.x * vector.x + vector.y * vector.y);

  const unitVector = {
    x: vector.x / vectorLength,
    y: vector.y / vectorLength
  };

  const factor = deltaX * unitVector.x + deltaY * unitVector.y;

  return {
    left: factor * unitVector.x,
    top: factor * unitVector.y
  };
};

export default class Rectangle {
  public left: number;
  public top: number;
  public width: number;
  public height: number;
  public rotation: number = 0;

  constructor(rect?: Rect, rotation?: number) {
    this.rotation = rotation;
    if (rect) {
      const { left, top, width, height } = rect;
      this.left = left;
      this.top = top;
      this.width = width;
      this.height = height;
    }
  }

  get center(): Point {
    const { left, top, width, height } = this;
    return {
      left: left + width / 2,
      top: top + height / 2
    };
  }

  get rotated(): boolean {
    return this.rotation !== undefined && this.rotation !== 0;
  }

  getPoint(type: PointType): Point {
    const { left, top, width, height } = this;

    let result: Point = {
      left: null,
      top: null
    };

    switch (type) {
      case 'nw':
      case 'ne':
      case 'n':
        result.top = top;
        break;
      case 'sw':
      case 's':
      case 'se':
        result.top = top + height;
        break;
      case 'w':
      case 'e':
        result.top = top + height / 2;
        break;
    }

    switch (type) {
      case 'nw':
      case 'sw':
      case 'w':
        result.left = left;
        break;
      case 'ne':
      case 'se':
      case 'e':
        result.left = left + width;
        break;
      case 'n':
      case 's':
        result.left = left + width / 2;
        break;
    }

    const rotation = this.rotation;

    if (rotation !== undefined && rotation !== 0) {
      const center = this.center;
      result = rotatePoint(rotation, result, center);
    }

    return result;
  }

  translate(deltaX: number = 0, deltaY: number = 0) {
    if (!this.rotated) {
      this.left += deltaX;
      this.top += deltaY;
    } else {
      const p1 = this.getPoint('nw');
      const p2 = this.getPoint('se');

      p1.left += deltaX;
      p1.top += deltaY;
      p2.left += deltaX;
      p2.top += deltaY;

      return fromP1P3WithRotation(p1, p2, this.rotation);
    }
  }

  reset(rect: Rect) {
    this.left = rect.left;
    this.top = rect.top;
    this.width = rect.width;
    this.height = rect.height;
  }

  dragPoint(type: string, deltaX: number = 0, deltaY: number = 0, startPoint: Point) {
    const transformMap = TRANSFORM_MAP[type];

    let p1 = this.getPoint('nw');
    let p3 = this.getPoint('se');

    const rotated = this.rotated;
    const rotation = this.rotation;

    if (rotated) {
      if (type === 's' || type === 'n') {
        const c12 = this.getPoint('n');
        const c34 = this.getPoint('s');

        const delta = getDeltaOfVector(c12, c34, deltaX, deltaY);

        if (type === 's') {
          c34.left += delta.left;
          c34.top += delta.top;
        } else if (type === 'n') {
          c12.left += delta.left;
          c12.top += delta.top;
        }

        return fromC12C34WithRotation(c12, c34, rotation, this.width);
      }

      if (type === 'e' || type === 'w') {
        const c14 = this.getPoint('w');
        const c23 = this.getPoint('e');

        const delta = getDeltaOfVector(c14, c23, deltaX, deltaY);

        if (type === 'e') {
          c23.left += delta.left;
          c23.top += delta.top;
        } else if (type === 'w') {
          c14.left += delta.left;
          c14.top += delta.top;
        }

        return fromC14C23WithRotation(c14, c23, rotation, this.height);
      }

      if (type === 'ne' || type === 'sw') {
        const p2 = this.getPoint('ne');
        const p4 = this.getPoint('sw');

        if (type === 'ne') {
          p2.left = startPoint.left + deltaX;
          p2.top = startPoint.top + deltaY;
        } else if (type === 'sw') {
          p4.left = startPoint.left + deltaX;
          p4.top = startPoint.top + deltaY;
        }

        return fromP2P4WithRotation(p2, p4, rotation);
      }
    }

    if (transformMap.p1x) {
      p1.left = startPoint.left + deltaX;
    }

    if (transformMap.p3x) {
      p3.left = startPoint.left + deltaX;
    }

    if (transformMap.p1y) {
      p1.top = startPoint.top + deltaY;
    }

    if (transformMap.p3y) {
      p3.top = startPoint.top + deltaY;
    }

    return fromP1P3WithRotation(p1, p3, rotation);
  }
};

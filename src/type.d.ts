declare interface Point {
  left: number;
  top: number;
}

declare interface Rect {
  left: number;
  top: number;
  width: number;
  height: number;
}

declare type PointType = 'nw' | 'ne' | 'se' | 'sw' | 'n' | 'e' | 's' | 'w';

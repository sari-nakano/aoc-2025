import { Edge, isPointInside } from "./edges.ts";
import { Point } from "./points.ts";

export class Rectangle {
  readonly point1: Point;
  readonly point2: Point;

  #edges: Edge[] | undefined;

  constructor(point1: Point, point2: Point) {
    this.point1 = point1;
    this.point2 = point2;
  }

  get area(): number {
    const dcol = Math.abs(this.point1.column - this.point2.column + 1);
    const drow = Math.abs(this.point1.row - this.point2.row + 1);
    return dcol * drow;
  }

  get minRow(): number {
    return Math.min(this.point1.row, this.point2.row);
  }

  get maxRow(): number {
    return Math.max(this.point1.row, this.point2.row);
  }

  get minColumn(): number {
    return Math.min(this.point1.column, this.point2.column);
  }

  get maxColumn(): number {
    return Math.max(this.point1.column, this.point2.column);
  }

  toEdges(): Edge[] {
    if (this.#edges) {
      return this.#edges;
    }

    this.#edges = [
      new Edge(
        { column: this.minColumn, row: this.minRow },
        { column: this.maxColumn, row: this.minRow },
      ),
      new Edge(
        { column: this.maxColumn, row: this.minRow },
        { column: this.maxColumn, row: this.maxRow },
      ),
      new Edge(
        { column: this.minColumn, row: this.maxRow },
        { column: this.maxColumn, row: this.maxRow },
      ),
      new Edge(
        { column: this.minColumn, row: this.minRow },
        { column: this.minColumn, row: this.maxRow },
      ),
    ];
    return this.#edges;
  }

  toString(): string {
    return `[${JSON.stringify(this.point1)}, ${JSON.stringify(this.point2)}]`;
  }
}

export function collectRectangles(tiles: Point[]): Rectangle[] {
  const rectangles: Rectangle[] = [];
  for (let ix1 = 0; ix1 < tiles.length; ix1++) {
    for (let ix2 = ix1 + 1; ix2 < tiles.length; ix2++) {
      rectangles.push(new Rectangle(tiles[ix1], tiles[ix2]));
    }
  }
  return rectangles;
}

export function isRectangleInside(
  rectangle: Rectangle,
  edges: Edge[],
): boolean {
  for (const rectEdge of rectangle.toEdges()) {
    for (const point of rectEdge.toPoints()) {
      if (!isPointInside(edges, point)) {
        return false;
      }
    }
  }
  return true;
}

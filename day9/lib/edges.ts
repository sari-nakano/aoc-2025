import { getPointColumnRange, getPointRowRange, Point } from "./points.ts";

export class Edge {
  readonly point1: Point;
  readonly point2: Point;
  readonly type: "column" | "row";

  #points: Point[] | undefined;

  constructor(point1: Point, point2: Point) {
    this.point1 = point1;
    this.point2 = point2;

    const sameColumn = this.point1.column === this.point2.column;
    const sameRow = this.point1.row === this.point2.row;
    if (sameColumn && sameRow) {
      throw new Error(`Zero size edge created.`);
    } else if (sameColumn) {
      this.type = "column";
    } else if (sameRow) {
      this.type = "row";
    } else {
      throw new Error(`An edge is neither a column nor a row.s`);
    }
  }

  toPoints(): Point[] {
    if (this.#points) {
      return this.#points;
    }

    const points: Point[] = [];
    if (this.type === "column") {
      const ce = this.asColumnEdge();
      for (let row = ce.minRow; row <= ce.maxRow; row++) {
        points.push({ column: ce.column, row });
      }
    } else if (this.type === "row") {
      const re = this.asRowEdge();
      for (let column = re.minColumn; column <= re.maxColumn; column++) {
        points.push({ column, row: re.row });
      }
    }
    this.#points = points;
    return points;
  }

  asColumnEdge(): { column: number; minRow: number; maxRow: number } {
    if (this.type !== "column") {
      throw new Error("This is not a column edge.");
    }

    return {
      column: this.point1.column,
      minRow: Math.min(this.point1.row, this.point2.row),
      maxRow: Math.max(this.point1.row, this.point2.row),
    };
  }

  asRowEdge(): { row: number; minColumn: number; maxColumn: number } {
    if (this.type !== "row") {
      throw new Error("This is not a row edge.");
    }

    return {
      row: this.point1.row,
      minColumn: Math.min(this.point1.column, this.point2.column),
      maxColumn: Math.max(this.point1.column, this.point2.column),
    };
  }
}

export function collectEdges(tiles: Point[]): Edge[] {
  const edges: Edge[] = [];
  for (let ix = 0; ix < tiles.length; ix++) {
    const nextIx = ix == tiles.length - 1 ? 0 : ix + 1;
    const tile1 = tiles[ix];
    const tile2 = tiles[nextIx];
    edges.push(new Edge(tile1, tile2));
  }
  return edges;
}

export function getEdgeColumnRange(edges: Edge[]): [number, number] {
  const points = edges.flatMap((e) => [e.point1, e.point2]);
  return getPointColumnRange(points);
}

export function getEdgeRowRange(edges: Edge[]): [number, number] {
  const points = edges.flatMap((e) => [e.point1, e.point2]);
  return getPointRowRange(points);
}

export function isPointInside(edges: Edge[], point: Point): boolean {
  const columnEdges = edges.filter((e) => e.type === "column").map((e) =>
    e.asColumnEdge()
  );

  const columnsToTheLeft = columnEdges.filter((ce) =>
    ce.column <= point.column &&
    ce.minRow <= point.row && point.row <= ce.maxRow
  );
  if (columnsToTheLeft.length == 0) {
    return false;
  }

  const columnsToTheRight = columnEdges.filter((ce) =>
    ce.column >= point.column &&
    ce.minRow <= point.row && point.row <= ce.maxRow
  );
  if (columnsToTheRight.length == 0) {
    return false;
  }

  const rowEdges = edges.filter((e) => e.type === "row").map((e) =>
    e.asRowEdge()
  );

  const rowsAbove = rowEdges.filter((re) =>
    re.row <= point.row && re.minColumn <= point.column &&
    point.column <= re.maxColumn
  );
  if (rowsAbove.length === 0) {
    return false;
  }

  const rowsBelow = rowEdges.filter((re) =>
    re.row >= point.row && re.minColumn <= point.column &&
    point.column <= re.maxColumn
  );
  if (rowsBelow.length === 0) {
    return false;
  }

  return true;
}

import { Edge } from "./edges.ts";
import { Rectangle } from "./rectangles.ts";

export function createDrawingGrid(
  maxColumn: number,
  maxRow: number,
): string[][] {
  return Array.from(
    { length: maxRow + 1 },
    () => Array(maxColumn + 1).fill("."),
  );
}

export function drawEdge(
  grid: string[][],
  edge: Edge,
  middle: string,
  end: string,
) {
  for (const point of edge.toPoints()) {
    grid[point.row][point.column] = middle;
  }
  grid[edge.point1.row][edge.point1.column] = end;
  grid[edge.point2.row][edge.point2.column] = end;
}

export function drawRectangle(
  grid: string[][],
  rectangle: Rectangle,
  sym: string,
) {
  for (const edge of rectangle.toEdges()) {
    drawEdge(grid, edge, sym, sym);
  }
}

export async function saveDrawingGrid(path: string, grid: string[][]) {
  const text = grid.map((r) => r.join("")).join("\n");
  await Deno.writeTextFile(path, text);
}

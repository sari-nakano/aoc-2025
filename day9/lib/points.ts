export type Point = {
  column: number;
  row: number;
};

export function parsePoints(text: string): Point[] {
  const lines = text.trim().split("\n");
  const tiles: Point[] = [];
  for (const line of lines) {
    const match = /^(\d+),(\d+)$/.exec(line);
    if (!match) {
      throw new Error(`Invalid tile: ${line}`);
    }
    tiles.push({ column: Number(match[1]), row: Number(match[2]) });
  }
  return tiles;
}

export async function parseInput(path: string): Promise<Point[]> {
  return parsePoints(await Deno.readTextFile(path));
}

export function getPointRowRange(points: Point[]): [number, number] {
  const minRow = Math.min(...points.map((p) => p.row));
  const maxRow = Math.max(...points.map((p) => p.row));
  return [minRow, maxRow];
}

export function getPointColumnRange(points: Point[]): [number, number] {
  const minColumn = Math.min(...points.map((p) => p.column));
  const maxColumn = Math.max(...points.map((p) => p.column));
  return [minColumn, maxColumn];
}

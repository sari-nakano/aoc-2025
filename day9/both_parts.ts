import { compressPoints, compressRectangle } from "./lib/compression.ts";
import {
  createDrawingGrid,
  drawEdge,
  drawRectangle,
  saveDrawingGrid,
} from "./lib/drawing.ts";
import { collectEdges } from "./lib/edges.ts";
import {
  getPointColumnRange,
  getPointRowRange,
  parseInput,
  Point,
} from "./lib/points.ts";
import { collectRectangles, isRectangleInside } from "./lib/rectangles.ts";

function findLargestArea(tiles: Point[]): number {
  const rectangles = collectRectangles(tiles);
  rectangles.sort((r1, r2) => r2.area - r1.area);
  return rectangles[0].area;
}

export async function findLargestGreenArea(tiles: Point[]): Promise<number> {
  const [compTiles, compressionMap] = compressPoints(tiles);
  const rectangles = collectRectangles(tiles);
  rectangles.sort((r1, r2) => r2.area - r1.area);

  const grid = createDrawingGrid(
    getPointColumnRange(compTiles)[1],
    getPointRowRange(compTiles)[1],
  );

  const compEdges = collectEdges(compTiles);

  compEdges.forEach((e) => drawEdge(grid, e, "#", "X"));

  for (let rix = 0; rix < rectangles.length; rix++) {
    if (rix % 1000 === 0) {
      console.log(`Checking rectangle ${rix}/${rectangles.length}`);
    }
    const compRect = compressRectangle(compressionMap, rectangles[rix]);
    if (isRectangleInside(compRect, compEdges)) {
      drawRectangle(grid, compRect, "O");
      await saveDrawingGrid("./output.txt", grid);
      return rectangles[rix].area;
    }
  }
  return -1;
}

async function main() {
  const inputPath = `${import.meta.dirname}/input.txt`;
  const tiles = await parseInput(inputPath);
  console.log(`Parsed ${tiles.length} tiles`);

  const largestArea = findLargestArea(tiles);
  console.log(`Largest area (part 1): ${largestArea}`);

  const largestGreenArea = await findLargestGreenArea(tiles);
  console.log(
    `Largest green area (part 2, doesn't work yet): ${largestGreenArea}`,
  );
}
if (import.meta.main) {
  main();
}

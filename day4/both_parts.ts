type PaperRollGrid = boolean[][];

/** Parses contents of the input file into a PaperRollGrid value. */
function parsePaperRollGrid(text: string): PaperRollGrid {
  const lines = text.trim().split("\n");

  const uniqueLineLengths = [...new Set(lines.map((l) => l.length))];
  if (uniqueLineLengths.length > 1) {
    throw new Error(
      `Line lengths differ in the input grid: ${uniqueLineLengths.join(", ")}`,
    );
  }

  return lines.map((line) => line.split("").map((c) => c === "@"));
}

/** Read and parses the input file by path. */
export async function parseInput(path: string): Promise<PaperRollGrid> {
  const input = await Deno.readTextFile(path);
  return parsePaperRollGrid(input);
}

/** Safely returns contents of the given position.
 * `true` if it contains a paper roll, `false` if empty, `undefined` if out of bounds.
 */
function getSpot(
  grid: PaperRollGrid,
  rowIx: number,
  spotIx: number,
): boolean | undefined {
  if (rowIx < 0 || rowIx >= grid.length) {
    return undefined;
  }

  if (spotIx < 0 || spotIx >= grid[rowIx].length) {
    return undefined;
  }

  return grid[rowIx][spotIx];
}

/** Counts paper rolls adjacent to the given position. */
function countAdjacent(
  grid: PaperRollGrid,
  rowIx: number,
  spotIx: number,
): number {
  const adjecent = [
    // Above
    getSpot(grid, rowIx - 1, spotIx - 1),
    getSpot(grid, rowIx - 1, spotIx),
    getSpot(grid, rowIx - 1, spotIx + 1),
    // Around
    getSpot(grid, rowIx, spotIx - 1),
    // We are here: rowIx, spotIx
    getSpot(grid, rowIx, spotIx + 1),
    // Below
    getSpot(grid, rowIx + 1, spotIx - 1),
    getSpot(grid, rowIx + 1, spotIx),
    getSpot(grid, rowIx + 1, spotIx + 1),
  ];
  return adjecent.filter((s) => s === true).length;
}

/** Returns positions of accessible paper rolls. */
function getAccessible(grid: PaperRollGrid): [number, number][] {
  const accessible: [number, number][] = [];
  for (let rowIx = 0; rowIx < grid.length; rowIx++) {
    const row = grid[rowIx];
    for (let spotIx = 0; spotIx < grid[rowIx].length; spotIx++) {
      const isPaperRoll = row[spotIx];
      if (isPaperRoll && countAdjacent(grid, rowIx, spotIx) < 4) {
        accessible.push([rowIx, spotIx]);
      }
    }
  }
  return accessible;
}

/** Returns a new grid with the paper roll removed at the given position. */
function removePaperRoll(
  grid: PaperRollGrid,
  rowIx: number,
  spotIx: number,
): PaperRollGrid {
  const gridCopy = [...grid];
  gridCopy[rowIx] = [...gridCopy[rowIx]];
  gridCopy[rowIx][spotIx] = false;
  return gridCopy;
}

/** Returns a new grid with the paper rolls removed at all given positions. */
function removePaperRollList(
  grid: PaperRollGrid,
  positions: [number, number][],
): PaperRollGrid {
  for (const [rowIx, spotIx] of positions) {
    grid = removePaperRoll(grid, rowIx, spotIx);
  }
  return grid;
}

/** Repeatedly removes accessible paper rolls until none remain, returning the total removed count. */
function cleanUpGrid(grid: PaperRollGrid): number {
  let removed = 0;
  while (true) {
    const accessible = getAccessible(grid);
    if (accessible.length === 0) {
      return removed;
    }

    removed += accessible.length;
    grid = removePaperRollList(grid, accessible);
  }
}

async function main() {
  const inputPath = `${import.meta.dirname}/input.txt`;
  const grid = await parseInput(inputPath);

  const accessibleCount = getAccessible(grid).length;
  console.log(`Accessible paper rolls (part 1): ${accessibleCount}`);

  const removedCount = cleanUpGrid(grid);
  console.log(`Removed paper rolls (part 2): ${removedCount}`);
}
if (import.meta.main) {
  main();
}

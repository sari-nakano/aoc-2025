/**
 * A list of indices at which splitters are located.
 * E.g. row [1, 4] corresponds to the following input row:
 * ".^..^."
 */
type SplitterRow = number[];

type Manifold = {
  startPosition: number;
  splitterRows: SplitterRow[];
};

async function parseInput(path: string): Promise<Manifold> {
  const lines = (await Deno.readTextFile(path)).trim().split("\n");
  if (lines.length < 2) {
    throw new Error("Input must contain at least 2 lines.");
  }

  const startPosition = lines[0].indexOf("S");
  if (startPosition < 0) {
    throw new Error("First line contains no start position.");
  }

  const splitterRows: SplitterRow[] = [];
  for (const splitterLine of lines.slice(1)) {
    const splitterPositions = splitterLine
      // "..^.^" => [".", ".", "^", ".", "^"]
      .split("")
      // [".", ".", "^", ".", "^"] =>
      // [[0, "."], [1, "."], [2, "^"], [3, "."], [4, "^"]]
      .map((c, ix): [string, number] => [c, ix])
      // [[0, "."], [1, "."], [2, "^"], [3, "."], [4, "^"]] =>
      // [[2, "^"], [4, "^"]]
      .filter(([c, _]) => c === "^")
      // [[2, "^"], [4, "^"]] => [2, 4]
      .map(([_, ix]) => ix);
    splitterRows.push(splitterPositions);
  }

  return { startPosition, splitterRows };
}

function sendTachyonBeam(
  manifold: Manifold,
): { totalSplits: number; totalTimelines: number } {
  // Map tachyon position in a row to number of timelines that lead to this position.
  //
  // For example, given tachyons in this positions:
  // ..T.T.. [2, 4]
  //
  // Given that they come to these positions from a single timeline each:
  // tachyonTimelines = (2 => 1 | 4 => 1);
  //
  // When they rncounter this row of splitters:
  // ..^.^..
  //
  // They split this way:
  // .T.T.T. [1, 3, 5]
  //
  // Edge positions can only come from singular timelines but 2 timelines
  // lead to the middle positions now. So timeline count becomes:
  // tachyonTimelines = (1 => 1 | 3 => 2 | 5 => 1);
  //
  // Calculating timeline counts by positions at the end of the manifold
  // we can get total number tachyon timelines.
  let tachyonTimelines: Map<number, number> = new Map();
  tachyonTimelines.set(manifold.startPosition, 1);

  let totalSplits = 0;
  for (const splitterRow of manifold.splitterRows) {
    const newTimelines = new Map(tachyonTimelines);
    for (const splitterPosition of splitterRow) {
      if (newTimelines.has(splitterPosition)) {
        // Remove the tachyon from the splitter's position.
        const timelines = newTimelines.get(splitterPosition)!;
        newTimelines.delete(splitterPosition);

        // Copy it to the left, summing up timeline counts.
        const leftTimelines = newTimelines.get(splitterPosition - 1) || 0;
        newTimelines.set(splitterPosition - 1, leftTimelines + timelines);

        // Copy it to the right, summing up timeline counts.
        const rightTimelines = newTimelines.get(splitterPosition + 1) || 0;
        newTimelines.set(splitterPosition + 1, rightTimelines + timelines);

        totalSplits++;
      }
    }
    tachyonTimelines = newTimelines;
  }

  const totalTimelines = tachyonTimelines.values().reduce((a, b) => a + b, 0);
  return { totalSplits, totalTimelines };
}

async function main() {
  const inputPath = `${import.meta.dirname}/input.txt`;
  const manifold = await parseInput(inputPath);
  console.log(
    `Parsed manifold of ${manifold.splitterRows.length} rows, starting position ${manifold.startPosition}`,
  );

  const { totalSplits, totalTimelines } = sendTachyonBeam(manifold);
  console.log(`Total splits (part 1): ${totalSplits}`);
  console.log(`Total timelines (part 2): ${totalTimelines}`);
}
if (import.meta.main) {
  main();
}

// Input contains large numbers but they all safely fit into JS floats,
// so we use `number` instead of `BigInt`.
type Inventory = {
  freshRanges: [number, number][];
  stock: number[];
};

/** Read and parses the input file by path. */
export async function parseInput(path: string): Promise<Inventory> {
  const input = (await Deno.readTextFile(path)).trim();
  const sections = input.split("\n\n");
  if (sections.length != 2) {
    throw new Error(`Invalid number of sections: ${sections.length}`);
  }

  const [freshSection, stockSection] = sections;

  const freshRanges: [number, number][] = [];
  for (const rangeLine of freshSection.split("\n")) {
    const match = /^(\d+)-(\d+)$/.exec(rangeLine);
    if (!match) {
      throw new Error(`Invalid range: ${rangeLine}`);
    }
    freshRanges.push([Number(match[1]), Number(match[2])]);
  }

  const stock: number[] = [];
  for (const line of stockSection.split("\n")) {
    const id = Number(line);
    if (Number.isNaN(id)) {
      throw new Error(`Invalid ingredient id: ${line}`);
    }
    stock.push(id);
  }

  return { freshRanges, stock };
}

/**
 * Combines intersecting ranges so that the resulting range collection
 * doesn't contain any more intersections.
 *
 * Counting total number of fresh IDs is easy after compaction.
 *
 * For example:
 * ```
 * compactFreshRanges([[1, 5], [3, 10], [11, 13]]);
 * // => [[1, 10], [11, 13]]
 * ```
 */
function compactFreshRanges(ranges: [number, number][]): [number, number][] {
  if (ranges.length === 0) {
    return [];
  }

  // Make a copy for modification.
  ranges = [...ranges];

  // Sort by the start values
  ranges.sort((a, b) => a[0] - b[0]);

  const compactRanges = [ranges[0]];
  for (const range of ranges.slice(1)) {
    const lastRange = compactRanges.at(-1)!;
    if (range[0] <= lastRange[1]) {
      // Ranges intersect, combine them
      const newStart = lastRange[0];
      const newEnd = Math.max(lastRange[1], range[1]);
      const newRange: [number, number] = [newStart, newEnd];
      compactRanges[compactRanges.length - 1] = newRange;
    } else {
      // Ranges do not intersect
      compactRanges.push(range);
    }
  }
  return compactRanges;
}

function isFresh(inventory: Inventory, ing: number): boolean {
  for (const [rangeFrom, rangeTo] of inventory.freshRanges) {
    if (rangeFrom <= ing && ing <= rangeTo) {
      return true;
    }
  }
  return false;
}

function getFreshIngredients(inventory: Inventory): number[] {
  return inventory.stock.filter((ing) => isFresh(inventory, ing));
}

function countFreshIds(inventory: Inventory): number {
  const compactRanges = compactFreshRanges(inventory.freshRanges);
  let count = 0;
  for (const [rangeFrom, rangeTo] of compactRanges) {
    count += rangeTo - rangeFrom + 1;
  }
  return count;
}

async function main() {
  const inputPath = `${import.meta.dirname}/input.txt`;
  const inventory = await parseInput(inputPath);

  const freshIngredients = getFreshIngredients(inventory);
  console.log(`Fresh ingredients (part 1): ${freshIngredients.length} pc.`);

  const freshIdCount = countFreshIds(inventory);
  console.log(`Fresh IDs (part 2): ${freshIdCount} pc.`);
}
if (import.meta.main) {
  main();
}

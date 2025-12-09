type Box = { x: number; y: number; z: number };

/** Stores boxes using their indices as IDs and provides API to calculate distances. */
class BoxSet {
  #boxes: Box[];
  #distanceIndex: Map<string, number> = new Map();

  constructor(boxes: Box[]) {
    this.#boxes = boxes;
  }

  get(index: number): Box {
    return this.#boxes[index];
  }

  get size(): number {
    return this.#boxes.length;
  }

  *indices(): Generator<number> {
    for (let ix = 0; ix < this.#boxes.length; ix++) {
      yield ix;
    }
  }

  indexDistances() {
    for (let ix1 = 0; ix1 < this.#boxes.length; ix1++) {
      for (let ix2 = ix1 + 1; ix2 < this.#boxes.length; ix2++) {
        const box1 = this.#boxes[ix1];
        const box2 = this.#boxes[ix2];
        const connectionKey = toConnectionKey(ix1, ix2);
        const distance = getDistance(box1, box2);
        this.#distanceIndex.set(connectionKey, distance);
      }
    }
  }

  closestPairs(): { ix1: number; ix2: number; distance: number }[] {
    const pairs = this.#distanceIndex.entries().map(([key, distance]) => {
      const [ix1, ix2] = fromConnectionKey(key);
      return { ix1, ix2, distance };
    }).toArray();
    pairs.sort((e1, e2) => e1.distance - e2.distance);
    return pairs;
  }
}

/** A collection of connected boxes. */
class Circuit {
  // Maps a box index to a set of indices it's connected to.
  #boxes: Set<number> = new Set();
  #links: Map<number, Set<number>> = new Map();

  static merge(children: Circuit[]): Circuit {
    const merged = new Circuit();
    for (const child of children) {
      child.#boxes.forEach((b) => merged.add(b));

      child.#links.entries().forEach(([boxIx, connections]) => {
        connections.forEach((c) => merged.connect(boxIx, c));
      });
    }
    return merged;
  }

  get size(): number {
    return this.#boxes.size;
  }

  contains(boxIx: number) {
    return this.#boxes.has(boxIx);
  }

  add(boxIx: number) {
    this.#boxes.add(boxIx);
  }

  connect(ix1: number, ix2: number) {
    this.#boxes.add(ix1);
    this.#boxes.add(ix2);

    let links1 = this.#links.get(ix1);
    if (links1 === undefined) {
      links1 = new Set();
      this.#links.set(ix1, links1);
    }
    links1.add(ix2);

    let links2 = this.#links.get(ix2);
    if (links2 === undefined) {
      links2 = new Set();
      this.#links.set(ix2, links2);
    }
    links2.add(ix1);
  }
}

/** Parses a line from the input into a box. */
function parseBox(line: string): Box {
  const match = /^(\d+),(\d+),(\d+)$/.exec(line);
  if (!match) {
    throw new Error(`Invalid box: ${line}`);
  }
  return {
    x: Number(match[1]),
    y: Number(match[2]),
    z: Number(match[3]),
  };
}

/** Parses whole input into a box set. */
async function parseInput(path: string): Promise<BoxSet> {
  const lines = (await Deno.readTextFile(path)).trim().split("\n");
  if (lines.length < 2) {
    throw new Error("Input must contain at least 2 lines.");
  }

  const boxSet = new BoxSet(lines.map((l) => parseBox(l)));
  boxSet.indexDistances();
  return boxSet;
}

/** Converts box indices into a string identifier of the connection between them.
 *
 * Can be used as a key in maps and sets.
 */
function toConnectionKey(boxId1: number, boxId2: number): string {
  const minId = Math.min(boxId1, boxId2);
  const maxId = Math.max(boxId1, boxId2);
  return `${minId}:${maxId}`;
}

/** Does the opposite of toConnectionKey. */
function fromConnectionKey(key: string): [number, number] {
  const match = /^(\d+):(\d+)$/.exec(key);
  if (!match) {
    throw new Error(`Invalid key: "${key}"`);
  }
  return [Number(match[1]), Number(match[2])];
}

/** Calculates distance between 2 boxes, */
function getDistance(box1: Box, box2: Box): number {
  return Math.sqrt(
    ((box1.x - box2.x) ** 2) +
      ((box1.y - box2.y) ** 2) +
      ((box1.z - box2.z) ** 2),
  );
}

/** Given a set of boxes, create an individual circuit for each box. */
function createInitialCircuits(boxSet: BoxSet): Circuit[] {
  return boxSet.indices().map((boxIx) => {
    const c = new Circuit();
    c.add(boxIx);
    return c;
  }).toArray();
}

/**
 * Connects boxes by given indices. Returns an updated array of circuits
 * which includes the new connection. Might merge 2 circuits into one if they
 * become connected.
 */
function connectCircuits(
  circuits: Circuit[],
  boxIx1: number,
  boxIx2: number,
): Circuit[] {
  const newCircuits: Circuit[] = [];
  const mergableCircuits: Circuit[] = [];
  for (const circuit of circuits) {
    if (circuit.contains(boxIx1) || circuit.contains(boxIx2)) {
      mergableCircuits.push(circuit);
    } else {
      newCircuits.push(circuit);
    }
  }
  newCircuits.push(Circuit.merge(mergableCircuits));
  return newCircuits;
}

function solvePart1(boxSet: BoxSet) {
  // Connect first 1000 pairs of boxes closest by distance.
  let circuits = createInitialCircuits(boxSet);
  // closestPairs suspected complexity: O(n^2 log n)
  // (It sorts an array of size O(n^2), where n is number of boxes in the input)
  for (const pair of boxSet.closestPairs().slice(0, 1000)) {
    // Connecting should be done in about O(n):
    // 1. It traverses the list of circuits once.
    // 2. Membership checks are constant time.
    // 3. During merge it traverses lists of nodes and edges once.
    circuits = connectCircuits(circuits, pair.ix1, pair.ix2);
  }

  // Sort the resulting circuits by size and select 3 largest.
  const largestCircuits = circuits
    .sort((c1, c2) => c2.size - c1.size)
    .slice(0, 3);

  const product = largestCircuits[0].size *
    largestCircuits[1].size *
    largestCircuits[2].size;
  console.log(`3 largest circuits' product (part 1): ${product}`);
}

function solvePart2(boxSet: BoxSet) {
  // Connect ALL of the box pairs starting from the closest.
  let circuits = createInitialCircuits(boxSet);
  for (const pair of boxSet.closestPairs()) {
    circuits = connectCircuits(circuits, pair.ix1, pair.ix2);

    // As soon as we merge last 2 remaining circuits, record the connected boxes and leave.
    if (circuits.length === 1) {
      const box1 = boxSet.get(pair.ix1);
      const box2 = boxSet.get(pair.ix2);
      console.log(
        `X product of last 2 connected boxes (part 2): ${box1.x * box2.x}`,
      );
      break;
    }
  }
}

async function main() {
  const inputPath = `${import.meta.dirname}/input.txt`;
  // Parsing complexity:
  // O(n) - parsing
  // O(n^2) - distance indexing
  const boxSet = await parseInput(inputPath);
  console.log(`Parsed ${boxSet.size} boxes`);

  solvePart1(boxSet);
  solvePart2(boxSet);
}
if (import.meta.main) {
  main();
}

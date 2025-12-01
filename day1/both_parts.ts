type Turn = {
  dir: "left" | "right";
  clicks: number;
};

/**
 * Parse a line from the input file into a Turn object.
 *
 * ```
 * parseTurn("L123");  // => {dir: "left", clicks: 123}
 * parseTurn("R456");  // => {dir: "right", clicks: 456}
 * ```
 */
function parseTurn(line: string): Turn {
  const match = /(L|R)(\d+)/.exec(line.trim());
  if (!match) {
    throw new Error(`Can't parse a turn: "${line}"`);
  }

  const [_, dir, clicksStr] = match;
  if (dir === "L") {
    return { dir: "left", clicks: Number(clicksStr) };
  } else if (dir === "R") {
    return { dir: "right", clicks: Number(clicksStr) };
  } else {
    throw new Error(`Unexpected direction: "${dir}"`);
  }
}

/** Reads and parses the input file into an array of Turn objects. */
async function readInput(path: string): Promise<Turn[]> {
  const input = await Deno.readTextFile(path);
  const turns: Turn[] = [];
  for (const line of input.split("\n")) {
    const cleanLine = line.trim();
    if (!cleanLine) {
      continue;
    }

    turns.push(parseTurn(line));
  }
  return turns;
}

/** Applies a rotations to the dial. Returns the new dial position and number
 * of times the dial has clicked on zero during this rotation.
 *
 * ```
 * turnDial(50, {dir: 'right', clicks: 10});
 * // => [60, 0];
 *
 * turnDial(50, {dir: 'left', clicks: 270});
 * // => [80, 3];
 * ```
 */
function turnDial(currentPosition: number, turn: Turn): [number, number] {
  if (turn.dir === "right") {
    let newPosition = currentPosition + turn.clicks;
    let zeroes = 0;
    while (newPosition > 99) {
      newPosition -= 100;
      zeroes++;
    }
    return [newPosition, zeroes];
  } else if (turn.dir === "left") {
    let newPosition = currentPosition - turn.clicks;
    let zeroes = 0;
    while (newPosition < 0) {
      newPosition += 100;
      zeroes++;
    }
    if (currentPosition === 0) {
      zeroes--;
    }
    if (newPosition === 0) {
      zeroes++;
    }
    return [newPosition, zeroes];
  } else {
    throw new Error(`Unexpected dir: ${turn.dir}`);
  }
}

async function main() {
  const inputPath = `${import.meta.dirname}/input.txt`;
  const turns = await readInput(inputPath);

  let dial = 50;
  let stopZeroes = 0;
  let totalZeroes = 0;
  for (const turn of turns) {
    const [newDial, turnZeroes] = turnDial(dial, turn);
    dial = newDial;
    totalZeroes += turnZeroes;
    if (dial === 0) {
      stopZeroes++;
    }
  }

  console.log(`Stop zeroes (part 1): ${stopZeroes}`);
  console.log(`Total zeroes (part 2): ${totalZeroes}`);
}
main();

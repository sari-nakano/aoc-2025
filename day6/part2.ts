type Operation = "add" | "multiply";

type Problem = {
  operation: Operation;
  operands: number[];
};

/**
 * Converts input file's lines into columns. Pads short lines with whitespace.
 * E.g.:
 * ```
 * transposeInput(["123", "456", " 7", "*"]);
 * // => ["14 *", "257 ", "36  "];
 * ```
 */
export function transposeInput(lines: string[]): string[] {
  const columns: string[] = [];
  const maxLength = Math.max(...lines.map((l) => l.length));
  for (let cix = 0; cix < maxLength; cix++) {
    let column = "";
    for (const line of lines) {
      const char = cix < line.length ? line[cix] : " ";
      column += char;
    }
    columns.push(column);
  }
  return columns;
}

/**
 * Splits transposed input's columns into groups split by empty columns.
 * E.g.:
 * ```
 * const columns = [
 *   "123+",
 *   "45  ",
 *   "    ",
 *   "678*",
 *   "9   ",
 *   "    ",
 *   "100+",
 *   "200 ",
 * ];
 * splitColumnsBySpace(columns);
 * // => [
 * //   [
 * //     "123+",
 * //     "45  ",
 * //   ],
 * //   [
 * //     "678*",
 * //     "9   ",
 * //   ],
 * //   [
 * //     "100+",
 * //     "200 ",
 * //   ],
 * // ]
 * ```
 */
export function splitColumnsBySpace(columns: string[]) {
  const groups: string[][] = [];
  for (const column of columns) {
    const isSpace = column.trim().length === 0;
    if (isSpace) {
      // Starting a new group.
      groups.push([]);
    } else {
      let lastGroup = groups.at(-1);
      if (lastGroup === undefined) {
        lastGroup = [];
        groups.push(lastGroup);
      }
      lastGroup.push(column);
    }
  }
  return groups;
}

export function parseProblem(columns: string[]): Problem {
  if (columns.length === 0) {
    throw new Error("Empty problem column list");
  }

  let operation: Operation;
  const symbol = columns[0].at(-1);
  if (symbol === "+") {
    operation = "add";
  } else if (symbol === "*") {
    operation = "multiply";
  } else {
    throw new Error(`Invalid operation symbol: ${symbol}`);
  }

  const operands: number[] = [];
  for (const column of columns) {
    const match = /\s*(\d+)\s*(\+|\*)?/.exec(column);
    if (match === null) {
      throw new Error(`Invalid problem column: "${column}"`);
    }
    operands.push(Number(match[1]));
  }

  return { operation, operands };
}

async function parseInput(path: string): Promise<Problem[]> {
  const input = (await Deno.readTextFile(path)).trim();
  const columns = transposeInput(input.trim().split("\n"));
  const groups = splitColumnsBySpace(columns);
  return groups.map((g) => parseProblem(g));
}

function solveProblem(problem: Problem): number {
  if (problem.operation === "add") {
    return problem.operands.reduce((a, b) => a + b, 0);
  } else if (problem.operation === "multiply") {
    return problem.operands.reduce((a, b) => a * b, 1);
  } else {
    throw new Error(`Invalid operations: ${problem.operation}`);
  }
}

async function main() {
  const inputPath = `${import.meta.dirname}/input.txt`;
  const problems = await parseInput(inputPath);
  console.log(`Parsed ${problems.length} problems`);

  const solutions = problems.map((p) => solveProblem(p));
  const solutionTotal = solutions.reduce((a, b) => a + b, 0);
  console.log(`Total sum of solutions (part 2): ${solutionTotal}`);
}
if (import.meta.main) {
  main();
}

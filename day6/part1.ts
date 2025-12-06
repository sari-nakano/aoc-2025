type Operation = "add" | "multiply";

type ProblemSet = {
  size: number;
  rows: number[][];
  operations: Operation[];
};

async function parseInput(path: string): Promise<ProblemSet> {
  const input = (await Deno.readTextFile(path)).trim();
  const lines = input.split("\n");
  if (lines.length < 2) {
    throw new Error(`Too few lines: ${lines.length}`);
  }

  const rows: number[][] = [];
  for (const rowLine of lines.slice(0, -1)) {
    const row = rowLine.split(/\s+/).map((it) => Number(it));
    if (row.some((it) => Number.isNaN(it))) {
      throw new Error(`Invalid number row`);
    }
    rows.push(row);
  }

  const operations: Operation[] = [];
  for (const symbol of lines.at(-1)!.split(/\s+/)) {
    if (symbol === "+") {
      operations.push("add");
    } else if (symbol === "*") {
      operations.push("multiply");
    } else {
      throw new Error(`Invalid operation symbol: "${symbol}"`);
    }
  }

  const size = rows[0].length;
  for (const row of rows) {
    if (row.length !== size) {
      throw new Error(`Row length mismatch: ${size} !== ${row.length}`);
    }
  }
  if (operations.length !== size) {
    throw new Error(
      `Operation count mismatch: ${size} !== ${operations.length}`,
    );
  }

  return { size, rows, operations };
}

function solveProblemSet(problemSet: ProblemSet): number[] {
  const solutions: number[] = [];
  for (let pix = 0; pix < problemSet.size; pix++) {
    const operands = problemSet.rows.map((r) => r[pix]);
    const operation = problemSet.operations[pix];
    if (operation === "add") {
      const solution = operands.reduce((a, b) => a + b, 0);
      solutions.push(solution);
    } else if (operation === "multiply") {
      const solution = operands.reduce((a, b) => a * b, 1);
      solutions.push(solution);
    }
  }
  return solutions;
}

async function main() {
  const inputPath = `${import.meta.dirname}/input.txt`;
  const problemSet = await parseInput(inputPath);
  console.log(
    `Parsed ${problemSet.size} problems of ${problemSet.rows.length} rows`,
  );

  const solutions = solveProblemSet(problemSet);
  const solutionTotal = solutions.reduce((a, b) => a + b, 0);
  console.log(`Total sum of solutions (part 1): ${solutionTotal}`);
}
if (import.meta.main) {
  main();
}

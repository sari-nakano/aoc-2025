import { assertEquals } from "jsr:@std/assert@1.0.15";
import { parseProblem, splitColumnsBySpace, transposeInput } from "./part2.ts";

Deno.test("transposeInput", () => {
  const lines = [
    "123 328  51 64 ",
    " 45 64  387 23 ",
    "  6 98  215 314",
    "*   +   *   +",
  ];
  const columns = transposeInput(lines);
  assertEquals(columns, [
    "1  *",
    "24  ",
    "356 ",
    "    ",
    "369+",
    "248 ",
    "8   ",
    "    ",
    " 32*",
    "581 ",
    "175 ",
    "    ",
    "623+",
    "431 ",
    "  4 ",
  ]);
});

Deno.test("splitColumnsBySpace", () => {
  const columns = [
    "1  *",
    "24  ",
    "356 ",
    "    ",
    "369+",
    "248 ",
    "8   ",
    "    ",
    " 32*",
    "581 ",
    "175 ",
    "    ",
    "623+",
    "431 ",
    "  4 ",
  ];
  const groups = splitColumnsBySpace(columns);
  assertEquals(groups, [
    [
      "1  *",
      "24  ",
      "356 ",
    ],
    [
      "369+",
      "248 ",
      "8   ",
    ],
    [
      " 32*",
      "581 ",
      "175 ",
    ],
    [
      "623+",
      "431 ",
      "  4 ",
    ],
  ]);
});

Deno.test("parseProblem", () => {
  assertEquals(
    parseProblem([
      "1  *",
      "24  ",
      "356 ",
    ]),
    {
      operation: "multiply",
      operands: [1, 24, 356],
    },
  );
  assertEquals(
    parseProblem([
      "369+",
      "248 ",
      "8   ",
    ]),
    {
      operation: "add",
      operands: [369, 248, 8],
    },
  );
  assertEquals(
    parseProblem([
      " 32*",
      "581 ",
      "175 ",
    ]),
    {
      operation: "multiply",
      operands: [32, 581, 175],
    },
  );
  assertEquals(
    parseProblem([
      "623+",
      "431 ",
      "  4 ",
    ]),
    {
      operation: "add",
      operands: [623, 431, 4],
    },
  );
});

import { assertEquals } from "jsr:@std/assert@1.0.15";
import { parsePoints } from "./points.ts";

Deno.test("parsePoints", () => {
  const input = `7,1
11,1
11,7
9,7
9,5
2,5
2,3
7,3
`;
  const points = parsePoints(input);
  assertEquals(points, [
    { column: 7, row: 1 },
    { column: 11, row: 1 },
    { column: 11, row: 7 },
    { column: 9, row: 7 },
    { column: 9, row: 5 },
    { column: 2, row: 5 },
    { column: 2, row: 3 },
    { column: 7, row: 3 },
  ]);
});

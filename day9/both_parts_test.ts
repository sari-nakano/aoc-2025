import { assertEquals } from "jsr:@std/assert@1.0.15";
import { findLargestGreenArea } from "./both_parts.ts";
import { Point } from "./lib/points.ts";

Deno.test("findLargestGreenArea", async () => {
  const tiles: Point[] = [
    { column: 7, row: 1 },
    { column: 11, row: 1 },
    { column: 11, row: 7 },
    { column: 9, row: 7 },
    { column: 9, row: 5 },
    { column: 2, row: 5 },
    { column: 2, row: 3 },
    { column: 7, row: 3 },
  ];
  assertEquals(await findLargestGreenArea(tiles), 24);
});

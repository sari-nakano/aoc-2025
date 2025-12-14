import { compressPoints } from "./compression.ts";
import { Point } from "./points.ts";
import { assertEquals } from "jsr:@std/assert@1.0.15";

Deno.test("compressPoints", () => {
  const points: Point[] = [
    { column: 7, row: 1 },
    { column: 11, row: 1 },
    { column: 11, row: 7 },
    { column: 9, row: 7 },
    { column: 9, row: 5 },
    { column: 2, row: 5 },
    { column: 2, row: 3 },
    { column: 7, row: 3 },
  ];
  // 01234567890123
  // .............. 0
  // .......#XXX#.. 1
  // .......X...X.. 2
  // ..#XXXX#...X.. 3
  // ..X........X.. 4
  // ..#XXXXXX#.X.. 5
  // .........X.X.. 6
  // .........#X#.. 7
  // .............. 8
  const expected: Point[] = [
    { column: 1, row: 0 },
    { column: 3, row: 0 },
    { column: 3, row: 3 },
    { column: 2, row: 3 },
    { column: 2, row: 2 },
    { column: 0, row: 2 },
    { column: 0, row: 1 },
    { column: 1, row: 1 },
  ];
  // 0123
  // .#X# 0
  // ##.X 1
  // #X#X 2
  // ..## 3
  const [actual, map] = compressPoints(points);
  assertEquals(actual, expected);
  assertEquals(
    map.toCompressedColumnMap,
    new Map([
      [2, 0],
      [7, 1],
      [9, 2],
      [11, 3],
    ]),
  );
  assertEquals(
    map.fromCompressedColumnMap,
    new Map([
      [0, 2],
      [1, 7],
      [2, 9],
      [3, 11],
    ]),
  );
  assertEquals(
    map.toCompressedRowMap,
    new Map([
      [1, 0],
      [3, 1],
      [5, 2],
      [7, 3],
    ]),
  );
  assertEquals(
    map.fromCompressedRowMap,
    new Map([
      [0, 1],
      [1, 3],
      [2, 5],
      [3, 7],
    ]),
  );
});

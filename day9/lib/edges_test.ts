import { assertEquals } from "jsr:@std/assert@1.0.15";
import { Point } from "./points.ts";
import { collectEdges, isPointInside } from "./edges.ts";

Deno.test("isPointInside", () => {
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
  // 01234567890123
  const map = [
    "..............", // 0
    ".......#XXX#..", // 1
    ".......XXXXX..", // 2
    "..#XXXX#XXXX..", // 3
    "..XXXXXXXXXX..", // 4
    "..#XXXXXX#XX..", // 5
    ".........XXX..", // 6
    ".........#X#..", // 7
    "..............", // 8
  ];
  const edges = collectEdges(tiles);
  for (let row = 0; row < map.length; row++) {
    const chars = map[row].split("");
    for (let column = 0; column < chars.length; column++) {
      const char = chars[column];
      const isInside = char === "#" || char === "X";
      assertEquals(
        isPointInside(edges, { column, row }),
        isInside,
        `point [${column}, ${row}]`,
      );
    }
  }
});

Deno.test("isPointInside 2", () => {
  const tiles: Point[] = [
    { column: 3, row: 2 },
    { column: 8, row: 2 },
    { column: 8, row: 4 },
    { column: 12, row: 4 },
    { column: 12, row: 2 },
    { column: 18, row: 2 },
    { column: 18, row: 6 },
    { column: 7, row: 6 },
    { column: 7, row: 8 },
    { column: 18, row: 8 },
    { column: 18, row: 12 },
    { column: 14, row: 12 },
    { column: 14, row: 14 },
    { column: 10, row: 14 },
    { column: 10, row: 10 },
    { column: 6, row: 10 },
    { column: 6, row: 14 },
    { column: 2, row: 14 },
    { column: 2, row: 10 },
    { column: 4, row: 10 },
    { column: 4, row: 8 },
    { column: 2, row: 8 },
    { column: 2, row: 4 },
    { column: 3, row: 4 },
  ];
  // 012345678901234567890
  const map = [
    ".....................", // 0
    ".....................", // 1
    "...#XXXX#...#XXXXX#..", // 2
    "...XXXXXX...XXXXXXX..", // 3
    "..##XXXX#XXX#XXXXXX..", // 4
    "..XXXXXXXXXXXXXXXXX..", // 5
    "..XXXXX#XXXXXXXXXX#..", // 6
    "..XXXXXX.............", // 7
    "..#X#XX#XXXXXXXXXX#..", // 8
    "....XXXXXXXXXXXXXXX..", // 9
    "..#X#X#XXX#XXXXXXXX..", // 10
    "..XXXXX...XXXXXXXXX..", // 11
    "..XXXXX...XXXX#XXX#..", // 12
    "..XXXXX...XXXXX......", // 13
    "..#XXX#...#XXX#......", // 14
    ".....................", // 15
  ];
  const edges = collectEdges(tiles);
  for (let row = 0; row < map.length; row++) {
    const chars = map[row].split("");
    for (let column = 0; column < chars.length; column++) {
      const char = chars[column];
      const isInside = char === "#" || char === "X";
      assertEquals(
        isPointInside(edges, { column, row }),
        isInside,
        `point [${column}, ${row}]`,
      );
    }
  }
});

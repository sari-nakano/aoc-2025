import { assertEquals } from "jsr:@std/assert@1.0.15";
import { getAllRepeats, getDoubleRepeats } from "./both_parts.ts";

Deno.test("getDoubleRepeats", () => {
  assertEquals(getDoubleRepeats(11, 22), new Set([11, 22]));
  assertEquals(getDoubleRepeats(998, 1012), new Set([1010]));
  assertEquals(getDoubleRepeats(1188511880, 1188511890), new Set([1188511885]));
  assertEquals(getDoubleRepeats(222220, 222224), new Set([222222]));
  assertEquals(getDoubleRepeats(1698522, 1698528), new Set());
});

Deno.test("getAllRepeats", () => {
  assertEquals(getAllRepeats(11, 22), new Set([11, 22]));
  assertEquals(getAllRepeats(95, 115), new Set([99, 111]));
  assertEquals(getAllRepeats(998, 1012), new Set([999, 1010]));
  assertEquals(getAllRepeats(1188511880, 1188511890), new Set([1188511885]));
  assertEquals(getAllRepeats(222220, 222224), new Set([222222]));
  assertEquals(getAllRepeats(1698522, 1698528), new Set());
  assertEquals(getAllRepeats(2121212118, 2121212124), new Set([2121212121]));
});

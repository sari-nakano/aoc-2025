import { assertEquals } from "jsr:@std/assert@1.0.15";
import { getMaxJoltage, parseBatteryBank } from "./both_parts.ts";

Deno.test("getMaxJoltage", () => {
  assertEquals(getMaxJoltage(parseBatteryBank("987654321111111"), 2), 98);
  assertEquals(getMaxJoltage(parseBatteryBank("811111111111119"), 2), 89);
  assertEquals(getMaxJoltage(parseBatteryBank("234234234234278"), 2), 78);
  assertEquals(getMaxJoltage(parseBatteryBank("818181911112111"), 2), 92);

  assertEquals(
    getMaxJoltage(parseBatteryBank("987654321111111"), 12),
    987654321111,
  );
  assertEquals(
    getMaxJoltage(parseBatteryBank("811111111111119"), 12),
    811111111119,
  );
  assertEquals(
    getMaxJoltage(parseBatteryBank("234234234234278"), 12),
    434234234278,
  );
  assertEquals(
    getMaxJoltage(parseBatteryBank("818181911112111"), 12),
    888911112111,
  );
});

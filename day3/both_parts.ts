type BatteryBank = number[];

export function parseBatteryBank(line: string): BatteryBank {
  const bank = line.trim().split("").map(Number);
  if (bank.some(Number.isNaN)) {
    throw new Error(`Invalid battery bank: "${line}"`);
  }
  return bank;
}

async function parseInput(path: string): Promise<BatteryBank[]> {
  const input = await Deno.readTextFile(path);
  const batteryBanks: BatteryBank[] = [];
  for (const line of input.split("\n")) {
    const cleanLine = line.trim();
    if (!cleanLine) {
      continue;
    }

    batteryBanks.push(parseBatteryBank(line));
  }
  return batteryBanks;
}

function indexOfMax(nums: number[]): number | undefined {
  let maxIndex: number | undefined = undefined;
  nums.forEach((num, ix) => {
    if (maxIndex === undefined) {
      maxIndex = ix;
      return;
    }

    if (num > nums[maxIndex]) {
      maxIndex = ix;
      return;
    }
  });
  return maxIndex;
}

/**
 * Examples:
 * ```
 * getMaxJoltage([8, 1, 1, 1, 9], 2); // => 89
 * getMaxJoltage([8, 1, 1, 1, 9], 3); // => 819
 * ```
 */
export function getMaxJoltage(
  batteryBank: BatteryBank,
  count: number,
): number {
  if (count <= 0) {
    return 0;
  }

  // E.g. in case of `getMaxJoltage([8, 1, 1, 1, 9], 3)` search for the first
  // battery in [8, 1, 1] (excluding last 2 elements because we need at least
  // 2 more elements to complete the pack).
  const firstIndex = indexOfMax(
    batteryBank.slice(0, batteryBank.length - count + 1),
  );
  if (firstIndex === undefined) {
    return 0;
  }
  const firstBattery = batteryBank[firstIndex];

  // Find max joltage in the remaining bank.
  const remainingJoltage = getMaxJoltage(
    batteryBank.slice(firstIndex + 1),
    count - 1,
  );

  // E.g. in case of `getMaxJoltage([8, 1, 1, 1, 9], 3)` firstBattery
  // will be 8 and remainingJoltage will be 19.
  // 8 * 10^2 + 19 = 819.
  return firstBattery * Math.pow(10, count - 1) + remainingJoltage;
}

async function main() {
  const inputPath = `${import.meta.dirname}/input.txt`;
  const batteryBanks = await parseInput(inputPath);

  let maxJoltage2Sum = 0;
  for (const batteryBank of batteryBanks) {
    maxJoltage2Sum += getMaxJoltage(batteryBank, 2);
  }
  console.log(`Max joltage 2 sum (part 1): ${maxJoltage2Sum}`);

  let maxJoltage12Sum = 0;
  for (const batteryBank of batteryBanks) {
    maxJoltage12Sum += getMaxJoltage(batteryBank, 12);
  }
  console.log(`Max joltage 12 sum (part 1): ${maxJoltage12Sum}`);
}

if (import.meta.main) {
  main();
}

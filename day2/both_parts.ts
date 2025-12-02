/** Parses "123-456" to [123, 456]. */
function parseRange(line: string): [number, number] {
  const match = /^(\d+)-(\d+)$/.exec(line.trim());
  if (!match) {
    throw new Error(`Invalid range: "${line}"`);
  }

  const [_, fromString, toString] = match;
  return [Number(fromString), Number(toString)];
}

/** Parses the whole input.txt into an array of ranges. */
async function parseInput(path: string): Promise<[number, number][]> {
  const input = await Deno.readTextFile(path);
  const ranges: [number, number][] = [];
  for (const line of input.trim().split(",")) {
    const cleanLine = line.trim();
    if (!cleanLine) {
      continue;
    }

    ranges.push(parseRange(line));
  }
  return ranges;
}

/** Repeats the sequence `seq` of digits given number of `times`, moving them
 * by the given `place` value.
 *
 * `place` must be 10 for single-digit sequences, 100 for double digit sequences,
 * 1000 for triple digits and so on.
 *
 * Examples:
 * ```
 * repeatSeq(123, 2, 1000) // => 123123
 * repeatSeq(123, 4, 1000) // => 123123123123
 * ```
 */
function repeatSeq(seq: number, times: number, place: number): number {
  if (times <= 1) {
    return seq;
  } else {
    return repeatSeq(seq, times - 1, place) * place + seq;
  }
}

/** Returns "double repeats" in the given range (part 1 solution).
 * A "double repeat" is a repeat of a sequence of digits exactly twice.
 */
export function getDoubleRepeats(from: number, to: number): Set<number> {
  const repeats = new Set<number>();
  let seqLength = 1;
  while (true) {
    // 10 for single-digit sequences (seqLength = 1)
    // 100 for double-digit sequences (seqLength = 2)
    // and so on.
    const place = Math.pow(10, seqLength);

    // 1, 10, 100, ...
    const minSeq = Math.pow(10, seqLength - 1);
    // 9, 99, 999, ...
    const maxSeq = Math.pow(10, seqLength) - 1;

    const minRepeat = repeatSeq(minSeq, 2, place);
    if (minRepeat > to) {
      // We have jumped over the end of the range, stop iteration towards longer sequences.
      return repeats;
    }

    const maxRepeat = repeatSeq(maxSeq, 2, place);
    if (maxRepeat < from) {
      // Our sequence is too little for this range, increase the length.
      seqLength++;
      continue;
    }

    // Check every sequence in range.
    for (let seq = minSeq; seq <= maxSeq; seq++) {
      const repeat = repeatSeq(seq, 2, place);
      if (repeat >= from && repeat <= to) {
        repeats.add(repeat);
      }
    }
    seqLength++;
  }
}

/** Returns all repeats in the given range (part 2 solution).
 * Includes not only double repeats, but repetitions of sequences of digits
 * any number of times.
 */
export function getAllRepeats(from: number, to: number): Set<number> {
  const repeats = new Set<number>();
  let seqLength = 1;
  while (true) {
    // 10 for single-digit sequences (seqLength = 1)
    // 100 for double-digit sequences (seqLength = 2)
    // and so on.
    const place = Math.pow(10, seqLength);

    // 1, 10, 100, ...
    const minSeq = Math.pow(10, seqLength - 1);
    // 9, 99, 999, ...
    const maxSeq = Math.pow(10, seqLength) - 1;

    const minDoubleRepeat = repeatSeq(minSeq, 2, place);
    if (minDoubleRepeat > to) {
      // We have jumped over the end of the range, stop iteration towards longer sequences.
      return repeats;
    }

    // Now we iterate over how many times we repeat the sequence.
    let times = 2;
    while (true) {
      const minRepeat = repeatSeq(minSeq, times, place);
      const maxRepeat = repeatSeq(maxSeq, times, place);

      if (minRepeat > to) {
        // We have jumped over the end of the range, stop iteration towards longer repeats.
        times++;
        break;
      }

      if (maxRepeat < from) {
        // Our repeat is too little for this range, increase the number of repeats.
        times++;
        continue;
      }

      // Check every sequence in range.
      for (let seq = minSeq; seq <= maxSeq; seq++) {
        const repeat = repeatSeq(seq, times, place);
        if (repeat >= from && repeat <= to) {
          repeats.add(repeat);
        }
      }
      times++;
    }
    seqLength++;
  }
}

async function main() {
  const inputPath = `${import.meta.dirname}/input.txt`;
  const ranges = await parseInput(inputPath);

  let doubleRepeatSum = 0;
  for (const [from, to] of ranges) {
    const repeats = getDoubleRepeats(from, to);
    for (const repeat of repeats) {
      doubleRepeatSum += repeat;
    }
  }

  let allRepeatSum = 0;
  for (const [from, to] of ranges) {
    const repeats = getAllRepeats(from, to);
    for (const repeat of repeats) {
      allRepeatSum += repeat;
    }
  }

  console.log(`Sum of double repeats (part 1): ${doubleRepeatSum}`);
  console.log(`Sum of all repeats (part 2): ${allRepeatSum}`);
}

if (import.meta.main) {
  main();
}

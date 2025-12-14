.PHONY: day1
day1:
	deno run -A day1/both_parts.ts

.PHONY: day2
day2:
	deno run -A day2/both_parts.ts

.PHONY: day2/test
day2/test:
	deno test day2

.PHONY: day3
day3:
	deno run -A day3/both_parts.ts

.PHONY: day3/test
day3/test:
	deno test day3

.PHONY: day4
day4:
	deno run -A day4/both_parts.ts

.PHONY: day5
day5:
	deno run -A day5/both_parts.ts

.PHONY: day6/part1
day6/part1:
	deno run -A day6/part1.ts

.PHONY: day6/part2
day6/part2:
	deno run -A day6/part2.ts

.PHONY: day6/test
day6/test:
	deno test day6

.PHONY: day7
day7:
	deno run -A day7/both_parts.ts

.PHONY: day8
day8:
	deno run -A day8/both_parts.ts

.PHONY: day9
day9:
	deno run -A day9/both_parts.ts

.PHONY: day9/test
day9/test:
	deno test -A day9

.PHONY: validate
validate:
	deno check
	deno lint
	deno fmt . -q

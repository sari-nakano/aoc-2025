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

.PHONY: validate
validate:
	deno check
	deno lint
	deno fmt . -q

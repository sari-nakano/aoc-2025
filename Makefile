.PHONY: day1
day1:
	deno run -A day1/both_parts.ts

.PHONY: day2
day2:
	deno run -A day2/both_parts.ts

.PHONY: day2/test
day2/test:
	deno test day2

.PHONY: validate
validate:
	deno check
	deno lint
	deno fmt . -q

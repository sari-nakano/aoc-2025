.PHONY: day1
day1:
	deno run -A day1/both_parts.ts

.PHONY: validate
validate:
	deno check
	deno lint
	deno fmt . -q

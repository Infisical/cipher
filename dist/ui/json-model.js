// src/ui/json-model.ts
var REDACTED = JSON.stringify("<redacted>");
function redactJson(value, redact) {
	const keys = Array.isArray(redact) ? new Set(redact.map((key) => key.toLowerCase())) : null;
	const match = (key) => typeof redact === "function" ? redact(key) : keys?.has(key.toLowerCase()) ?? false;
	const visit = (node) => Array.isArray(node) ? node.map(visit) : node !== null && typeof node === "object" ? Object.fromEntries(Object.entries(node).map(([key, child]) => [key, match(key) ? "<redacted>" : visit(child)])) : node;
	return visit(value);
}
function parseDocument(source) {
	let cursor = 0;
	let nodes = 0;
	const whitespace = () => {
		while (/[ \t\r\n]/.test(source[cursor] ?? "") && cursor < source.length) cursor += 1;
	};
	const string = () => {
		const start = cursor;
		cursor += 1;
		while (cursor < source.length) {
			const char = source[cursor];
			cursor += 1;
			if (char === "\\") cursor += 1;
			else if (char === "\"") return JSON.parse(source.slice(start, cursor));
		}
		throw new Error("Unterminated string");
	};
	const parse = (depth) => {
		nodes += 1;
		if (depth > 128 || nodes > 5e4) throw new RangeError("JSON exceeds inspection limits");
		whitespace();
		const start = cursor;
		if (source[cursor] === "{") {
			cursor += 1;
			whitespace();
			const entries = [];
			if (source[cursor] !== "}") while (cursor < source.length) {
				whitespace();
				if (source[cursor] !== "\"") throw new Error("Expected key");
				const key = string();
				whitespace();
				if (source[cursor] !== ":") throw new Error("Expected colon");
				cursor += 1;
				entries.push({
					key,
					node: parse(depth + 1)
				});
				whitespace();
				if (source[cursor] !== ",") break;
				cursor += 1;
			}
			if (source[cursor] !== "}") throw new Error("Expected object end");
			cursor += 1;
			return {
				kind: "object",
				entries,
				start,
				end: cursor
			};
		}
		if (source[cursor] === "[") {
			cursor += 1;
			whitespace();
			const items = [];
			if (source[cursor] !== "]") while (cursor < source.length) {
				items.push(parse(depth + 1));
				whitespace();
				if (source[cursor] !== ",") break;
				cursor += 1;
			}
			if (source[cursor] !== "]") throw new Error("Expected array end");
			cursor += 1;
			return {
				kind: "array",
				items,
				start,
				end: cursor
			};
		}
		if (source[cursor] === "\"") string();
		else {
			const token = /^(?:true|false|null|-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?)/.exec(source.slice(cursor));
			if (!token) throw new Error("Expected JSON value");
			cursor += token[0].length;
		}
		return {
			kind: "scalar",
			raw: source.slice(start, cursor),
			start,
			end: cursor
		};
	};
	const node = parse(0);
	whitespace();
	if (cursor !== source.length) throw new Error("Unexpected trailing text");
	return node;
}
function prepareJson(value, redact) {
	const source = typeof value === "string" ? value : JSON.stringify(value, null, 2);
	const hasRedaction = typeof redact === "function" || Boolean(redact?.length);
	try {
		if (source.length > 1e6) throw new RangeError("JSON exceeds inspection limits");
		const document = parseDocument(source);
		const keys = Array.isArray(redact) ? new Set(redact.map((key) => key.toLowerCase())) : null;
		const match = (key) => typeof redact === "function" ? redact(key) : keys?.has(key.toLowerCase()) ?? false;
		const edits = [];
		const visit = (node) => {
			if (node.kind === "array") return {
				...node,
				items: node.items.map(visit)
			};
			if (node.kind === "object") return {
				...node,
				entries: node.entries.map((entry) => {
					if (match(entry.key)) {
						edits.push(entry.node);
						return {
							...entry,
							node: {
								kind: "scalar",
								raw: REDACTED,
								start: entry.node.start,
								end: entry.node.end
							}
						};
					}
					return {
						...entry,
						node: visit(entry.node)
					};
				})
			};
			return node;
		};
		const safe = visit(document);
		let text = source;
		edits.sort((a, b) => b.start - a.start).forEach((edit) => {
			text = text.slice(0, edit.start) + REDACTED + text.slice(edit.end);
		});
		return {
			value: typeof value === "string" ? text : redactJson(value, redact),
			text,
			parsed: true,
			document: safe
		};
	} catch (error) {
		const text = hasRedaction ? "<redacted>" : source;
		return {
			value: text,
			text,
			parsed: false,
			...error instanceof RangeError ? { notice: hasRedaction ? "This payload exceeds inspection limits and was fully redacted. Narrow the payload before inspecting it." : "This payload exceeds inspection limits. The preview is shortened; Copy retains the exact source." } : {}
		};
	}
}
export { prepareJson, redactJson };

//# sourceMappingURL=json-model.js.map
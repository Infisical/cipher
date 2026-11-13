// src/ui/data-grid-model.ts
function encodeTsv(rows) {
	return rows.map((row) => row.map((value) => {
		if (value === null) return "\\N";
		if (value === "" || value === "\\N" || /[\t\n\r"]/.test(value)) return `"${value.replaceAll("\"", "\"\"")}"`;
		return value;
	}).join("	")).join("\n");
}
function decodeTsv(text) {
	const rows = [];
	let row = [];
	let value = "";
	let quoted = false;
	let wasQuoted = false;
	let afterQuote = false;
	const pushCell = () => {
		row.push(!wasQuoted && value === "\\N" ? null : value);
		value = "";
		wasQuoted = false;
		afterQuote = false;
	};
	for (let i = 0; i < text.length; i += 1) {
		const char = text[i];
		if (quoted) {
			if (char === "\"" && text[i + 1] === "\"") {
				value += "\"";
				i += 1;
			} else if (char === "\"") {
				quoted = false;
				afterQuote = true;
			} else value += char;
		} else if (char === "	") pushCell();
		else if (char === "\n" || char === "\r") {
			if (char === "\r" && text[i + 1] === "\n") i += 1;
			pushCell();
			rows.push(row);
			row = [];
		} else if (char === "\"" && value === "" && !afterQuote) {
			quoted = true;
			wasQuoted = true;
		} else if (afterQuote) return { error: "A quoted cell must end before the next separator." };
		else value += char;
	}
	if (quoted) return { error: "A quoted cell is missing its closing quote." };
	pushCell();
	rows.push(row);
	return { rows };
}
var signedIntegerBits = {
	int2: 16,
	smallint: 16,
	int4: 32,
	integer: 32,
	int8: 64,
	bigint: 64
};
function parseGridValue(column, value, row) {
	if (column.parse) return column.parse(value, row);
	if (value === null) return column.nullable ? { value: null } : { error: `${column.header} cannot be NULL.` };
	const type = column.type?.toLowerCase() ?? "text";
	const bits = signedIntegerBits[type];
	if (bits !== void 0) {
		if (!/^-?\d+$/.test(value)) return { error: `${column.header} needs a whole number.` };
		const magnitude = 2n ** BigInt(bits - 1);
		const exact = BigInt(value);
		if (exact < -magnitude || exact >= magnitude) return { error: `${column.header} must be between ${-magnitude} and ${magnitude - 1n}.` };
	}
	if (/^(numeric|decimal|float4|float8|real)$/.test(type) && !/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/.test(value)) return { error: `${column.header} needs a number.` };
	if (/^(bool|boolean)$/.test(type) && !/^(true|false)$/.test(value)) return { error: `${column.header} needs true or false.` };
	if (type === "uuid" && !/^[\da-f]{8}(?:-[\da-f]{4}){3}-[\da-f]{12}$/i.test(value)) return { error: `${column.header} needs a UUID.` };
	if (/^jsonb?$/.test(type)) try {
		JSON.parse(value);
	} catch {
		return { error: `${column.header} needs valid JSON.` };
	}
	return { value };
}
function canEditColumn(column) {
	return !column.sensitive && (column.editable ?? !column.primaryKey);
}
function pasteGrid({ rows, columns, getRowId, active, text }) {
	const parsed = decodeTsv(text);
	if ("error" in parsed) return parsed;
	const firstRow = rows.findIndex((row) => getRowId(row) === active.rowId);
	const firstColumn = columns.findIndex((column) => column.id === active.columnId);
	if (firstRow < 0 || firstColumn < 0) return { error: "The selected cell is no longer available." };
	const changes = [];
	for (let r = 0; r < parsed.rows.length; r += 1) {
		const line = parsed.rows[r];
		if (!line) return { error: "The pasted row is missing." };
		const row = rows[firstRow + r];
		if (!row || firstColumn + line.length > columns.length) return { error: "The pasted cells do not fit in the available rows and columns." };
		for (let c = 0; c < line.length; c += 1) {
			const value = line[c];
			if (value === void 0) return { error: "The pasted cell is missing." };
			const column = columns[firstColumn + c];
			if (!column || !canEditColumn(column)) return { error: "The pasted range includes a read-only or protected cell." };
			const result = parseGridValue(column, value, row);
			if ("error" in result) return { error: `Row ${firstRow + r + 1}: ${result.error}` };
			const previous = column.getValue(row);
			if (previous !== result.value) changes.push({
				rowId: getRowId(row),
				columnId: column.id,
				row,
				previous,
				value: result.value
			});
		}
	}
	return { changes };
}
export { canEditColumn, decodeTsv, encodeTsv, parseGridValue, pasteGrid };

//# sourceMappingURL=data-grid-model.js.map
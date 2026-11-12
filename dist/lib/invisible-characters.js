// src/lib/invisible-characters.ts
var ALLOWED_WHITESPACE = /* @__PURE__ */ new Set([
	" ",
	"	",
	"\n",
	"\r"
]);
var SUSPICIOUS_CATEGORY_REGEX = /^[\p{Cc}\p{Cf}\p{Zs}\p{Zl}\p{Zp}]$/u;
var EMOJI_SEQUENCE_REGEX = /\p{Extended_Pictographic}(?:\p{Emoji_Modifier}|\uFE0F)*(?:\u200D\p{Extended_Pictographic}(?:\p{Emoji_Modifier}|\uFE0F)*)+|\u{1F3F4}[\u{E0020}-\u{E007E}]+\u{E007F}/gu;
var isSuspiciousCharacter = (char) => !ALLOWED_WHITESPACE.has(char) && SUSPICIOUS_CATEGORY_REGEX.test(char);
var getCharacterLabel = (char) => {
	if (/\p{Bidi_Control}/u.test(char)) return "Bidirectional control";
	if (/\p{Cc}/u.test(char)) return "Control character";
	if (/\p{Zs}/u.test(char)) return "Unicode space";
	if (/\p{Zl}/u.test(char)) return "Line separator";
	if (/\p{Zp}/u.test(char)) return "Paragraph separator";
	return "Formatting character";
};
var splitSuspiciousCharacters = (value) => {
	const parts = [];
	const pushPlain = (text) => {
		const last = parts[parts.length - 1];
		if (last && !last.isSuspicious) last.text += text;
		else parts.push({
			text,
			isSuspicious: false
		});
	};
	const scan = (text) => {
		Array.from(text).forEach((char) => {
			if (isSuspiciousCharacter(char)) parts.push({
				text: char,
				isSuspicious: true
			});
			else pushPlain(char);
		});
	};
	let offset = 0;
	Array.from(value.matchAll(EMOJI_SEQUENCE_REGEX)).forEach((match) => {
		const index = match.index ?? 0;
		scan(value.slice(offset, index));
		pushPlain(match[0]);
		offset = index + match[0].length;
	});
	scan(value.slice(offset));
	return parts;
};
var getInvisibleCharacterSummary = (value) => {
	const summary = /* @__PURE__ */ new Map();
	splitSuspiciousCharacters(value).forEach(({ text, isSuspicious }) => {
		if (!isSuspicious) return;
		const code = text.codePointAt(0) ?? 0;
		const entry = summary.get(code);
		if (entry) {
			entry.count += 1;
			return;
		}
		summary.set(code, {
			codePoint: `U+${code.toString(16).toUpperCase().padStart(4, "0")}`,
			label: getCharacterLabel(text),
			count: 1
		});
	});
	return Array.from(summary.values());
};
export { getInvisibleCharacterSummary, isSuspiciousCharacter, splitSuspiciousCharacters };

//# sourceMappingURL=invisible-characters.js.map
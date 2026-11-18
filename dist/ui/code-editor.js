"use client";
import { useFieldControlAttributes } from "../lib/field-context.js";
import { cn } from "../lib/utils.js";
import controls_module_default from "./controls.module.js";
import code_editor_module_default from "./code-editor.module.js";
import * as React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
// src/ui/code-editor.tsx
var lineFeeds = (text) => text.replace(/\r\n?/g, "\n");
var editorModules;
async function loadEditor() {
	const [view, state, commands, language, sql, highlight] = await Promise.all([
		import("@codemirror/view"),
		import("@codemirror/state"),
		import("@codemirror/commands"),
		import("@codemirror/language"),
		import("@codemirror/lang-sql"),
		import("@lezer/highlight")
	]);
	const { tags } = highlight;
	const postgres = sql.PostgreSQL.spec;
	return {
		view,
		state,
		commands,
		language,
		sql,
		dialects: {
			postgres: sql.PostgreSQL,
			cockroachdb: sql.SQLDialect.define({
				...postgres,
				keywords: postgres.keywords + " upsert interleave family experimental strict changefeed backup restore survive regions region zone configure scatter split unsplit relocate"
			}),
			mysql: sql.MySQL,
			snowflake: sql.SQLDialect.define({
				...postgres,
				keywords: postgres.keywords + " qualify ilike rlike regexp warehouse stage pipe stream task clone undrop flatten sample tablesample put get list remove merge unpivot pivot",
				types: postgres.types + " variant object array geography number string"
			}),
			clickhouse: sql.SQLDialect.define({
				keywords: postgres.keywords + " final prewhere sample global any asof semi anti array settings format engine ttl optimize materialized codec attach detach system",
				types: "int8 int16 int32 int64 int128 int256 uint8 uint16 uint32 uint64 uint128 uint256 float32 float64 decimal decimal32 decimal64 decimal128 bool boolean string fixedstring uuid date date32 datetime datetime64 enum enum8 enum16 array tuple map nullable lowcardinality nested ipv4 ipv6 json",
				identifierQuotes: "`\"",
				backslashEscapes: true,
				hashComments: true
			})
		},
		highlightStyle: language.HighlightStyle.define([
			{
				tag: tags.comment,
				class: code_editor_module_default.comment
			},
			{
				tag: [tags.string, tags.special(tags.string)],
				class: code_editor_module_default.string
			},
			{
				tag: [
					tags.keyword,
					tags.operatorKeyword,
					tags.bool,
					tags.null
				],
				class: code_editor_module_default.keyword
			},
			{
				tag: [
					tags.number,
					tags.typeName,
					tags.standard(tags.name)
				],
				class: code_editor_module_default.literal
			},
			{
				tag: tags.invalid,
				class: code_editor_module_default.invalid
			}
		]),
		theme: view.EditorView.theme({
			"&": {
				height: "100%",
				backgroundColor: "transparent",
				color: "var(--cipher-ink)"
			},
			"&.cm-focused": { outline: "none" },
			".cm-scroller": {
				fontFamily: "inherit",
				lineHeight: "inherit"
			},
			".cm-content": {
				padding: "0",
				caretColor: "var(--cipher-mark)"
			},
			".cm-line": { padding: "0" },
			".cm-cursor, .cm-dropCursor": { borderLeftColor: "var(--cipher-mark)" },
			"&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection": { backgroundColor: "var(--cipher-selected-surface)" },
			".cm-placeholder": { color: "var(--cipher-muted)" },
			"&.cm-focused .cm-matchingBracket": {
				backgroundColor: "var(--cipher-selected-surface)",
				outline: "var(--cipher-size-control-border) solid var(--cipher-line)"
			},
			"&.cm-focused .cm-nonmatchingBracket": { backgroundColor: "transparent" }
		}),
		external: state.Annotation.define()
	};
}
function CodeEditor({ value, onChange, dialect = "postgres", onRun, onSelectionChange, placeholder, readOnly = false, invalid, maxLength, rows = 6, className, style, ref, id, "aria-label": ariaLabel, "aria-labelledby": ariaLabelledby, "aria-describedby": ariaDescribedby, "aria-invalid": ariaInvalidProp, ...props }) {
	const field = useFieldControlAttributes({
		id,
		"aria-labelledby": ariaLabelledby,
		"aria-describedby": ariaDescribedby,
		"aria-invalid": ariaInvalidProp
	});
	const hostRef = React.useRef(null);
	const fallbackRef = React.useRef(null);
	const viewRef = React.useRef(null);
	const modulesRef = React.useRef(null);
	const compartmentRef = React.useRef(null);
	const latest = React.useRef({
		value,
		onChange,
		onRun,
		onSelectionChange
	});
	latest.current = {
		value,
		onChange,
		onRun,
		onSelectionChange
	};
	const [load, setLoad] = React.useState("loading");
	const [, rerender] = React.useReducer((count) => count + 1, 0);
	const handoff = React.useRef(null);
	const fallbackSelection = React.useRef("");
	const ariaInvalid = field["aria-invalid"];
	const invalidValue = invalid ? "true" : ariaInvalid === void 0 || ariaInvalid === false || ariaInvalid === "false" ? void 0 : String(ariaInvalid);
	const isInvalid = invalidValue !== void 0;
	React.useImperativeHandle(ref, () => ({ focus: () => viewRef.current ? viewRef.current.focus() : fallbackRef.current?.focus() }), []);
	const configure = React.useCallback((modules) => {
		const { view, state, sql, dialects, external } = modules;
		const attributes = { "aria-multiline": "true" };
		if (field.id) attributes.id = field.id;
		if (ariaLabel) attributes["aria-label"] = ariaLabel;
		if (field["aria-labelledby"]) attributes["aria-labelledby"] = field["aria-labelledby"];
		if (field["aria-describedby"]) attributes["aria-describedby"] = field["aria-describedby"];
		if (invalidValue) attributes["aria-invalid"] = invalidValue;
		if (readOnly) attributes["aria-readonly"] = "true";
		return [
			sql.sql({ dialect: dialects[dialect] }),
			state.EditorState.readOnly.of(readOnly),
			view.EditorView.contentAttributes.of(attributes),
			placeholder ? view.placeholder(placeholder) : [],
			maxLength === void 0 ? [] : state.EditorState.transactionFilter.of((transaction) => transaction.docChanged && !transaction.annotation(external) && transaction.newDoc.length > maxLength && transaction.newDoc.length > transaction.startState.doc.length ? [] : transaction)
		];
	}, [
		dialect,
		readOnly,
		placeholder,
		maxLength,
		ariaLabel,
		invalidValue,
		field.id,
		field["aria-labelledby"],
		field["aria-describedby"]
	]);
	const configureRef = React.useRef(configure);
	configureRef.current = configure;
	React.useEffect(() => {
		let disposed = false;
		editorModules ??= loadEditor().catch((error) => {
			editorModules = void 0;
			throw error;
		});
		editorModules.then((modules) => {
			const host = hostRef.current;
			if (disposed || !host) return;
			const { view, state, commands, language, highlightStyle, theme, external } = modules;
			const compartment = new state.Compartment();
			const selected = (editorState) => {
				const range = editorState.selection.main;
				return range.empty ? "" : editorState.sliceDoc(range.from, range.to);
			};
			const fallback = fallbackRef.current;
			handoff.current = fallback ? {
				anchor: fallback.selectionStart,
				head: fallback.selectionEnd,
				focus: document.activeElement === fallback
			} : null;
			const editor = new view.EditorView({
				parent: host,
				state: state.EditorState.create({
					doc: latest.current.value,
					extensions: [
						state.Prec.highest(view.keymap.of([{
							key: "Mod-Enter",
							run: (target) => {
								const run = latest.current.onRun;
								if (!run) return false;
								run(selected(target.state) || target.state.doc.toString());
								return true;
							}
						}])),
						commands.history(),
						view.keymap.of([...commands.defaultKeymap, ...commands.historyKeymap]),
						view.drawSelection(),
						language.bracketMatching(),
						language.syntaxHighlighting(highlightStyle),
						view.EditorView.lineWrapping,
						theme,
						compartment.of(configureRef.current(modules)),
						view.EditorView.updateListener.of((update) => {
							const fromValue = update.transactions.some((transaction) => transaction.annotation(external));
							if (update.docChanged && !fromValue) {
								const next = update.state.doc.toString();
								if (next !== lineFeeds(latest.current.value)) {
									latest.current.onChange?.(next);
									rerender();
								}
							}
							if (update.selectionSet || update.docChanged) {
								const before = selected(update.startState);
								const after = selected(update.state);
								if (before !== after) latest.current.onSelectionChange?.(after);
							}
						})
					]
				})
			});
			viewRef.current = editor;
			modulesRef.current = modules;
			compartmentRef.current = compartment;
			setLoad("ready");
		}, (error) => {
			if (disposed) return;
			console.error("CodeEditor needs the optional peer dependencies @codemirror/view, @codemirror/state, @codemirror/commands, @codemirror/language, @codemirror/lang-sql and @lezer/highlight.", error);
			setLoad("failed");
		});
		return () => {
			disposed = true;
			viewRef.current?.destroy();
			viewRef.current = null;
		};
	}, []);
	React.useEffect(() => {
		const editor = viewRef.current;
		const modules = modulesRef.current;
		const compartment = compartmentRef.current;
		if (load !== "ready" || !editor || !modules || !compartment) return;
		editor.dispatch({ effects: compartment.reconfigure(configure(modules)) });
	}, [load, configure]);
	React.useLayoutEffect(() => {
		const editor = viewRef.current;
		const selection = handoff.current;
		if (load !== "ready" || !editor || !selection) return;
		handoff.current = null;
		const length = editor.state.doc.length;
		editor.dispatch({ selection: {
			anchor: Math.min(selection.anchor, length),
			head: Math.min(selection.head, length)
		} });
		if (selection.focus) editor.focus();
	}, [load]);
	React.useEffect(() => {
		const editor = viewRef.current;
		const modules = modulesRef.current;
		if (load !== "ready" || !editor || !modules) return;
		const current = editor.state.doc.toString();
		if (current === lineFeeds(value)) return;
		editor.dispatch({
			changes: {
				from: 0,
				to: current.length,
				insert: value
			},
			annotations: modules.external.of(true)
		});
	});
	React.useEffect(() => {
		const controlId = field.id;
		if (load !== "ready" || !controlId) return void 0;
		const focusFromLabel = (event) => {
			if ((event.target instanceof Element ? event.target.closest("label") : null)?.htmlFor === controlId) viewRef.current?.focus();
		};
		document.addEventListener("click", focusFromLabel);
		return () => document.removeEventListener("click", focusFromLabel);
	}, [load, field.id]);
	return /* @__PURE__ */ jsxs("div", {
		"data-slot": "code-editor",
		"data-invalid": isInvalid || void 0,
		"data-readonly": readOnly || void 0,
		style: {
			...style,
			"--cipher-code-editor-rows": rows
		},
		className: cn(controls_module_default.field, code_editor_module_default.editor, className),
		...props,
		children: [load === "ready" ? null : /* @__PURE__ */ jsx("textarea", {
			ref: fallbackRef,
			className: code_editor_module_default.fallback,
			value,
			onChange: (event) => onChange?.(event.target.value),
			onKeyDown: (event) => {
				if (event.key !== "Enter" || !(event.metaKey || event.ctrlKey) || !onRun) return;
				event.preventDefault();
				const target = event.currentTarget;
				onRun(target.value.slice(target.selectionStart, target.selectionEnd) || target.value);
			},
			onSelect: (event) => {
				const target = event.currentTarget;
				const selected = target.value.slice(target.selectionStart, target.selectionEnd);
				if (selected === fallbackSelection.current) return;
				fallbackSelection.current = selected;
				onSelectionChange?.(selected);
			},
			placeholder,
			readOnly,
			maxLength,
			spellCheck: false,
			"aria-label": ariaLabel,
			...field,
			"aria-invalid": invalidValue
		}), /* @__PURE__ */ jsx("div", {
			ref: hostRef,
			className: code_editor_module_default.host,
			hidden: load !== "ready"
		})]
	});
}
CodeEditor.displayName = "CodeEditor";
export { CodeEditor };

//# sourceMappingURL=code-editor.js.map
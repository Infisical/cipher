"use client";

import * as React from "react";
import type { SQLDialect } from "@codemirror/lang-sql";
import type { Compartment, EditorState } from "@codemirror/state";
import type { EditorView } from "@codemirror/view";

import { useFieldControlAttributes } from "../lib/field-context";
import { cn } from "../lib/utils";

import controlStyles from "./controls.module.css";
import styles from "./code-editor.module.css";

export type CodeEditorDialect = "postgres" | "cockroachdb" | "mysql" | "snowflake" | "clickhouse";

export type CodeEditorHandle = {
  focus: () => void;
};

export type CodeEditorProps = Omit<
  React.ComponentPropsWithoutRef<"div">,
  "children" | "defaultValue" | "onChange"
> & {
  value: string;
  onChange?: (value: string) => void;
  /** The SQL engine whose keywords, types, quoting and comments are highlighted. */
  dialect?: CodeEditorDialect;
  /** Mod+Enter. Receives the selected text, or the whole query when nothing is selected. */
  onRun?: (query: string) => void;
  /** The selected text after every selection change, empty when nothing is selected. */
  onSelectionChange?: (selected: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  invalid?: boolean;
  /** Edits that would make the query longer than this many characters are refused. */
  maxLength?: number;
  /** Lines shown before the editor grows. Set a height with className to scroll instead. */
  rows?: number;
  ref?: React.Ref<CodeEditorHandle>;
};

type Loaded = Awaited<ReturnType<typeof loadEditor>>;

let editorModules: Promise<Loaded> | undefined;

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
  const dialects: Record<CodeEditorDialect, SQLDialect> = {
    postgres: sql.PostgreSQL,
    cockroachdb: sql.SQLDialect.define({
      ...postgres,
      keywords:
        postgres.keywords +
        " upsert interleave family experimental strict changefeed backup restore survive regions region zone configure scatter split unsplit relocate"
    }),
    mysql: sql.MySQL,
    snowflake: sql.SQLDialect.define({
      ...postgres,
      keywords:
        postgres.keywords +
        " qualify ilike rlike regexp warehouse stage pipe stream task clone undrop flatten sample tablesample put get list remove merge unpivot pivot",
      types: postgres.types + " variant object array geography number string"
    }),
    clickhouse: sql.SQLDialect.define({
      keywords:
        postgres.keywords +
        " final prewhere sample global any asof semi anti array settings format engine ttl optimize materialized codec attach detach system",
      types:
        "int8 int16 int32 int64 int128 int256 uint8 uint16 uint32 uint64 uint128 uint256 float32 float64 decimal decimal32 decimal64 decimal128 bool boolean string fixedstring uuid date date32 datetime datetime64 enum enum8 enum16 array tuple map nullable lowcardinality nested ipv4 ipv6 json",
      identifierQuotes: '\u0060"',
      backslashEscapes: true,
      hashComments: true
    })
  };
  const highlightStyle = language.HighlightStyle.define([
    { tag: tags.comment, class: styles.comment },
    { tag: [tags.string, tags.special(tags.string)], class: styles.string },
    { tag: [tags.keyword, tags.operatorKeyword, tags.bool, tags.null], class: styles.keyword },
    { tag: [tags.number, tags.typeName, tags.standard(tags.name)], class: styles.literal },
    { tag: tags.invalid, class: styles.invalid }
  ]);
  const theme = view.EditorView.theme({
    "&": { height: "100%", backgroundColor: "transparent", color: "var(--cipher-ink)" },
    "&.cm-focused": { outline: "none" },
    ".cm-scroller": { fontFamily: "inherit", lineHeight: "inherit" },
    ".cm-content": { padding: "0", caretColor: "var(--cipher-mark)" },
    ".cm-line": { padding: "0" },
    ".cm-cursor, .cm-dropCursor": { borderLeftColor: "var(--cipher-mark)" },
    "&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection":
      { backgroundColor: "var(--cipher-selected-surface)" },
    ".cm-placeholder": { color: "var(--cipher-muted)" },
    "&.cm-focused .cm-matchingBracket": {
      backgroundColor: "var(--cipher-selected-surface)",
      outline: "var(--cipher-size-control-border) solid var(--cipher-line)"
    },
    "&.cm-focused .cm-nonmatchingBracket": { backgroundColor: "transparent" }
  });
  const external = state.Annotation.define<boolean>();
  return { view, state, commands, language, sql, dialects, highlightStyle, theme, external };
}

export function CodeEditor({
  value,
  onChange,
  dialect = "postgres",
  onRun,
  onSelectionChange,
  placeholder,
  readOnly = false,
  invalid,
  maxLength,
  rows = 6,
  className,
  style,
  ref,
  id,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledby,
  "aria-describedby": ariaDescribedby,
  "aria-invalid": ariaInvalidProp,
  ...props
}: CodeEditorProps) {
  const field = useFieldControlAttributes({
    id,
    "aria-labelledby": ariaLabelledby,
    "aria-describedby": ariaDescribedby,
    "aria-invalid": ariaInvalidProp
  });
  const hostRef = React.useRef<HTMLDivElement>(null);
  const fallbackRef = React.useRef<HTMLTextAreaElement>(null);
  const viewRef = React.useRef<EditorView | null>(null);
  const modulesRef = React.useRef<Loaded | null>(null);
  const compartmentRef = React.useRef<Compartment | null>(null);
  const latest = React.useRef({ value, onChange, onRun, onSelectionChange });
  latest.current = { value, onChange, onRun, onSelectionChange };
  const [load, setLoad] = React.useState<"loading" | "ready" | "failed">("loading");
  const [, rerender] = React.useReducer((count: number) => count + 1, 0);
  const handoff = React.useRef<{ anchor: number; head: number } | null>(null);
  const fallbackSelection = React.useRef("");
  const ariaInvalid = field["aria-invalid"];
  const invalidValue = invalid
    ? "true"
    : ariaInvalid === undefined || ariaInvalid === false || ariaInvalid === "false"
      ? undefined
      : (String(ariaInvalid) as "true" | "grammar" | "spelling");
  const isInvalid = invalidValue !== undefined;

  React.useImperativeHandle(
    ref,
    () => ({
      focus: () => (viewRef.current ? viewRef.current.focus() : fallbackRef.current?.focus())
    }),
    []
  );

  const configure = React.useCallback(
    (modules: Loaded) => {
      const { view, state, sql, dialects, external } = modules;
      const attributes: Record<string, string> = { "aria-multiline": "true" };
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
        maxLength === undefined
          ? []
          : state.EditorState.transactionFilter.of((transaction) =>
              transaction.docChanged &&
              !transaction.annotation(external) &&
              transaction.newDoc.length > maxLength &&
              transaction.newDoc.length > transaction.startState.doc.length
                ? []
                : transaction
            )
      ];
    },
    [
      dialect,
      readOnly,
      placeholder,
      maxLength,
      ariaLabel,
      invalidValue,
      field.id,
      field["aria-labelledby"],
      field["aria-describedby"]
    ]
  );
  const configureRef = React.useRef(configure);
  configureRef.current = configure;

  React.useEffect(() => {
    let disposed = false;
    editorModules ??= loadEditor().catch((error: unknown) => {
      editorModules = undefined;
      throw error;
    });
    editorModules.then(
      (modules) => {
        const host = hostRef.current;
        if (disposed || !host) return;
        const { view, state, commands, language, highlightStyle, theme } = modules;
        const compartment = new state.Compartment();
        const selected = (editorState: EditorState) => {
          const range = editorState.selection.main;
          return range.empty ? "" : editorState.sliceDoc(range.from, range.to);
        };
        const fallback = fallbackRef.current;
        handoff.current =
          fallback && document.activeElement === fallback
            ? { anchor: fallback.selectionStart, head: fallback.selectionEnd }
            : null;
        const editor = new view.EditorView({
          parent: host,
          state: state.EditorState.create({
            doc: latest.current.value,
            extensions: [
              state.Prec.highest(
                view.keymap.of([
                  {
                    key: "Mod-Enter",
                    run: (target) => {
                      const run = latest.current.onRun;
                      if (!run) return false;
                      run(selected(target.state) || target.state.doc.toString());
                      return true;
                    }
                  }
                ])
              ),
              commands.history(),
              view.keymap.of([...commands.defaultKeymap, ...commands.historyKeymap]),
              view.drawSelection(),
              language.bracketMatching(),
              language.syntaxHighlighting(highlightStyle),
              view.EditorView.lineWrapping,
              theme,
              compartment.of(configureRef.current(modules)),
              view.EditorView.updateListener.of((update) => {
                if (update.docChanged) {
                  const next = update.state.doc.toString();
                  if (next !== latest.current.value) {
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
      },
      (error: unknown) => {
        if (disposed) return;
        console.error(
          "CodeEditor needs the optional peer dependencies @codemirror/view, @codemirror/state, @codemirror/commands, @codemirror/language, @codemirror/lang-sql and @lezer/highlight.",
          error
        );
        setLoad("failed");
      }
    );
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
    editor.dispatch({
      selection: {
        anchor: Math.min(selection.anchor, length),
        head: Math.min(selection.head, length)
      }
    });
    editor.focus();
  }, [load]);

  React.useEffect(() => {
    const editor = viewRef.current;
    const modules = modulesRef.current;
    if (load !== "ready" || !editor || !modules) return;
    const current = editor.state.doc.toString();
    if (current === value) return;
    editor.dispatch({
      changes: { from: 0, to: current.length, insert: value },
      annotations: modules.external.of(true)
    });
  });

  React.useEffect(() => {
    const controlId = field.id;
    if (load !== "ready" || !controlId) return undefined;
    const focusFromLabel = (event: MouseEvent) => {
      const label = event.target instanceof Element ? event.target.closest("label") : null;
      if (label?.htmlFor === controlId) viewRef.current?.focus();
    };
    document.addEventListener("click", focusFromLabel);
    return () => document.removeEventListener("click", focusFromLabel);
  }, [load, field.id]);

  return (
    <div
      data-slot="code-editor"
      data-invalid={isInvalid || undefined}
      data-readonly={readOnly || undefined}
      style={{ ...style, "--cipher-code-editor-rows": rows } as React.CSSProperties}
      className={cn(controlStyles.field, styles.editor, className)}
      {...props}
    >
      {load === "ready" ? null : (
        <textarea
          ref={fallbackRef}
          className={styles.fallback}
          value={value}
          onChange={(event) => onChange?.(event.target.value)}
          onKeyDown={(event) => {
            if (event.key !== "Enter" || !(event.metaKey || event.ctrlKey) || !onRun) return;
            event.preventDefault();
            const target = event.currentTarget;
            onRun(target.value.slice(target.selectionStart, target.selectionEnd) || target.value);
          }}
          onSelect={(event) => {
            const target = event.currentTarget;
            const selected = target.value.slice(target.selectionStart, target.selectionEnd);
            if (selected === fallbackSelection.current) return;
            fallbackSelection.current = selected;
            onSelectionChange?.(selected);
          }}
          placeholder={placeholder}
          readOnly={readOnly}
          maxLength={maxLength}
          spellCheck={false}
          aria-label={ariaLabel}
          {...field}
          aria-invalid={invalidValue}
        />
      )}
      <div ref={hostRef} className={styles.host} hidden={load !== "ready"} />
    </div>
  );
}
CodeEditor.displayName = "CodeEditor";

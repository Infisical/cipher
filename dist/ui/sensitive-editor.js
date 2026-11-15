import { useFieldControlAttributes } from "../lib/field-context.js";
import { Button } from "./button.js";
import button_geometry_module_default from "./button-geometry.module.js";
import data_module_default from "./data.module.js";
import * as React from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
// src/ui/sensitive-editor.tsx
async function writeClipboard(value) {
	if (!navigator.clipboard?.writeText) throw new Error("Clipboard access is unavailable.");
	await navigator.clipboard.writeText(value);
}
function CopyButton({ value, label = "Copy value", onCopy, writeClipboard: writer = writeClipboard, disabled, size = "sm", iconOnly = false }) {
	const [state, setState] = React.useState("idle");
	const turn = React.useRef(0);
	const pending = React.useRef(false);
	React.useEffect(() => {
		turn.current += 1;
		pending.current = false;
		setState("idle");
		return () => {
			turn.current += 1;
		};
	}, [typeof value === "string" ? value : null]);
	React.useEffect(() => {
		if (state !== "copied") return;
		const timer = window.setTimeout(() => setState("idle"), 1200);
		return () => window.clearTimeout(timer);
	}, [state]);
	const copy = async () => {
		if (pending.current) return;
		pending.current = true;
		turn.current += 1;
		const { current } = turn;
		setState("pending");
		try {
			const text = typeof value === "string" ? value : await value();
			await writer(text);
			if (current === turn.current) {
				setState("copied");
				onCopy?.(text);
			}
		} catch {
			if (current === turn.current) setState("failed");
		} finally {
			if (current === turn.current) pending.current = false;
		}
	};
	return /* @__PURE__ */ jsxs("span", {
		className: `${data_module_default.copy} ${data_module_default[`copy${size}`]}`,
		"data-slot": "copy-button",
		"data-size": size,
		"data-copy-state": state,
		children: [/* @__PURE__ */ jsx(Button, {
			type: "button",
			variant: "ghost",
			className: button_geometry_module_default.nestedAction,
			iconOnly,
			icon: iconOnly ? state === "copied" ? "check" : "copy" : void 0,
			title: iconOnly ? state === "copied" ? "Copied" : label : void 0,
			disabled,
			loading: state === "pending",
			onClick: () => copy(),
			children: state === "copied" ? "Copied" : label
		}), /* @__PURE__ */ jsx("span", {
			role: "status",
			"data-copy-feedback": true,
			className: state === "failed" ? data_module_default.smallStatus : data_module_default.sr,
			children: state === "failed" ? "Copy failed. Try again." : state === "copied" ? "Copied" : ""
		})]
	});
}
function SecretValue({ value, copyable = true, label = "Secret value", onCopy, id, ...aria }) {
	const control = useFieldControlAttributes({
		...id ? { id } : {},
		...aria
	});
	const [revealed, setRevealed] = React.useState(null);
	React.useEffect(() => setRevealed(null), [value]);
	const shown = revealed === value;
	return /* @__PURE__ */ jsxs("div", {
		className: data_module_default.secret,
		children: [
			/* @__PURE__ */ jsx("span", {
				role: "textbox",
				"aria-readonly": true,
				"aria-label": label,
				title: shown ? value : void 0,
				...control,
				className: data_module_default.machine,
				children: shown ? value : "••••••••"
			}),
			/* @__PURE__ */ jsx(Button, {
				type: "button",
				variant: "ghost",
				className: button_geometry_module_default.nestedAction,
				iconOnly: true,
				icon: shown ? "eye-off" : "eye",
				title: shown ? "Hide value" : "Reveal value",
				"aria-pressed": shown,
				onClick: () => setRevealed(shown ? null : value),
				children: shown ? "Hide value" : "Reveal value"
			}),
			copyable && /* @__PURE__ */ jsx(CopyButton, {
				value,
				onCopy,
				iconOnly: true
			})
		]
	});
}
function SensitiveEditor({ stored, label, multiline = false, readOnly = false, onReveal, onSave, onCopy, copyable = true }) {
	return /* @__PURE__ */ jsx(SensitiveEditorSession, {
		stored,
		label,
		multiline,
		readOnly,
		onReveal,
		onSave,
		onCopy,
		copyable
	}, `${stored.id}:${stored.revision}:${stored.hasValue}:${Boolean(onReveal)}:${Boolean(onSave)}:${readOnly}`);
}
function SensitiveEditorSession({ stored, label, multiline, readOnly, onReveal, onSave, onCopy, copyable }) {
	const [view, setView] = React.useState({ kind: "masked" });
	const [draft, setDraft] = React.useState(null);
	const [saving, setSaving] = React.useState(false);
	const [notice, setNotice] = React.useState({
		message: "",
		failed: false
	});
	const { message, failed } = notice;
	const setMessage = (text, error = false) => setNotice({
		message: text,
		failed: error
	});
	const controller = React.useRef(null);
	const request = React.useRef(0);
	const savingRef = React.useRef(false);
	const uid = React.useId();
	const editRef = React.useRef(null);
	const region = React.useRef(null);
	React.useEffect(() => () => {
		request.current += 1;
		controller.current?.abort();
	}, []);
	React.useEffect(() => {
		if (draft !== null) editRef.current?.focus();
	}, [draft === null]);
	const hide = () => {
		request.current += 1;
		controller.current?.abort();
		setView({ kind: "masked" });
	};
	const reveal = async () => {
		if (!onReveal || view.kind === "loading") return;
		request.current += 1;
		const { current } = request;
		controller.current?.abort();
		const next = new AbortController();
		controller.current = next;
		setView({ kind: "loading" });
		setMessage("");
		try {
			const value = await onReveal({ signal: next.signal });
			if (request.current === current && !next.signal.aborted) setView({
				kind: "revealed",
				value
			});
		} catch {
			if (request.current === current && !next.signal.aborted) {
				setView({ kind: "failed" });
				setMessage("The value could not be revealed. Check access and try again.", true);
			}
		}
	};
	const save = async () => {
		if (draft === null || !onSave || savingRef.current) return;
		request.current += 1;
		const { current } = request;
		controller.current?.abort();
		const next = new AbortController();
		controller.current = next;
		savingRef.current = true;
		setSaving(true);
		setMessage("Saving replacement");
		try {
			await onSave(draft, {
				signal: next.signal,
				stored
			});
			if (request.current === current && !next.signal.aborted) {
				setDraft(null);
				setView({ kind: "masked" });
				setMessage("Replacement saved");
				region.current?.focus();
			}
		} catch {
			if (request.current === current && !next.signal.aborted) setMessage("The replacement was not saved. Your draft is kept. Retry or cancel.", true);
		} finally {
			if (request.current === current) {
				savingRef.current = false;
				setSaving(false);
			}
		}
	};
	return /* @__PURE__ */ jsxs("div", {
		className: data_module_default.editor,
		role: "group",
		ref: region,
		tabIndex: -1,
		"aria-label": label,
		"data-cipher-escape-owner": draft !== null || view.kind === "loading" || view.kind === "revealed" ? "" : void 0,
		onKeyDown: (event) => {
			if (event.key === "Escape" && !saving && (draft !== null || view.kind === "loading" || view.kind === "revealed")) {
				event.preventDefault();
				event.stopPropagation();
				setDraft(null);
				hide();
				setMessage("Edit cancelled");
				region.current?.focus();
			}
		},
		children: [
			/* @__PURE__ */ jsx("label", {
				className: data_module_default.label,
				htmlFor: draft !== null ? uid : void 0,
				children: label
			}),
			draft !== null ? /* @__PURE__ */ jsx("textarea", {
				id: uid,
				ref: editRef,
				rows: multiline ? 3 : 1,
				"aria-describedby": `${uid}-status`,
				placeholder: "New value",
				value: draft,
				disabled: saving,
				autoComplete: "off",
				spellCheck: false,
				onChange: (event) => {
					setDraft(event.target.value);
					setMessage("");
				},
				className: data_module_default.editorInput
			}) : /* @__PURE__ */ jsxs("div", {
				className: data_module_default.secret,
				"data-multiline": multiline || void 0,
				children: [
					/* @__PURE__ */ jsx("span", {
						className: data_module_default.machine,
						title: view.kind === "revealed" ? view.value : void 0,
						"aria-label": view.kind === "revealed" ? void 0 : stored.hasValue ? "Stored value is hidden" : "No stored value",
						children: view.kind === "revealed" ? view.value : stored.hasValue ? "••••••••" : "No value"
					}),
					/* @__PURE__ */ jsx(Button, {
						type: "button",
						variant: "ghost",
						className: button_geometry_module_default.nestedAction,
						iconOnly: true,
						icon: view.kind === "revealed" ? "eye-off" : "eye",
						title: !onReveal ? "You do not have permission to view this value" : !stored.hasValue ? "No stored value" : view.kind === "revealed" ? "Hide value" : "Reveal value",
						disabled: !onReveal || !stored.hasValue,
						loading: view.kind === "loading",
						"aria-pressed": view.kind === "revealed",
						onClick: () => view.kind === "revealed" ? hide() : reveal(),
						children: view.kind === "revealed" ? "Hide value" : "Reveal value"
					}),
					copyable && /* @__PURE__ */ jsx(CopyButton, {
						value: view.kind === "revealed" ? view.value : () => onReveal ? onReveal({ signal: new AbortController().signal }) : Promise.reject(),
						onCopy,
						disabled: !onReveal || !stored.hasValue,
						iconOnly: true
					})
				]
			}),
			(draft !== null || stored.hasValue || onSave) && /* @__PURE__ */ jsx("div", {
				className: data_module_default.editorActions,
				children: draft !== null ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Button, {
					type: "button",
					variant: "outline",
					disabled: saving,
					onClick: () => {
						setDraft(null);
						hide();
						setMessage("Edit cancelled");
						region.current?.focus();
					},
					children: "Cancel"
				}), /* @__PURE__ */ jsx(Button, {
					type: "button",
					loading: saving,
					onClick: () => save(),
					children: "Save replacement"
				})] }) : /* @__PURE__ */ jsx(Button, {
					type: "button",
					variant: "outline",
					disabled: readOnly || !onSave,
					title: readOnly || !onSave ? "You do not have permission to change this value" : void 0,
					onClick: () => {
						setDraft("");
						hide();
						setMessage("");
					},
					children: "Replace without viewing"
				})
			}),
			/* @__PURE__ */ jsx("div", {
				id: `${uid}-status`,
				role: "status",
				className: failed ? data_module_default.editorError : data_module_default.sr,
				children: message
			})
		]
	});
}
export { CopyButton, SecretValue, SensitiveEditor, writeClipboard };

//# sourceMappingURL=sensitive-editor.js.map
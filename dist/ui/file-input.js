import { useFieldControlAttributes } from "../lib/field-context.js";
import { cn } from "../lib/utils.js";
import { Button } from "./button.js";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "./empty.js";
import { Icon } from "./icon.js";
import { Media } from "./item.js";
import { MiddleTruncate } from "./middle-truncate.js";
import file_input_module_default from "./file-input.module.js";
import helpers_module_default from "./helpers.module.js";
import * as React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
// src/ui/file-input.tsx
var UNITS = [
	"B",
	"KB",
	"MB",
	"GB"
];
var formatFileSize = (bytes) => {
	let value = bytes;
	let unit = 0;
	while (value >= 1024 && unit < UNITS.length - 1) {
		value /= 1024;
		unit += 1;
	}
	return `${unit === 0 || value >= 10 ? Math.round(value) : Math.round(value * 10) / 10} ${UNITS[unit]}`;
};
var acceptTokens = (accept) => (accept ?? "").split(",").map((token) => token.trim().toLowerCase()).filter(Boolean);
var matchesAccept = (file, tokens) => {
	if (!tokens.length) return true;
	const name = file.name.toLowerCase();
	const type = file.type.toLowerCase();
	return tokens.some((token) => {
		if (token.startsWith(".")) return name.endsWith(token);
		if (token.endsWith("/*")) return type.startsWith(token.slice(0, -1));
		return type === token;
	});
};
var typeLabel = (token) => {
	if (token.startsWith(".")) return token.slice(1).toUpperCase();
	const [group, subtype] = token.split("/");
	if (subtype === "*") return `${group.charAt(0).toUpperCase()}${group.slice(1)} files`;
	return (subtype ?? group).replace(/^x-|\+.*$/g, "").toUpperCase();
};
var listFormat = (items) => items.length < 2 ? items.join("") : `${items.slice(0, -1).join(", ")} or ${items.at(-1)}`;
var MAX_LISTED_REJECTIONS = 3;
/**
* A drop target for files with a Browse button over a hidden native file input. Picked and dropped
* files are filtered by accept and maxSize; the rest are named in a live region instead of added.
*/
function FileInput({ files, onFiles, onRemove, accept, multiple = false, maxSize, disabled = false, error, title, hint, icon = "upload", size = "default", className, name, ref, ...props }) {
	const field = useFieldControlAttributes(props);
	const generated = React.useId();
	const titleId = `${generated}-title`;
	const hintId = `${generated}-hint`;
	const messageId = `${generated}-message`;
	const input = React.useRef(null);
	const zone = React.useRef(null);
	React.useImperativeHandle(ref, () => input.current, []);
	const [dragging, setDragging] = React.useState(false);
	const [rejected, setRejected] = React.useState({
		attempt: 0,
		messages: []
	});
	const rejections = rejected.messages;
	const setRejections = (messages) => setRejected((current) => ({
		attempt: current.attempt + 1,
		messages
	}));
	const locked = () => disabled || Boolean(input.current?.matches(":disabled"));
	const tokens = acceptTokens(accept);
	const noun = multiple ? "files" : "a file";
	const sizeLabel = maxSize === void 0 ? void 0 : formatFileSize(maxSize);
	const typesLabel = tokens.length ? listFormat([...new Set(tokens.map(typeLabel))]) : void 0;
	const derivedHint = [typesLabel, sizeLabel && `up to ${sizeLabel}`].filter(Boolean).join(", ");
	const hintText = hint ?? (derivedHint && derivedHint.charAt(0).toUpperCase() + derivedHint.slice(1));
	const invalid = Boolean(error || rejections.length || field["aria-invalid"]);
	const messages = [...error ? [error] : [], ...rejections];
	const take = (list) => {
		if (locked() || !list.length) return;
		if (!multiple && list.length > 1) {
			setRejections(["Drop one file at a time."]);
			return;
		}
		const accepted = [];
		const rejected = [];
		for (const file of list) if (!matchesAccept(file, tokens)) rejected.push(`${file.name} isn't a ${typesLabel} file.`);
		else if (maxSize !== void 0 && file.size > maxSize) rejected.push(`${file.name} is larger than ${sizeLabel}.`);
		else accepted.push(file);
		const hidden = rejected.length - MAX_LISTED_REJECTIONS;
		setRejections(hidden > 0 ? [...rejected.slice(0, MAX_LISTED_REJECTIONS), `${hidden} more ${hidden === 1 ? "file was" : "files were"} not added.`] : rejected);
		if (accepted.length) onFiles(accepted);
	};
	const browse = () => {
		if (!locked()) input.current?.click();
	};
	const leaves = (event) => !(event.relatedTarget instanceof Node && event.currentTarget.contains(event.relatedTarget));
	return /* @__PURE__ */ jsxs("div", {
		"data-slot": "file-input",
		"data-size": size,
		className: cn(file_input_module_default.root, className),
		children: [
			/* @__PURE__ */ jsx("input", {
				ref: input,
				id: field.id,
				name,
				type: "file",
				accept,
				multiple,
				disabled,
				tabIndex: -1,
				hidden: true,
				onChange: (event) => {
					take(Array.from(event.target.files ?? []));
					event.target.value = "";
				}
			}),
			/* @__PURE__ */ jsxs(Empty, {
				ref: zone,
				size,
				role: "button",
				tabIndex: disabled ? -1 : 0,
				"aria-label": props["aria-label"],
				"aria-labelledby": props["aria-label"] ? void 0 : [field["aria-labelledby"], titleId].filter(Boolean).join(" "),
				"aria-describedby": [
					hintText ? hintId : void 0,
					messages.length ? messageId : void 0,
					field["aria-describedby"]
				].filter(Boolean).join(" ") || void 0,
				"aria-disabled": disabled || void 0,
				"aria-invalid": invalid || void 0,
				"data-dragging": dragging || void 0,
				"data-disabled": disabled || void 0,
				"data-invalid": invalid || void 0,
				className: file_input_module_default.zone,
				onClick: browse,
				onKeyDown: (event) => {
					if (event.target !== event.currentTarget) return;
					if (event.key !== "Enter" && event.key !== " ") return;
					event.preventDefault();
					browse();
				},
				onDragEnter: (event) => {
					event.preventDefault();
					if (!locked()) setDragging(true);
				},
				onDragOver: (event) => {
					event.preventDefault();
					event.dataTransfer.dropEffect = locked() ? "none" : "copy";
				},
				onDragLeave: (event) => {
					if (leaves(event)) setDragging(false);
				},
				onDrop: (event) => {
					event.preventDefault();
					setDragging(false);
					take(Array.from(event.dataTransfer.files));
				},
				children: [
					/* @__PURE__ */ jsx(EmptyMedia, { children: /* @__PURE__ */ jsx(Icon, { icon }) }),
					/* @__PURE__ */ jsxs(EmptyHeader, { children: [/* @__PURE__ */ jsx(EmptyTitle, {
						id: titleId,
						children: dragging ? `Drop to add ${multiple ? "the files" : "the file"}` : title ?? `Drop ${noun} or browse`
					}), hintText && /* @__PURE__ */ jsx(EmptyDescription, {
						id: hintId,
						children: hintText
					})] }),
					/* @__PURE__ */ jsx(EmptyContent, { children: /* @__PURE__ */ jsx(Button, {
						asChild: true,
						variant: "outline",
						size: size === "sm" ? "xs" : "default",
						children: /* @__PURE__ */ jsx("span", {
							"aria-hidden": "true",
							children: "Browse"
						})
					}) })
				]
			}),
			/* @__PURE__ */ jsx("div", {
				id: messageId,
				"aria-live": "polite",
				className: file_input_module_default.messages,
				children: messages.map((message, index) => /* @__PURE__ */ jsxs("p", {
					className: helpers_module_default.fieldError,
					children: [/* @__PURE__ */ jsx(Icon, {
						name: "alert",
						size: 14
					}), /* @__PURE__ */ jsx("span", { children: message })]
				}, `${rejected.attempt}-${index}`))
			}),
			Boolean(files?.length) && /* @__PURE__ */ jsx("ul", {
				className: file_input_module_default.list,
				"aria-label": multiple ? "Selected files" : "Selected file",
				children: files.map((file, index) => /* @__PURE__ */ jsxs("li", {
					className: file_input_module_default.file,
					children: [
						/* @__PURE__ */ jsx(Media, {
							icon: "file",
							size: "sm"
						}),
						/* @__PURE__ */ jsx(MiddleTruncate, {
							className: file_input_module_default.name,
							keepEnd: file.name.lastIndexOf(".") > 0 ? Math.max(8, file.name.length - file.name.lastIndexOf(".")) : 8,
							children: file.name
						}),
						/* @__PURE__ */ jsx("span", {
							className: file_input_module_default.size,
							children: formatFileSize(file.size)
						}),
						onRemove && /* @__PURE__ */ jsx(Button, {
							type: "button",
							variant: "ghost",
							size: "icon-xs",
							icon: "x",
							iconOnly: true,
							disabled,
							onClick: () => {
								onRemove(file, index);
								zone.current?.focus();
							},
							children: `Remove ${file.name}`
						})
					]
				}, `${file.name}-${index}`))
			})
		]
	});
}
FileInput.displayName = "FileInput";
export { FileInput, formatFileSize };

//# sourceMappingURL=file-input.js.map
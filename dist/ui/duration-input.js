import { FieldControlContext, useFieldControlAttributes } from "../lib/field-context.js";
import { Input } from "./input.js";
import { Select } from "./select.js";
import duration_input_module_default from "./duration-input.module.js";
import * as React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
// src/ui/duration-input.tsx
var DURATION_UNITS = [
	{
		value: "s",
		label: "Seconds",
		milliseconds: 1e3
	},
	{
		value: "m",
		label: "Minutes",
		milliseconds: 6e4
	},
	{
		value: "h",
		label: "Hours",
		milliseconds: 36e5
	},
	{
		value: "d",
		label: "Days",
		milliseconds: 864e5
	},
	{
		value: "w",
		label: "Weeks",
		milliseconds: 6048e5
	}
];
var parseDuration = (value) => {
	const explicit = value.trim().match(/^(\d+(?:\.\d+)?)\s*([smhdw])$/i);
	if (explicit) return {
		amount: explicit[1],
		unit: explicit[2].toLowerCase()
	};
	if (!/^\d+(?:\.\d+)?$/.test(value.trim())) return null;
	const milliseconds = Number(value);
	const unit = [...DURATION_UNITS].reverse().find((option) => milliseconds % option.milliseconds === 0);
	if (unit) return {
		amount: String(milliseconds / unit.milliseconds),
		unit: unit.value
	};
	return {
		amount: String(milliseconds / 1e3),
		unit: "s"
	};
};
/**
* An amount and a unit that read and emit the ms() string main sends for access durations:
* the amount followed by s, m, h, d or w ("1h", "1.5d"), or "" when the amount is cleared.
*/
function DurationInput({ value, onChange, invalid, disabled, placeholder, ref, ...props }) {
	const field = useFieldControlAttributes(props);
	const unitLabelId = React.useId();
	const parsed = parseDuration(value);
	const [pendingUnit, setPendingUnit] = React.useState("h");
	const unit = parsed?.unit ?? pendingUnit;
	const amount = parsed?.amount ?? "";
	const label = props["aria-label"] ?? (field["aria-labelledby"] ? void 0 : "Duration");
	const labelledBy = label ? void 0 : field["aria-labelledby"];
	return /* @__PURE__ */ jsx(FieldControlContext, {
		value: {},
		children: /* @__PURE__ */ jsxs("div", {
			role: "group",
			"data-slot": "duration-input",
			"aria-label": label,
			"aria-labelledby": labelledBy,
			className: duration_input_module_default.durationInput,
			children: [
				/* @__PURE__ */ jsx(Input, {
					ref,
					id: field.id,
					type: "number",
					inputMode: "decimal",
					min: "0.001",
					step: "any",
					value: amount,
					placeholder,
					disabled,
					invalid: invalid || Boolean(field["aria-invalid"]),
					"aria-label": label,
					"aria-labelledby": labelledBy,
					"aria-describedby": field["aria-describedby"],
					onChange: (event) => onChange(event.target.value ? `${event.target.value}${unit}` : "")
				}),
				/* @__PURE__ */ jsx(Select, {
					value: unit,
					disabled,
					invalid: invalid || Boolean(field["aria-invalid"]),
					options: DURATION_UNITS.map(({ value: option, label: optionLabel }) => ({
						value: option,
						label: optionLabel
					})),
					"aria-label": label ? `${label} unit` : void 0,
					"aria-labelledby": labelledBy ? `${labelledBy} ${unitLabelId}` : void 0,
					onChange: (next) => {
						setPendingUnit(next);
						if (amount) onChange(`${amount}${next}`);
					}
				}),
				labelledBy && /* @__PURE__ */ jsx("span", {
					id: unitLabelId,
					hidden: true,
					children: "unit"
				})
			]
		})
	});
}
DurationInput.displayName = "DurationInput";
export { DurationInput };

//# sourceMappingURL=duration-input.js.map
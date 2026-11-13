import { cn } from "../lib/utils.js";
import controls_module_default from "./controls.module.js";
import * as React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { Slider as Slider$1 } from "radix-ui";
// src/ui/slider.tsx
function Slider({ className, defaultValue, value, min = 0, max = 100, thumbLabels, "aria-label": label, "aria-labelledby": labelledBy, ref, ...props }) {
	const _values = React.useMemo(() => Array.isArray(value) ? value : Array.isArray(defaultValue) ? defaultValue : [min], [
		value,
		defaultValue,
		min
	]);
	return /* @__PURE__ */ jsxs(Slider$1.Root, {
		ref,
		"data-slot": "slider",
		defaultValue: defaultValue ?? [min],
		value,
		min,
		max,
		className: cn("relative flex w-full touch-none items-center select-none data-disabled:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-40 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col", className),
		...props,
		children: [/* @__PURE__ */ jsx(Slider$1.Track, {
			"data-slot": "slider-track",
			className: cn(controls_module_default.sliderTrack, "relative grow overflow-hidden data-[orientation=horizontal]:h-1 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1"),
			children: /* @__PURE__ */ jsx(Slider$1.Range, {
				"data-slot": "slider-range",
				className: cn(controls_module_default.sliderRange, "absolute select-none data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full")
			})
		}), Array.from({ length: _values.length }, (_, index) => /* @__PURE__ */ jsx(Slider$1.Thumb, {
			"data-slot": "slider-thumb",
			"aria-label": thumbLabels?.[index] ?? (label ? `${label}${_values.length > 1 ? ` ${index + 1}` : ""}` : labelledBy ? void 0 : `Value${_values.length > 1 ? ` ${index + 1}` : ""}`),
			"aria-labelledby": thumbLabels?.[index] ? void 0 : labelledBy,
			className: cn(controls_module_default.focusOutline, controls_module_default.sliderThumb, "relative block shrink-0 select-none after:absolute after:-inset-2 disabled:pointer-events-none disabled:opacity-50")
		}, index))]
	});
}
Slider.displayName = "Slider";
export { Slider };

//# sourceMappingURL=slider.js.map
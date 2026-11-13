import { Badge } from "../ui/badge.js";
import { FieldError } from "../ui/field.js";
import { Icon } from "../ui/icon.js";
import { Input } from "../ui/input.js";
import field_mapping_module_default from "./field-mapping.module.js";
import * as React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { ArrowRightIcon } from "lucide-react";
// src/patterns/field-mapping.tsx
var FieldMappingContext = React.createContext({
	size: "sm",
	targetHeader: "Value"
});
var FieldMapping = ({ legend, sourceHeader, targetHeader, targetHint, size = "sm", children }) => {
	const context = React.useMemo(() => ({
		size,
		targetHeader
	}), [size, targetHeader]);
	return /* @__PURE__ */ jsxs("fieldset", {
		className: field_mapping_module_default.fieldMapping,
		children: [/* @__PURE__ */ jsx("legend", {
			className: field_mapping_module_default.legend,
			children: legend
		}), /* @__PURE__ */ jsxs("div", {
			className: field_mapping_module_default.grid,
			"data-size": size,
			children: [
				/* @__PURE__ */ jsx("span", {
					className: field_mapping_module_default.head,
					children: sourceHeader
				}),
				/* @__PURE__ */ jsx("span", {}),
				/* @__PURE__ */ jsxs("span", {
					className: field_mapping_module_default.head,
					children: [targetHeader, targetHint]
				}),
				/* @__PURE__ */ jsx(FieldMappingContext.Provider, {
					value: context,
					children
				})
			]
		})]
	});
};
var FieldMappingRow = ({ source, icon, error, ...props }) => {
	const { size, targetHeader } = React.useContext(FieldMappingContext);
	return /* @__PURE__ */ jsxs("div", {
		className: field_mapping_module_default.row,
		children: [
			/* @__PURE__ */ jsx("span", {
				className: field_mapping_module_default.source,
				children: /* @__PURE__ */ jsxs(Badge, {
					tone: "soft",
					size: `control-${size}`,
					children: [icon && /* @__PURE__ */ jsx(Icon, { name: icon }), source]
				})
			}),
			/* @__PURE__ */ jsx("span", {
				className: field_mapping_module_default.arrow,
				"aria-hidden": "true",
				children: /* @__PURE__ */ jsx(Icon, { icon: ArrowRightIcon })
			}),
			/* @__PURE__ */ jsxs("div", {
				className: field_mapping_module_default.target,
				children: [/* @__PURE__ */ jsx(Input, {
					"aria-label": `${targetHeader} for ${source}`,
					...props,
					size,
					invalid: Boolean(error)
				}), error && /* @__PURE__ */ jsx(FieldError, { children: error })]
			})
		]
	});
};
export { FieldMapping, FieldMappingRow };

//# sourceMappingURL=field-mapping.js.map
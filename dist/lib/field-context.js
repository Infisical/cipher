import * as React from "react";
// src/lib/field-context.ts
var FieldControlContext = React.createContext({});
var FieldErrorsContext = React.createContext(null);
function useFieldControlAttributes(props) {
	const field = React.useContext(FieldControlContext);
	return {
		id: props.id ?? field.id,
		"aria-labelledby": props["aria-labelledby"] ?? field["aria-labelledby"],
		"aria-invalid": field["aria-invalid"] || props["aria-invalid"],
		"aria-describedby": [field["aria-describedby"], props["aria-describedby"]].filter(Boolean).join(" ") || void 0
	};
}
export { FieldControlContext, FieldErrorsContext, useFieldControlAttributes };

//# sourceMappingURL=field-context.js.map
import { useState } from "react";
// src/lib/use-controllable-state.ts
var useControllableState = ({ value, defaultValue, onChange }) => {
	const [internal, setInternal] = useState(defaultValue);
	const current = value === void 0 ? internal : value;
	const setValue = (next) => {
		if (value === void 0) setInternal(next);
		if (next !== current) onChange?.(next);
	};
	return [current, setValue];
};
export { useControllableState };

//# sourceMappingURL=use-controllable-state.js.map
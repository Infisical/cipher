import * as React from "react";
// src/lib/row-description.ts
/** Elements that act on their own when clicked or pressed, so they never pass a click or Enter through to their row. */
var interactiveControl = "a, button, input, select, textarea, summary, [contenteditable], [role=button], [role=checkbox], [role=combobox], [role=link], [role=menuitem], [role=switch], [role=tab]";
var RowDescriptionContext = React.createContext(null);
/**
* A focusable, activatable table row reads its pass-through content to assistive technology: a TooltipText
* inside it is no tab stop of its own, so its tooltip text joins the row's description instead.
*/
function useRowDescriptionHost(active) {
	const [ids, setIds] = React.useState([]);
	const describe = React.useCallback((id) => {
		setIds((current) => [...current, id]);
		return () => setIds((current) => current.filter((item) => item !== id));
	}, []);
	return [active ? ids : [], active ? describe : null];
}
export { RowDescriptionContext, interactiveControl, useRowDescriptionHost };

//# sourceMappingURL=row-description.js.map
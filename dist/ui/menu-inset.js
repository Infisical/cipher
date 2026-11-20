import { useDescendantFlags } from "../lib/descendant-flags.js";
import menu_module_default from "./menu.module.js";
// src/ui/menu-inset.ts
var leadIcon = `:is(svg, [data-menu-icon]):not(.${menu_module_default.trail})`;
var insetFlags = { "data-icon-slot": `.${menu_module_default.row} > ${leadIcon}, .${menu_module_default.row}[data-inset], .${menu_module_default.label}[data-inset]` };
var insetWatch = {
	attributes: ["data-inset"],
	marks: { "data-lead-icon": `.${menu_module_default.row}:has(> ${leadIcon})` }
};
/** The ref for a menu inset: it reserves the lead icon column once any row has an icon or is inset, and marks the rows that bring their own icon. */
var useMenuInset = (ref) => useDescendantFlags(insetFlags, insetWatch, ref);
export { useMenuInset };

//# sourceMappingURL=menu-inset.js.map
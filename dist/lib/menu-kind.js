import * as React from "react";
import { ContextMenu, DropdownMenu } from "radix-ui";
// src/lib/menu-kind.ts
/** Which menu a shared item renders in, so the DropdownMenu items also render inside a ContextMenu. */
var MenuKindContext = React.createContext("dropdown");
/** The Radix primitives for the menu an item sits in. Both share the same Menu parts and props. */
var useMenuPrimitive = () => React.useContext(MenuKindContext) === "context" ? ContextMenu : DropdownMenu;
export { MenuKindContext, useMenuPrimitive };

//# sourceMappingURL=menu-kind.js.map
import * as React from "react";
import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui";
/** Which menu a shared item renders in, so the DropdownMenu items also render inside a ContextMenu. */
export declare const MenuKindContext: React.Context<"context" | "dropdown">;
/** The Radix primitives for the menu an item sits in. Both share the same Menu parts and props. */
export declare const useMenuPrimitive: () => typeof DropdownMenuPrimitive;

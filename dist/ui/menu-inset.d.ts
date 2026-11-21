import * as React from "react";
/** The ref for a menu inset: it reserves the lead icon column once any row has an icon or is inset, and marks the rows that bring their own icon. */
export declare const useMenuInset: <T extends Element>(ref?: React.Ref<T>) => (element: T | null) => void;

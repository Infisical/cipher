import * as React from "react";
/** An open overlay's footer lifts the toasts above itself whenever they would reach it, so a toast never covers its buttons. Returns the footer's ref. */
export declare function useToastFooterReserve<T extends HTMLElement>(ref: React.Ref<T> | undefined): (value: T) => () => void;

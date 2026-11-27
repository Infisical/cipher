import { type CSSProperties } from "react";
export declare const useFlowTransition: (index: number) => {
    measure: (element: HTMLElement | null) => void;
    style: CSSProperties;
    ready: boolean;
    reduced: boolean;
    direction: "back" | "forward";
    intend: import("react").Dispatch<import("react").SetStateAction<"back" | "forward" | undefined>>;
};

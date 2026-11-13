import * as React from "react";
declare function Detail({ className, ref, ...props }: React.ComponentPropsWithoutRef<"dl"> & {
    ref?: React.Ref<HTMLDListElement>;
}): React.JSX.Element;
declare function DetailLabel({ className, ref, ...props }: React.ComponentPropsWithoutRef<"dt"> & {
    ref?: React.Ref<HTMLElement>;
}): React.JSX.Element;
declare function DetailValue({ className, ref, ...props }: React.ComponentPropsWithoutRef<"dd"> & {
    ref?: React.Ref<HTMLElement>;
}): React.JSX.Element;
declare function DetailGroup({ className, ref, ...props }: React.ComponentPropsWithoutRef<"div"> & {
    ref?: React.Ref<HTMLDivElement>;
}): React.JSX.Element;
declare function DetailGroupHeader({ className, level, action, children, ref, ...props }: React.ComponentPropsWithoutRef<"div"> & {
    level?: 2 | 3 | 4 | 5 | 6;
    action?: React.ReactNode;
    ref?: React.Ref<HTMLDivElement>;
}): React.JSX.Element;
export { Detail, DetailGroup, DetailGroupHeader, DetailLabel, DetailValue };

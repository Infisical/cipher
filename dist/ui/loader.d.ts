import * as React from "react";
export type LoaderProps = Omit<React.ComponentPropsWithoutRef<"div">, "children"> & {
    loading?: boolean;
    label: string;
    description?: string;
    size?: "base" | "page";
    delay?: number;
    children?: React.ReactNode;
};
export declare function Loader({ loading, label, description, size, delay, children, className, ref, ...props }: LoaderProps & {
    ref?: React.Ref<HTMLDivElement>;
}): string | number | bigint | boolean | React.JSX.Element | Iterable<React.ReactNode> | Promise<string | number | bigint | boolean | Iterable<React.ReactNode> | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | React.ReactPortal | null | undefined> | null | undefined;
export declare namespace Loader {
    var displayName: string;
}

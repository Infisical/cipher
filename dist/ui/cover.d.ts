import * as React from "react";
export type CoverProps = Omit<React.ComponentPropsWithoutRef<"div">, "title"> & {
    title: React.ReactNode;
    tagline?: React.ReactNode;
};
export declare function Cover({ title, tagline, className, ref, ...props }: CoverProps & {
    ref?: React.Ref<HTMLDivElement>;
}): React.JSX.Element;
export declare namespace Cover {
    var displayName: string;
}

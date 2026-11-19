import * as React from "react";
/** One line of media, name, badges and trailing content. Under pressure the badges give way first (use Badge collapse), then a long name truncates to a 12ch floor, then the badges clip; the trailing content always stays whole. The full name shows on hover. */
export declare function NameLine({ media, badges, trailing, children, className, ref, ...props }: React.ComponentPropsWithoutRef<"div"> & {
    /** A leading icon, logo or avatar. */
    media?: React.ReactNode;
    /** Badges after the name; give each one collapse so they shrink before the name does. */
    badges?: React.ReactNode;
    /** Short content held whole at the line's end, such as a time or a count. */
    trailing?: React.ReactNode;
} & {
    ref?: React.Ref<HTMLDivElement>;
}): React.JSX.Element;
export declare namespace NameLine {
    var displayName: string;
}

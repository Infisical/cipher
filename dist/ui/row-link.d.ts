import { type CipherLinkProps } from "../lib/link";
declare function RowLink({ className, disabled, chevron, title, children, ref, ...props }: CipherLinkProps & {
    disabled?: boolean;
    chevron?: boolean;
}): import("react").JSX.Element;
/** A link that covers its own table cell rather than the row, such as one plan's price in a matrix. Other cells and a RowLink keep working around it. */
declare function CellLink({ className, disabled, title, children, ref, ...props }: CipherLinkProps & {
    disabled?: boolean;
}): import("react").JSX.Element;
export { CellLink, RowLink };

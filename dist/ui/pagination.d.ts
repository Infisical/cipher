import * as React from "react";
import { Button } from "./button";
export interface PaginationProps extends React.ComponentPropsWithoutRef<"nav"> {
    variant?: "numbered" | "compact" | "more";
    page?: number;
    defaultPage?: number;
    onPageChange?: (page: number) => void;
    pageCount?: number;
    total?: number;
    pageSize?: number;
    pageSizeOptions?: readonly number[];
    onPageSizeChange?: (size: number) => void;
    loading?: boolean;
    onLoadMore?: () => void;
    label?: string;
}
export declare function paginationPages(page: number, pageCount: number): readonly (number | "gap")[];
declare function Pagination({ className, children, variant, page, defaultPage, onPageChange, pageCount, total, pageSize, pageSizeOptions, onPageSizeChange, loading, onLoadMore, label, ref, ...props }: PaginationProps & {
    ref?: React.Ref<React.ComponentRef<"nav">>;
}): React.JSX.Element;
declare namespace Pagination {
    var displayName: string;
}
declare function PaginationContent({ className, ref, ...props }: React.ComponentProps<"ul">): React.JSX.Element;
declare namespace PaginationContent {
    var displayName: string;
}
declare function PaginationItem({ ref, ...props }: React.ComponentProps<"li">): React.JSX.Element;
declare namespace PaginationItem {
    var displayName: string;
}
type PaginationLinkProps = {
    isActive?: boolean;
} & Pick<React.ComponentProps<typeof Button>, "size"> & React.ComponentPropsWithoutRef<"a">;
declare function PaginationLink({ className, isActive, size, href, onClick, ref, ...props }: PaginationLinkProps & {
    ref?: React.Ref<HTMLAnchorElement>;
}): React.JSX.Element;
declare namespace PaginationLink {
    var displayName: string;
}
declare function PaginationPrevious({ className, text, ref, ...props }: React.ComponentPropsWithoutRef<typeof PaginationLink> & {
    text?: string;
} & {
    ref?: React.Ref<React.ComponentRef<typeof PaginationLink>>;
}): React.JSX.Element;
declare namespace PaginationPrevious {
    var displayName: string;
}
declare function PaginationNext({ className, text, ref, ...props }: React.ComponentPropsWithoutRef<typeof PaginationLink> & {
    text?: string;
} & {
    ref?: React.Ref<React.ComponentRef<typeof PaginationLink>>;
}): React.JSX.Element;
declare namespace PaginationNext {
    var displayName: string;
}
declare function PaginationEllipsis({ className, ref, ...props }: React.ComponentProps<"span">): React.JSX.Element;
declare namespace PaginationEllipsis {
    var displayName: string;
}
export { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious };

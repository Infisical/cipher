import * as React from "react";
interface ApprovalRequestBase {
    id: string;
    object: string;
    title: React.ReactNode;
    description?: React.ReactNode;
    age: string;
    href?: string;
}
export type ApprovalRequest = ApprovalRequestBase & ({
    state: "new" | "pending" | "resolved";
    error?: never;
} | {
    state: "failed";
    error: React.ReactNode;
});
export type ApprovalQueueVariant = "framed" | "segmented" | "divided";
export declare const ApprovalQueueHeader: React.FC<{
    title: React.ReactNode;
    count?: React.ReactNode;
    actions?: React.ReactNode;
}>;
export interface ApprovalQueueItemProps {
    request: ApprovalRequest;
    current?: boolean;
    onApprove: (id: string) => void;
    onView?: (id: string) => void;
    onUndo?: (id: string) => void;
    onRetry: (id: string) => void;
}
export declare function ApprovalQueueItem(props: ApprovalQueueItemProps): React.JSX.Element;
export declare const ApprovalQueueGroup: React.FC<{
    label: React.ReactNode;
    children: React.ReactNode;
}>;
export declare const ApprovalQueueList: React.FC<{
    label?: string;
    empty?: React.ReactNode;
    children?: React.ReactNode;
}>;
export declare const ApprovalQueueFooter: React.FC<{
    children: React.ReactNode;
}>;
export type ApprovalQueueProps = {
    variant?: ApprovalQueueVariant;
    /** Replaces the requests with skeleton items in the same geometry while the queue loads; the header and footer stay. */
    loading?: boolean;
    loadingRows?: number;
    /** Announced while loading, naming what loads, such as Loading change requests. */
    loadingLabel?: string;
} & ({
    requests: readonly ApprovalRequest[];
    current?: string;
    onApprove: (id: string) => void;
    onView?: (id: string) => void;
    onUndo?: (id: string) => void;
    onRetry: (id: string) => void;
    historyHref?: string;
    children?: never;
} | {
    children: React.ReactNode;
    requests?: never;
});
export declare function ApprovalQueue({ variant, loading, loadingRows, loadingLabel, ...props }: ApprovalQueueProps): React.JSX.Element;
export {};

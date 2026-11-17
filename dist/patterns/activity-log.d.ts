import * as React from "react";
export interface ActivityEvent {
    id: string;
    actor: string;
    actorKind?: "person" | "machine" | "agent";
    /** What the actor did, written to follow the actor's name: "updated stripe_api_key". */
    summary: React.ReactNode;
    time: string;
    /** Badges beside the summary, such as the environment or the result of the change. */
    badge?: React.ReactNode;
}
export interface ActivityDay {
    label: string;
    events: readonly ActivityEvent[];
}
export type ActivityLogProps = {
    days: readonly ActivityDay[];
    /** Every event that matches, for the "Showing x of y" footer. Leave it out for keyset APIs that only know whether more exist. */
    total?: number;
    /** Whether another page exists. Defaults to fewer events shown than total. */
    hasMore?: boolean;
    loading?: boolean;
    onLoadMore?: () => void;
    label?: string;
    /** What renders when there are no events. */
    empty?: React.ReactNode;
};
export declare const ActivityLog: ({ days, total, hasMore, loading, onLoadMore, label, empty }: ActivityLogProps) => React.JSX.Element;

import * as React from "react";
export interface ActivityEvent {
    id: string;
    actor: string;
    actorKind?: "person" | "machine" | "agent";
    /** What the actor did, written to follow the actor's name: "updated stripe_api_key". */
    summary: React.ReactNode;
    time: string;
    /** A secondary line under the actor and summary that wraps instead of truncating, such as "Data residency: eu". */
    description?: React.ReactNode;
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
    /** Shows each day's event count and the "Showing" footer. Turn it off for a short log, such as a card on a detail page, where the counts only repeat what the rows show. */
    counts?: boolean;
    /** A hairline between day groups, none above the first or below the last. Turn it off where the log sits right against other ruled rows. */
    dividers?: boolean;
};
export declare const ActivityLog: ({ days, total, hasMore, loading, onLoadMore, label, empty, counts, dividers, }: ActivityLogProps) => React.JSX.Element;

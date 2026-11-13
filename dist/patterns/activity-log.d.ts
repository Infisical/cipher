import * as React from "react";
export interface ActivityEvent {
    id: string;
    actor: string;
    actorKind?: "person" | "machine" | "agent";
    summary: React.ReactNode;
    time: string;
}
export interface ActivityDay {
    label: string;
    events: readonly ActivityEvent[];
}
export type ActivityLogProps = {
    days: readonly ActivityDay[];
    total: number;
    loading?: boolean;
    onLoadMore?: () => void;
    label?: string;
};
export declare const ActivityLog: ({ days, total, loading, onLoadMore, label }: ActivityLogProps) => React.JSX.Element;

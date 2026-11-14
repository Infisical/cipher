import * as React from "react";
export interface Announcement {
    id: string;
    eyebrow: string;
    title: string;
    description?: React.ReactNode;
    media?: React.ReactNode;
    action?: {
        label: string;
        href?: string;
        external?: boolean;
        onClick?: () => void;
    };
}
export type AnnouncementsProps = {
    items: readonly Announcement[];
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    index?: number;
    defaultIndex?: number;
    onIndexChange?: (index: number) => void;
    onSeen?: (id: string) => void;
    onDone?: () => void;
    loop?: boolean;
    label?: string;
};
export declare const Announcements: ({ items, open, defaultOpen, onOpenChange, index, defaultIndex, onIndexChange, onSeen, onDone, loop, label }: AnnouncementsProps) => React.JSX.Element | null;

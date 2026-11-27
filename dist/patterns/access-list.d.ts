import * as React from "react";
export interface AccessMember {
    id: string;
    name: string;
    kind?: "person" | "machine" | "agent";
    role: string;
    via: React.ReactNode;
    lastUsed?: React.ReactNode;
    href?: string;
    owner?: boolean;
}
export type AccessListProps = {
    project: string;
    members: readonly AccessMember[];
    current?: string;
    onOpen?: (id: string) => void;
    onAdd?: () => void;
    onRevoke: (ids: string[]) => void | Promise<unknown>;
    onRestore?: (ids: string[]) => void | Promise<unknown>;
    onChangeRole?: (id: string) => void;
};
export declare const AccessList: ({ project, members, current, onOpen, onAdd, onRevoke, onRestore, onChangeRole }: AccessListProps) => React.JSX.Element;

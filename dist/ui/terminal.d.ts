import * as React from "react";
import type { ITerminalOptions, Terminal as XTerm } from "@xterm/xterm";
import { type IconSource } from "./icon";
export type TerminalStatus = "connecting" | "connected" | "disconnected" | "error";
export type TerminalHandle = {
    /** Writes output from the session. Writes made before xterm finishes loading are queued. */
    write: (data: string | Uint8Array) => void;
    clear: () => void;
    reset: () => void;
    focus: () => void;
    fit: () => void;
};
export type TerminalProps = Omit<React.ComponentPropsWithoutRef<"section">, "children" | "onResize" | "onError"> & {
    /** The connection, such as the account or host name. A string label truncates in the middle. */
    label: React.ReactNode;
    icon?: IconSource;
    status: TerminalStatus;
    /** Why the session ended or failed, shown over the screen while disconnected or in error. */
    message?: React.ReactNode;
    /** Shows a retry button while disconnected or in error. */
    onRetry?: () => void;
    retryLabel?: string;
    /** Controls at the end of the header, such as Disconnect. */
    actions?: React.ReactNode;
    /** Keystrokes and pasted text, to send to the remote shell. */
    onData?: (data: string) => void;
    /** The size once xterm mounts and after every fit that changes it, to send to the remote PTY. */
    onResize?: (size: {
        cols: number;
        rows: number;
    }) => void;
    /** The xterm instance once it has mounted, to load addons such as xterm-readline or web links. */
    onReady?: (terminal: XTerm) => void;
    /** Passed to xterm when it mounts. Theme and font come from the Cipher tokens. */
    options?: Omit<ITerminalOptions, "theme" | "fontFamily" | "fontSize">;
    ref?: React.Ref<TerminalHandle>;
};
export declare function Terminal({ label, icon, status, message, onRetry, retryLabel, actions, onData, onResize, onReady, options, className, ref, ...props }: TerminalProps): React.JSX.Element;
export declare namespace Terminal {
    var displayName: string;
}

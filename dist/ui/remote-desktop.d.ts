import * as React from "react";
export type RemoteDesktopStatus = "connecting" | "connected" | "reconnecting" | "disconnected" | "error";
/** A pointer event in remote desktop pixels, already scaled from the fitted frame. */
export interface RemoteDesktopPointerEvent {
    type: "move" | "down" | "up";
    x: number;
    y: number;
    button: number;
    buttons: number;
}
export interface RemoteDesktopWheelEvent {
    x: number;
    y: number;
    deltaX: number;
    deltaY: number;
    deltaMode: number;
}
export interface RemoteDesktopKeyEvent {
    type: "down" | "up";
    code: string;
    key: string;
    repeat: boolean;
    ctrlKey: boolean;
    altKey: boolean;
    shiftKey: boolean;
    metaKey: boolean;
}
export interface RemoteDesktopDetail {
    label: string;
    value: React.ReactNode;
}
export type RemoteDesktopProps = Omit<React.ComponentPropsWithoutRef<"div">, "children" | "onWheel"> & {
    status: RemoteDesktopStatus;
    /** Names the session for assistive technology, such as the account or host. */
    label: string;
    /** The remote framebuffer size. The frame keeps this aspect ratio and the pointer is scaled to it. */
    desktopSize?: {
        width: number;
        height: number;
    };
    /** The canvas the app draws decoded frames into. Its backing store is desktopSize. */
    canvasRef?: React.Ref<HTMLCanvasElement>;
    /** Replaces the canvas with an element that draws its own frames, such as a client web component. It fills the fitted frame. */
    surface?: React.ReactNode;
    details?: readonly RemoteDesktopDetail[];
    /** Extra toolbar content, placed before the built-in controls. */
    actions?: React.ReactNode;
    /** The reason the connection failed, shown with status error. */
    error?: string;
    onPointer?: (event: RemoteDesktopPointerEvent) => void;
    onWheel?: (event: RemoteDesktopWheelEvent) => void;
    onKey?: (event: RemoteDesktopKeyEvent) => void;
    onCtrlAltDel?: () => void;
    /** Shows the clipboard control; it sends the typed text to the remote clipboard. */
    onClipboardSend?: (text: string) => void | Promise<void>;
    onDisconnect?: () => void;
    onReconnect?: () => void;
};
export declare function RemoteDesktop({ status, label, desktopSize, canvasRef, surface, details, actions, error, onPointer, onWheel, onKey, onCtrlAltDel, onClipboardSend, onDisconnect, onReconnect, className, ref, ...props }: RemoteDesktopProps & {
    ref?: React.Ref<HTMLDivElement>;
}): React.JSX.Element;
export declare namespace RemoteDesktop {
    var displayName: string;
}

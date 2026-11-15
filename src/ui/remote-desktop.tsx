import * as React from "react";
import { ClipboardPaste, Keyboard, Maximize2, Minimize2, PlugZap } from "lucide-react";

import { cn } from "../lib/utils";
import { CipherScope } from "../scope";
import { Button } from "./button";
import { EmptyState } from "./empty";
import { Kbd } from "./kbd";
import { Popover, PopoverContent, PopoverHeader, PopoverTitle, PopoverTrigger } from "./popover";
import { Spinner } from "./spinner";
import { Textarea } from "./textarea";
import { Tooltip } from "./tooltip";

import styles from "./remote-desktop.module.css";

export type RemoteDesktopStatus =
  "connecting" | "connected" | "reconnecting" | "disconnected" | "error";

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

export type RemoteDesktopProps = Omit<React.ComponentPropsWithoutRef<"div">, "children"> & {
  status: RemoteDesktopStatus;
  /** Names the session for assistive technology, such as the account or host. */
  label: string;
  /** The remote framebuffer size. The frame keeps this aspect ratio and the pointer is scaled to it. */
  desktopSize?: { width: number; height: number };
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

const statusText: Record<RemoteDesktopStatus, string> = {
  connecting: "Connecting",
  connected: "Connected",
  reconnecting: "Reconnecting",
  disconnected: "Disconnected",
  error: "Connection failed"
};
const statusTone: Record<RemoteDesktopStatus, string> = {
  connecting: "warn",
  connected: "ok",
  reconnecting: "warn",
  disconnected: "muted",
  error: "bad"
};
const releaseKeys = ["Ctrl", "Alt", "Shift"];
const notConnected = "Available once connected";

type KeyboardLock = { lock?: () => Promise<void>; unlock?: () => void };
const keyboardLock = () =>
  typeof navigator === "undefined"
    ? undefined
    : (navigator as Navigator & { keyboard?: KeyboardLock }).keyboard;

function ClipboardControl({
  disabled,
  onSend
}: {
  disabled: boolean;
  onSend: (text: string) => void | Promise<void>;
}) {
  const id = React.useId();
  const [open, setOpen] = React.useState(false);
  const [text, setText] = React.useState("");
  const [sending, setSending] = React.useState(false);
  const send = async (event: React.FormEvent) => {
    event.preventDefault();
    setSending(true);
    try {
      await onSend(text);
      setText("");
      setOpen(false);
    } finally {
      setSending(false);
    }
  };
  const trigger = (
    <Button
      variant="ghost"
      size="icon-sm"
      icon={ClipboardPaste}
      iconOnly
      disabledReason={disabled ? notConnected : undefined}
    >
      Remote clipboard
    </Button>
  );
  if (disabled) return trigger;
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Tooltip content="Remote clipboard">
        <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      </Tooltip>
      <PopoverContent align="end" side="top">
        <form className={styles.clipboard} onSubmit={send}>
          <PopoverHeader>
            <PopoverTitle>
              <label htmlFor={id}>Send to remote clipboard</label>
            </PopoverTitle>
          </PopoverHeader>
          <Textarea
            id={id}
            rows={4}
            value={text}
            onChange={(event) => setText(event.target.value)}
          />
          <Button type="submit" size="sm" loading={sending} disabled={!text}>
            Send
          </Button>
        </form>
      </PopoverContent>
    </Popover>
  );
}

export function RemoteDesktop({
  status,
  label,
  desktopSize = { width: 1920, height: 1080 },
  canvasRef,
  surface,
  details,
  actions,
  error,
  onPointer,
  onWheel,
  onKey,
  onCtrlAltDel,
  onClipboardSend,
  onDisconnect,
  onReconnect,
  className,
  ref,
  ...props
}: RemoteDesktopProps & { ref?: React.Ref<HTMLDivElement> }) {
  const id = React.useId();
  const root = React.useRef<HTMLDivElement | null>(null);
  const stage = React.useRef<HTMLDivElement | null>(null);
  const frame = React.useRef<HTMLDivElement | null>(null);
  const toolbar = React.useRef<HTMLDivElement | null>(null);
  const pressed = React.useRef(new Map<string, RemoteDesktopKeyEvent>());
  const [fit, setFit] = React.useState<{ width: number; height: number }>();
  const [captured, setCaptured] = React.useState(false);
  const [fullscreen, setFullscreen] = React.useState(false);
  const [rootNode, setRootNode] = React.useState<HTMLDivElement | null>(null);
  const connected = status === "connected";
  const { width, height } = desktopSize;

  const assignRoot = React.useCallback(
    (node: HTMLDivElement | null) => {
      root.current = node;
      setRootNode(node);
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [ref]
  );

  React.useLayoutEffect(() => {
    const node = stage.current;
    if (!node) return undefined;
    const measure = () => {
      const style = getComputedStyle(node);
      const availableWidth =
        node.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
      const availableHeight =
        node.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom);
      const scale = Math.max(0, Math.min(availableWidth / width, availableHeight / height));
      setFit({ width: Math.floor(width * scale), height: Math.floor(height * scale) });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, [width, height]);

  React.useEffect(() => {
    const update = () => {
      const active = document.fullscreenElement === root.current;
      setFullscreen(active);
      if (!active) keyboardLock()?.unlock?.();
    };
    document.addEventListener("fullscreenchange", update);
    return () => document.removeEventListener("fullscreenchange", update);
  }, []);

  const toRemote = (clientX: number, clientY: number) => {
    const rect = frame.current?.getBoundingClientRect();
    if (!rect || rect.width === 0 || rect.height === 0) return { x: 0, y: 0 };
    const clamp = (value: number, max: number) => Math.min(Math.max(value, 0), max - 1);
    return {
      x: Math.round(clamp(((clientX - rect.left) / rect.width) * width, width)),
      y: Math.round(clamp(((clientY - rect.top) / rect.height) * height, height))
    };
  };

  const onWheelRef = React.useRef(onWheel);
  const toRemoteRef = React.useRef(toRemote);
  React.useEffect(() => {
    onWheelRef.current = onWheel;
    toRemoteRef.current = toRemote;
  });
  React.useEffect(() => {
    const node = stage.current;
    if (!node || !connected) return undefined;
    // React registers wheel listeners as passive, so scrolling the page could not be stopped.
    const wheel = (event: WheelEvent) => {
      if (!onWheelRef.current || !frame.current?.contains(event.target as Node)) return;
      event.preventDefault();
      onWheelRef.current({
        ...toRemoteRef.current(event.clientX, event.clientY),
        deltaX: event.deltaX,
        deltaY: event.deltaY,
        deltaMode: event.deltaMode
      });
    };
    node.addEventListener("wheel", wheel, { passive: false });
    return () => node.removeEventListener("wheel", wheel);
  }, [connected]);

  const releaseKeysHeld = () => {
    pressed.current.forEach((event) => onKey?.({ ...event, type: "up", repeat: false }));
    pressed.current.clear();
  };

  const keyEvent = (event: React.KeyboardEvent<HTMLDivElement>, type: "down" | "up") => {
    if (!connected || !onKey || event.target !== event.currentTarget) return;
    if (
      type === "down" &&
      event.ctrlKey &&
      event.altKey &&
      event.shiftKey &&
      ["Control", "Alt", "Shift"].includes(event.key)
    ) {
      event.preventDefault();
      releaseKeysHeld();
      toolbar.current?.querySelector<HTMLElement>("button:not([aria-disabled='true'])")?.focus();
      return;
    }
    event.preventDefault();
    const remote: RemoteDesktopKeyEvent = {
      type,
      code: event.code,
      key: event.key,
      repeat: event.repeat,
      ctrlKey: event.ctrlKey,
      altKey: event.altKey,
      shiftKey: event.shiftKey,
      metaKey: event.metaKey
    };
    if (type === "down") pressed.current.set(event.code, remote);
    else pressed.current.delete(event.code);
    onKey(remote);
  };

  const pointerEvent = (
    event: React.PointerEvent<HTMLDivElement>,
    type: "move" | "down" | "up"
  ) => {
    if (!connected || !onPointer) return;
    if (type === "down") {
      stage.current?.focus({ preventScroll: true });
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    event.preventDefault();
    onPointer({
      type,
      ...toRemote(event.clientX, event.clientY),
      button: event.button,
      buttons: event.buttons
    });
  };

  const toggleFullscreen = async () => {
    if (document.fullscreenElement === root.current) {
      await document.exitFullscreen();
      return;
    }
    await root.current?.requestFullscreen();
    await keyboardLock()
      ?.lock?.()
      .catch(() => undefined);
    stage.current?.focus({ preventScroll: true });
  };

  const capturing = captured && connected;
  const hintId = id + "-hint";
  const overlay =
    status === "connecting" ? (
      <div className={styles.overlay} data-overlay="solid">
        <Spinner size="page" label="Connecting to remote desktop" />
      </div>
    ) : status === "reconnecting" ? (
      <div className={styles.overlay} data-overlay="scrim">
        <div className={styles.notice}>
          <Spinner size="base" label="Reconnecting" />
        </div>
      </div>
    ) : status === "disconnected" ? (
      <div className={styles.overlay} data-overlay="solid">
        <EmptyState
          icon={PlugZap}
          title="Session disconnected"
          description="Reconnect to start a new session."
          actions={onReconnect && <Button onClick={onReconnect}>Reconnect</Button>}
        />
      </div>
    ) : status === "error" ? (
      <div className={styles.overlay} data-overlay="solid" role="alert">
        <EmptyState
          icon="alert"
          title="Connection failed"
          description={error}
          actions={onReconnect && <Button onClick={onReconnect}>Reconnect</Button>}
        />
      </div>
    ) : null;

  return (
    <div
      ref={assignRoot}
      data-slot="remote-desktop"
      data-status={status}
      data-fullscreen={fullscreen || undefined}
      className={cn(styles.root, className)}
      {...props}
    >
      <CipherScope portalContainer={fullscreen ? rootNode : undefined} className={styles.scope}>
        <div
          ref={stage}
          role="application"
          aria-roledescription="remote desktop"
          aria-label={label}
          aria-describedby={connected && onKey ? hintId : undefined}
          aria-busy={status === "connecting" || status === "reconnecting" || undefined}
          tabIndex={connected ? 0 : -1}
          data-captured={capturing || undefined}
          className={styles.stage}
          onFocus={(event) => {
            if (event.target === event.currentTarget) setCaptured(true);
          }}
          onBlur={(event) => {
            if (event.target !== event.currentTarget) return;
            releaseKeysHeld();
            setCaptured(false);
          }}
          onKeyDown={(event) => keyEvent(event, "down")}
          onKeyUp={(event) => keyEvent(event, "up")}
          onContextMenu={(event) => {
            if (connected && onPointer) event.preventDefault();
          }}
        >
          <div
            ref={frame}
            className={styles.frame}
            style={fit && { width: fit.width, height: fit.height }}
            onPointerDown={(event) => pointerEvent(event, "down")}
            onPointerMove={(event) => pointerEvent(event, "move")}
            onPointerUp={(event) => pointerEvent(event, "up")}
          >
            {surface ?? (
              <canvas ref={canvasRef} width={width} height={height} className={styles.canvas} />
            )}
          </div>
          {overlay}
        </div>
        <div ref={toolbar} role="toolbar" aria-label="Remote desktop" className={styles.toolbar}>
          <span role="status" className={styles.status}>
            <span className={styles.dot} data-tone={statusTone[status]} aria-hidden />
            {statusText[status]}
          </span>
          {connected && onKey && (
            <span id={hintId} className={styles.hint} data-captured={capturing || undefined}>
              Input captured, release with
              <Kbd keys={releaseKeys} size="sm" />
            </span>
          )}
          {details && details.length > 0 && (
            <dl className={styles.details}>
              {details.map((detail) => (
                <div key={detail.label} className={styles.detail}>
                  <dt>{detail.label}</dt>
                  <dd title={typeof detail.value === "string" ? detail.value : undefined}>
                    {detail.value}
                  </dd>
                </div>
              ))}
            </dl>
          )}
          <div className={styles.controls}>
            {actions}
            {onClipboardSend && <ClipboardControl disabled={!connected} onSend={onClipboardSend} />}
            {onCtrlAltDel && (
              <Tooltip content="Send Ctrl+Alt+Del">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  icon={Keyboard}
                  iconOnly
                  disabledReason={connected ? undefined : notConnected}
                  onClick={onCtrlAltDel}
                >
                  Send Ctrl+Alt+Del
                </Button>
              </Tooltip>
            )}
            <Tooltip content={fullscreen ? "Exit full screen" : "Full screen"}>
              <Button
                variant="ghost"
                size="icon-sm"
                icon={fullscreen ? Minimize2 : Maximize2}
                iconOnly
                aria-pressed={fullscreen}
                onClick={toggleFullscreen}
              >
                Full screen
              </Button>
            </Tooltip>
            {onDisconnect && (
              <Button
                variant="ghost"
                size="sm"
                disabledReason={
                  status === "disconnected" || status === "error" ? "Not connected" : undefined
                }
                onClick={onDisconnect}
              >
                Disconnect
              </Button>
            )}
          </div>
        </div>
      </CipherScope>
    </div>
  );
}
RemoteDesktop.displayName = "RemoteDesktop";

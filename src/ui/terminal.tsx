"use client";

import * as React from "react";
import type { FitAddon } from "@xterm/addon-fit";
import type { ITerminalOptions, ITheme, Terminal as XTerm } from "@xterm/xterm";

import { FrameScope, useInFrame } from "../lib/frame-context";
import { cn } from "../lib/utils";
import { useTheme } from "../scope";

import { Button } from "./button";
import { Icon, type IconSource } from "./icon";
import { MiddleTruncate } from "./middle-truncate";
import { Spinner } from "./spinner";

import frame from "./frame.module.css";
import styles from "./terminal.module.css";

export type TerminalStatus = "connecting" | "connected" | "disconnected" | "error";

export type TerminalHandle = {
  /** Writes output from the session. Writes made before xterm finishes loading are queued. */
  write: (data: string | Uint8Array) => void;
  clear: () => void;
  reset: () => void;
  focus: () => void;
  fit: () => void;
};

export type TerminalProps = Omit<
  React.ComponentPropsWithoutRef<"section">,
  "children" | "onResize" | "onError"
> & {
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
  /** The new size after a fit, to send to the remote PTY. */
  onResize?: (size: { cols: number; rows: number }) => void;
  /** Passed to xterm when it mounts. Theme and font come from the Cipher tokens. */
  options?: Omit<ITerminalOptions, "theme" | "fontFamily" | "fontSize">;
  ref?: React.Ref<TerminalHandle>;
};

const statusWords: Record<TerminalStatus, string> = {
  connecting: "Connecting",
  connected: "Connected",
  disconnected: "Disconnected",
  error: "Connection failed"
};

const themeTokens: Partial<Record<keyof ITheme, string>> = {
  background: "surface",
  foreground: "ink",
  cursor: "mark",
  cursorAccent: "surface",
  selectionBackground: "selected-surface",
  scrollbarSliderBackground: "scroll-thumb",
  scrollbarSliderHoverBackground: "scroll-thumb-hover",
  scrollbarSliderActiveBackground: "scroll-thumb-hover",
  black: "ansi-black",
  red: "ansi-red",
  green: "ansi-green",
  yellow: "ansi-yellow",
  blue: "ansi-blue",
  magenta: "ansi-magenta",
  cyan: "ansi-cyan",
  white: "ansi-white",
  brightBlack: "ansi-bright-black",
  brightRed: "ansi-bright-red",
  brightGreen: "ansi-bright-green",
  brightYellow: "ansi-bright-yellow",
  brightBlue: "ansi-bright-blue",
  brightMagenta: "ansi-bright-magenta",
  brightCyan: "ansi-bright-cyan",
  brightWhite: "ansi-bright-white"
};

// xterm parses only hex and rgb colors, and the tokens hold var() and color-mix(), so each one is
// resolved by the browser and read back as a pixel.
function readTheme(host: HTMLElement): ITheme {
  const probe = document.createElement("span");
  host.appendChild(probe);
  const context = document.createElement("canvas").getContext("2d", { willReadFrequently: true });
  const theme = Object.fromEntries(
    Object.entries(themeTokens).map(([key, token]) => {
      probe.style.color = `var(--cipher-${token})`;
      const color = getComputedStyle(probe).color;
      if (!context) return [key, color];
      context.clearRect(0, 0, 1, 1);
      context.fillStyle = color;
      context.fillRect(0, 0, 1, 1);
      const [r, g, b, a] = context.getImageData(0, 0, 1, 1).data;
      return [key, `rgba(${r}, ${g}, ${b}, ${(a / 255).toFixed(3)})`];
    })
  );
  probe.remove();
  return theme;
}

export function Terminal({
  label,
  icon = "terminal",
  status,
  message,
  onRetry,
  retryLabel,
  actions,
  onData,
  onResize,
  options,
  className,
  ref,
  ...props
}: TerminalProps) {
  const hostRef = React.useRef<HTMLDivElement>(null);
  const retryRef = React.useRef<HTMLButtonElement>(null);
  const terminalRef = React.useRef<XTerm | null>(null);
  const fitRef = React.useRef<FitAddon | null>(null);
  const pending = React.useRef<(string | Uint8Array)[]>([]);
  const latest = React.useRef({ onData, onResize, options });
  latest.current = { onData, onResize, options };
  const [load, setLoad] = React.useState<"loading" | "ready" | "failed">("loading");
  const theme = useTheme();
  const embedded = useInFrame("Terminal");
  const labelText = typeof label === "string" ? label : undefined;
  const labelId = React.useId();
  const ended = status === "disconnected" || status === "error" || load === "failed";

  React.useImperativeHandle(
    ref,
    () => ({
      write: (data) => {
        if (terminalRef.current) terminalRef.current.write(data);
        else pending.current.push(data);
      },
      clear: () => {
        pending.current = [];
        terminalRef.current?.clear();
      },
      reset: () => {
        pending.current = [];
        terminalRef.current?.reset();
      },
      focus: () => terminalRef.current?.focus(),
      fit: () => fitRef.current?.fit()
    }),
    []
  );

  React.useEffect(() => {
    const host = hostRef.current;
    if (!host) return undefined;
    let disposed = false;
    let teardown = () => {};
    const style = getComputedStyle(host);
    Promise.all([
      import("@xterm/xterm"),
      import("@xterm/addon-fit"),
      import("@xterm/xterm/css/xterm.css"),
      document.fonts?.load(`${style.fontSize} ${style.fontFamily}`).catch(() => undefined)
    ]).then(
      ([xterm, fit]) => {
        if (disposed) return;
        const terminal = new xterm.Terminal({
          cursorBlink: true,
          scrollback: 10000,
          ...latest.current.options,
          fontFamily: style.fontFamily,
          fontSize: parseFloat(style.fontSize),
          theme: readTheme(host)
        });
        const fitAddon = new fit.FitAddon();
        terminal.loadAddon(fitAddon);
        terminal.open(host);
        fitAddon.fit();
        const subscriptions = [
          terminal.onData((data) => latest.current.onData?.(data)),
          terminal.onResize((size) => latest.current.onResize?.(size))
        ];
        const observer = new ResizeObserver(() => fitAddon.fit());
        observer.observe(host);
        terminalRef.current = terminal;
        fitRef.current = fitAddon;
        pending.current.splice(0).forEach((data) => terminal.write(data));
        setLoad("ready");
        teardown = () => {
          observer.disconnect();
          subscriptions.forEach((subscription) => subscription.dispose());
          terminalRef.current = null;
          fitRef.current = null;
          terminal.dispose();
        };
      },
      (error: unknown) => {
        if (disposed) return;
        console.error(
          "Terminal needs the optional peer dependencies @xterm/xterm and @xterm/addon-fit.",
          error
        );
        setLoad("failed");
      }
    );
    return () => {
      disposed = true;
      teardown();
    };
  }, []);

  React.useEffect(() => {
    const host = hostRef.current;
    if (load !== "ready" || !host || !terminalRef.current) return;
    terminalRef.current.options.theme = readTheme(host);
  }, [load, theme]);

  React.useEffect(() => {
    const terminal = terminalRef.current;
    if (load !== "ready" || !terminal) return;
    terminal.options.disableStdin = ended;
    if (status === "connected") terminal.focus();
    else if (ended && hostRef.current?.contains(document.activeElement)) retryRef.current?.focus();
  }, [load, status, ended]);

  const tone = load === "failed" ? "error" : status;
  const overlayTitle =
    load === "failed"
      ? "Terminal could not load"
      : status === "error"
        ? "Connection failed"
        : "Session ended";

  return (
    <section
      data-slot="terminal"
      data-status={tone}
      data-embedded={embedded || undefined}
      aria-label={labelText}
      aria-labelledby={labelText ? undefined : labelId}
      className={cn(!embedded && frame.frame, styles.terminal, className)}
      {...props}
    >
      <FrameScope framed>
        <div className={cn(frame.frameHead, styles.header)}>
          <div id={labelId} className={styles.identity}>
            <Icon icon={icon} />
            {labelText ? (
              <MiddleTruncate keepEnd={16} className={styles.label}>
                {labelText}
              </MiddleTruncate>
            ) : (
              label
            )}
          </div>
          <span role="status" className={styles.status} data-tone={tone}>
            {tone === "connecting" ? <Spinner /> : <span aria-hidden className={styles.dot} />}
            {load === "failed" ? statusWords.error : statusWords[status]}
          </span>
          {actions && <div className={styles.actions}>{actions}</div>}
        </div>
        <div className={cn(frame.frameInset, styles.body)}>
          <div ref={hostRef} className={styles.screen} />
          {ended && (
            <div className={styles.overlay} role={tone === "error" ? "alert" : undefined}>
              <p className={styles.overlayTitle}>{overlayTitle}</p>
              {message && load !== "failed" && <p className={styles.message}>{message}</p>}
              {onRetry && load !== "failed" && (
                <Button ref={retryRef} variant="outline" icon="sync" onClick={onRetry}>
                  {retryLabel ?? (status === "error" ? "Retry" : "Reconnect")}
                </Button>
              )}
            </div>
          )}
        </div>
      </FrameScope>
    </section>
  );
}
Terminal.displayName = "Terminal";

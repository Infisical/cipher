import * as React from "react";

import type { SessionReplayViewportState } from "@infisical/cipher/ui/session-replay";

import type { RdpReplayEvent, TerminalReplayEvent } from "./sample";

export function TerminalViewport({ events }: SessionReplayViewportState<TerminalReplayEvent>) {
  const text = React.useMemo(() => events.map((event) => event.output).join(""), [events]);
  return (
    <div className="absolute inset-0 flex flex-col-reverse overflow-hidden p-4">
      <pre className="m-0 font-mono text-xs leading-5 break-all whitespace-pre-wrap text-foreground">
        {text}
        <span aria-hidden className="inline-block h-4 w-2 bg-foreground align-text-bottom" />
      </pre>
    </div>
  );
}

const WIDTH = 1920;
const HEIGHT = 1080;

export function RdpCanvasViewport({ events }: SessionReplayViewportState<RdpReplayEvent>) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [theme, setTheme] = React.useState<string | null>(null);
  React.useEffect(() => {
    const scope = canvasRef.current?.closest("[data-theme]");
    if (!scope) return undefined;
    const read = () => setTheme(scope.getAttribute("data-theme"));
    read();
    const observer = new MutationObserver(read);
    observer.observe(scope, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);
  React.useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    const token = (name: string) => getComputedStyle(canvas).getPropertyValue(name).trim();
    const records = events.flatMap((event) => (event.record ? [event.record] : []));
    const latest = (type: string) => [...records].reverse().find((record) => record.type === type);
    const frame = latest("target_frame");
    const pointer = latest("mouse");
    context.fillStyle = token("--cipher-inset");
    context.fillRect(0, 0, WIDTH, HEIGHT);
    context.fillStyle = token("--cipher-line");
    context.fillRect(0, HEIGHT - 64, WIDTH, 64);
    if (frame?.window && frame.window !== "desktop") {
      context.fillStyle = token("--cipher-surface");
      context.fillRect(360, 160, 1200, 680);
      context.strokeStyle = token("--cipher-line");
      context.lineWidth = 2;
      context.strokeRect(360, 160, 1200, 680);
      context.fillStyle = token("--cipher-ink");
      context.font = `600 32px ${token("--cipher-font-sans")}`;
      context.fillText(frame.window, 400, 220);
    }
    if (pointer) {
      context.fillStyle = token("--cipher-accent");
      context.fillRect((pointer.x ?? 0) - 10, (pointer.y ?? 0) - 10, 20, 20);
    }
  }, [events, theme]);
  return (
    <canvas
      ref={canvasRef}
      width={WIDTH}
      height={HEIGHT}
      aria-label="Remote desktop"
      className="block size-full"
    />
  );
}

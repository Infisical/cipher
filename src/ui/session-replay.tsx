import * as React from "react";
import { Pause, Play } from "lucide-react";
import { Slider as SliderPrimitive } from "radix-ui";

import { cn } from "../lib/utils";
import { Button } from "./button";
import { ToggleGroup, ToggleGroupItem } from "./toggle-group";

import controlStyles from "./controls.module.css";
import styles from "./session-replay.module.css";

export type SessionReplayEvent = {
  /** Milliseconds from the start of the session. Events must be sorted by time. */
  time: number;
  /** One line for the event list and the marker tooltip. */
  label: string;
  /** A short type shown before the label, such as input, output or mouse. */
  kind?: string;
  tone?: "warn" | "bad";
  /** false keeps the event in the viewport's events but out of the list and the timeline, for frames, resizes and other events no one scans for. */
  listed?: boolean;
};

export type SessionReplaySpeed = 0.5 | 1 | 2 | 4;

export type SessionReplayViewportState<Event extends SessionReplayEvent> = {
  time: number;
  /** Every event at or before time, in order. The array keeps its identity until a new event is reached. */
  events: readonly Event[];
  playing: boolean;
  speed: SessionReplaySpeed;
};

export type SessionReplayProps<Event extends SessionReplayEvent> = {
  events: readonly Event[];
  /** Total length in milliseconds. Defaults to the time of the last event. */
  duration?: number;
  viewport: (state: SessionReplayViewportState<Event>) => React.ReactNode;
  "aria-label"?: string;
  defaultSpeed?: SessionReplaySpeed;
  /** Seek step for the arrow keys, in milliseconds. */
  seekStep?: number;
  emptyLabel?: string;
  className?: string;
};

const SPEEDS: readonly SessionReplaySpeed[] = [0.5, 1, 2, 4];

const formatTime = (ms: number, withHours: boolean) => {
  const total = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(total / 3600);
  const minutes = String(Math.floor((total % 3600) / 60)).padStart(2, "0");
  const seconds = String(total % 60).padStart(2, "0");
  return withHours ? `${hours}:${minutes}:${seconds}` : `${minutes}:${seconds}`;
};

const lastIndexAtOrBefore = (times: readonly number[], time: number) => {
  let low = 0;
  let high = times.length - 1;
  let found = -1;
  while (low <= high) {
    const middle = (low + high) >> 1;
    if (times[middle] <= time) {
      found = middle;
      low = middle + 1;
    } else high = middle - 1;
  }
  return found;
};

export function SessionReplay<Event extends SessionReplayEvent>({
  events,
  duration: durationProp,
  viewport,
  "aria-label": label = "Session replay",
  defaultSpeed = 1,
  seekStep = 5000,
  emptyLabel = "No events recorded",
  className
}: SessionReplayProps<Event>) {
  const duration = Math.max(0, durationProp ?? events.at(-1)?.time ?? 0);
  const withHours = duration >= 3_600_000;
  const [time, setTime] = React.useState(0);
  const [playing, setPlaying] = React.useState(false);
  const [speed, setSpeed] = React.useState<SessionReplaySpeed>(defaultSpeed);
  const [announcement, setAnnouncement] = React.useState("");
  const listRef = React.useRef<HTMLOListElement>(null);
  const timeRef = React.useRef(0);
  timeRef.current = time;

  const times = React.useMemo(() => events.map((event) => event.time), [events]);
  const listed = React.useMemo(
    () => events.flatMap((event, index) => (event.listed === false ? [] : [{ event, index }])),
    [events]
  );
  const listedTimes = React.useMemo(() => listed.map(({ event }) => event.time), [listed]);
  const reached = lastIndexAtOrBefore(times, time);
  const viewportEvents = React.useMemo(() => events.slice(0, reached + 1), [events, reached]);
  const activeRow = lastIndexAtOrBefore(listedTimes, time);

  const markers = React.useMemo(() => {
    if (duration <= 0) return [];
    const byPosition = new Map<number, { position: number; tone?: Event["tone"] }>();
    listed.forEach(({ event }) => {
      const position = Math.round((Math.min(event.time, duration) / duration) * 200) / 2;
      const existing = byPosition.get(position);
      if (!existing || event.tone === "bad" || (event.tone === "warn" && !existing.tone))
        byPosition.set(position, { position, tone: event.tone });
    });
    return [...byPosition.values()];
  }, [listed, duration]);

  React.useEffect(() => {
    if (!playing) return undefined;
    let frame = 0;
    let previous = performance.now();
    const tick = (now: number) => {
      const next = Math.min(duration, timeRef.current + (now - previous) * speed);
      previous = now;
      setTime(next);
      if (next >= duration) {
        setPlaying(false);
        setAnnouncement(`Ended at ${formatTime(next, withHours)}`);
        return;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing, speed, duration, withHours]);

  React.useEffect(() => {
    const list = listRef.current;
    const row = list?.querySelector<HTMLElement>('[aria-current="true"]');
    if (!list || !row) return;
    const top = row.offsetTop - list.offsetTop;
    if (top < list.scrollTop) list.scrollTop = top;
    else if (top + row.offsetHeight > list.scrollTop + list.clientHeight)
      list.scrollTop = top + row.offsetHeight - list.clientHeight;
  }, [activeRow]);

  const disabled = duration <= 0;
  const seek = React.useCallback(
    (next: number, announce = false) => {
      const clamped = Math.min(duration, Math.max(0, next));
      setTime(clamped);
      if (announce)
        setAnnouncement(`${formatTime(clamped, withHours)} of ${formatTime(duration, withHours)}`);
    },
    [duration, withHours]
  );
  const seekToEvent = React.useCallback((next: number) => seek(next, true), [seek]);
  const togglePlaying = () => {
    if (disabled) return;
    if (playing) {
      setPlaying(false);
      setAnnouncement(`Paused at ${formatTime(time, withHours)}`);
      return;
    }
    if (time >= duration) setTime(0);
    setPlaying(true);
    setAnnouncement("Playing");
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled || event.defaultPrevented) return;
    const onRoot = event.target === event.currentTarget;
    if (!onRoot && (event.target as HTMLElement).getAttribute("role") !== "slider") return;
    if (event.key === " ") {
      event.preventDefault();
      togglePlaying();
    } else if (onRoot) {
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        seek(time + (event.key === "ArrowLeft" ? -seekStep : seekStep), true);
      } else if (event.key === "Home" || event.key === "End") {
        event.preventDefault();
        seek(event.key === "Home" ? 0 : duration, true);
      }
    }
  };

  return (
    <div
      role="region"
      aria-label={label}
      aria-keyshortcuts="Space ArrowLeft ArrowRight Home End"
      tabIndex={0}
      data-slot="session-replay"
      className={cn(styles.replay, controlStyles.focusOutline, className)}
      onKeyDown={onKeyDown}
    >
      <div className={styles.layout}>
        <div className={styles.stage}>
          <div
            data-slot="session-replay-viewport"
            className={styles.viewport}
            onClick={togglePlaying}
          >
            {viewport({ time, events: viewportEvents, playing, speed })}
          </div>
          <div className={styles.controls}>
            <Button
              variant="ghost"
              size="icon-sm"
              iconOnly
              icon={playing ? Pause : Play}
              disabled={disabled}
              aria-keyshortcuts="Space"
              onClick={togglePlaying}
            >
              {playing ? "Pause" : "Play"}
            </Button>
            <span className={styles.time}>
              <span className="sr-only">Current time </span>
              {formatTime(time, withHours)}
            </span>
            <SliderPrimitive.Root
              data-slot="session-replay-timeline"
              className={styles.timeline}
              min={0}
              max={Math.max(duration, 1)}
              step={1000}
              value={[time]}
              disabled={disabled}
              onValueChange={([next]) => seek(next)}
            >
              <SliderPrimitive.Track className={cn(controlStyles.sliderTrack, styles.track)}>
                <SliderPrimitive.Range className={cn(controlStyles.sliderRange, styles.range)} />
              </SliderPrimitive.Track>
              <span aria-hidden className={styles.markers}>
                {markers.map((marker) => (
                  <span
                    key={marker.position}
                    className={styles.marker}
                    data-tone={marker.tone}
                    style={{ insetInlineStart: `${marker.position}%` }}
                  />
                ))}
              </span>
              <SliderPrimitive.Thumb
                data-slot="session-replay-thumb"
                aria-label="Seek"
                aria-valuetext={`${formatTime(time, withHours)} of ${formatTime(duration, withHours)}`}
                className={cn(controlStyles.focusOutline, controlStyles.sliderThumb, styles.thumb)}
              />
            </SliderPrimitive.Root>
            <span className={styles.time}>
              <span className="sr-only">Total time </span>
              {formatTime(duration, withHours)}
            </span>
            <ToggleGroup
              type="single"
              size="sm"
              aria-label="Playback speed"
              value={String(speed)}
              disabled={disabled}
              onValueChange={(value) => {
                if (!value) return;
                setSpeed(Number(value) as SessionReplaySpeed);
                setAnnouncement(`Speed ${value}x`);
              }}
            >
              {SPEEDS.map((option) => (
                <ToggleGroupItem
                  key={option}
                  value={String(option)}
                  aria-label={`${option}x speed`}
                >
                  {option}x
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
        </div>
        <div className={styles.events}>
          <div className={styles.eventsBody}>
            <div className={styles.eventsHead}>
              <span>Events</span>
              <span className={styles.count}>{listed.length.toLocaleString()}</span>
            </div>
            {listed.length === 0 ? (
              <p className={styles.empty}>{emptyLabel}</p>
            ) : (
              <EventList
                listed={listed}
                activeRow={activeRow}
                withHours={withHours}
                listRef={listRef}
                onSeek={seekToEvent}
              />
            )}
          </div>
        </div>
      </div>
      <span className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {announcement}
      </span>
    </div>
  );
}
SessionReplay.displayName = "SessionReplay";

const EventList = React.memo(function EventList<Event extends SessionReplayEvent>({
  listed,
  activeRow,
  withHours,
  listRef,
  onSeek
}: {
  listed: readonly { event: Event; index: number }[];
  activeRow: number;
  withHours: boolean;
  listRef: React.Ref<HTMLOListElement>;
  onSeek: (time: number) => void;
}) {
  return (
    <ol ref={listRef} className={styles.list} aria-label="Events">
      {listed.map(({ event, index }, row) => (
        <li key={index} className={styles.entry}>
          <button
            type="button"
            className={cn(styles.row, controlStyles.focusOutlineInset)}
            aria-current={row === activeRow ? "true" : undefined}
            data-tone={event.tone}
            title={event.label}
            onClick={() => onSeek(event.time)}
          >
            <span className={styles.rowTime}>{formatTime(event.time, withHours)}</span>
            {event.kind && <span className={styles.kind}>{event.kind}</span>}
            {event.tone && (
              <>
                <span aria-hidden className={styles.dot} />
                <span className="sr-only">{event.tone === "bad" ? "Error: " : "Warning: "}</span>
              </>
            )}
            <span className={styles.label}>{event.label}</span>
          </button>
        </li>
      ))}
    </ol>
  );
});

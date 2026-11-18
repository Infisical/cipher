import * as React from "react";
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
export declare function SessionReplay<Event extends SessionReplayEvent>({ events, duration: durationProp, viewport, "aria-label": label, defaultSpeed, seekStep, emptyLabel, className }: SessionReplayProps<Event>): React.JSX.Element;
export declare namespace SessionReplay {
    var displayName: string;
}

import * as React from "react";
export type WorldMapLocation = {
    /** Unique per location. Defaults to the label. */
    id?: string;
    /** What the tooltip and legend name the location, such as "Toronto, CA" or "Local network". */
    label: string;
    /** ISO 3166-1 alpha-2 code. Locations that share one add up to that country's tone. */
    country?: string;
    /** Without both coordinates the location has no marker and appears only in the legend. */
    lat?: number;
    lng?: number;
    count: number;
};
export type WorldMapProps = Omit<React.ComponentPropsWithoutRef<"div">, "children"> & {
    locations: WorldMapLocation[];
    /** Names the map for assistive technology, such as "Secret access locations". */
    label: string;
    /** markers sizes a square per location by count, regions tones each country by its total, both does both. */
    display?: "both" | "markers" | "regions";
    formatCount?: (count: number) => string;
    /** How many locations the legend lists before it sums the rest. */
    legendLimit?: number;
    /** Turns the legend off when the page already lists the locations. */
    legend?: boolean;
    /** Shown over the map when no location has a count. */
    empty?: React.ReactNode;
};
/** Projects a longitude and latitude into the WorldMap viewBox. */
export declare function projectWorldMap(lng: number, lat: number): [number, number];
declare function WorldMap({ locations, label, display, formatCount, legendLimit, legend, empty, className, ...props }: WorldMapProps): React.JSX.Element;
export { WorldMap };

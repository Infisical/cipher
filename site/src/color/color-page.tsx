import { useMemo } from "react";
import { useTheme } from "@infisical/cipher/scope";
import { PageHeader } from "@infisical/cipher/ui/page-header";
import { Tabs } from "@infisical/cipher/ui/tabs";

import { sampleHues } from "./color-groups";
import { IntentView } from "./intent-view";
import { PrimitivesView } from "./primitives-view";
import { buildTokenGraph, hueRamp } from "./token-graph";
import { type Probe, useComputedColors } from "./use-computed-colors";

import styles from "./color.module.css";

const hueProbes: Probe[] = hueRamp.names.flatMap((name) =>
  sampleHues.map((hue) => ({
    key: name + "@" + hue,
    css: "oklch(var(--cipher-" + name + ") var(--cipher-hue))",
    hue,
    level: name.startsWith("hue-pop") ? ("pop" as const) : ("subtle" as const)
  }))
);

export function ColorPage() {
  const theme = useTheme() ?? "light";
  const graph = useMemo(() => buildTokenGraph(theme), [theme]);
  const probes = useMemo(
    () => [
      ...[...graph.nodes.values()].map((node) => ({
        key: node.id,
        css: node.kind === "literal" ? node.raw : "var(--cipher-" + node.id + ")"
      })),
      ...hueProbes
    ],
    [graph]
  );
  const { ref, colors } = useComputedColors(theme, probes);
  return (
    <>
      <PageHeader title="Color" />
      <div ref={ref} className={styles.probes} aria-hidden />
      <Tabs
        className="mt-6"
        label="Color views"
        tabs={[
          { value: "intent", label: "By intent", content: <div className="pt-8"><IntentView graph={graph} colors={colors} /></div> },
          { value: "primitives", label: "Primitives", content: <div className="pt-8"><PrimitivesView graph={graph} colors={colors} /></div> }
        ]}
      />
    </>
  );
}

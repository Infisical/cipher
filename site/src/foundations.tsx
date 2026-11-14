import { useLayoutEffect, useRef, useState } from "react";
import tokens from "@infisical/cipher/tokens.json";
import { PageHeader } from "@infisical/cipher/ui/page-header";

import styles from "./preview.module.css";

const themedColors = tokens.color.tokens.filter((token) => typeof token.value === "object");

function ColorPage() {
  return (
    <>
      <PageHeader
        title="Color"
        description="Every themed color token. Switch the theme to compare."
      />
      <div className="mt-8 grid grid-cols-[repeat(auto-fill,minmax(12rem,1fr))] gap-x-6 gap-y-8">
        {themedColors.map((token) => (
          <figure key={token.name} className="m-0 flex flex-col gap-2">
            <div className={styles.swatch} style={{ background: `var(--cipher-${token.name})` }} />
            <figcaption className="flex flex-col gap-1">
              <code className="text-sm">{token.name}</code>
              <span className="text-muted-foreground line-clamp-2 text-xs">{token.usage}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </>
  );
}

const typeStyle = (name: string) => ({
  fontFamily: `var(--cipher-type-${name}-font-family)`,
  fontSize: `var(--cipher-type-${name}-font-size)`,
  lineHeight: `var(--cipher-type-${name}-line-height)`,
  fontWeight: `var(--cipher-type-${name}-font-weight)`,
  letterSpacing: `var(--cipher-type-${name}-letter-spacing)`
});

function TypographyPage() {
  return (
    <>
      <PageHeader
        title="Typography"
        description="Archivo for everything people read, Geist Mono for machine values."
      />
      {tokens.type.groups.map((group) => (
        <section key={group.name} className="mt-10">
          <h2 className="mb-3 text-sm font-medium">{group.name}</h2>
          <div className="flex flex-col">
            {group.styles.map((style) => (
              <div
                key={style.name}
                className="grid grid-cols-[10rem_1fr] items-baseline gap-6 border-b border-(--cipher-line-soft) py-4"
              >
                <code className="text-muted-foreground text-xs">{style.name}</code>
                <span style={typeStyle(style.name)}>{style.sample}</span>
              </div>
            ))}
          </div>
        </section>
      ))}
    </>
  );
}

function SpacingRow({ name, value }: { name: string; value: string }) {
  const bar = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number>();
  useLayoutEffect(() => {
    setWidth(
      bar.current ? Math.round(bar.current.getBoundingClientRect().width * 10) / 10 : undefined
    );
  }, []);
  const alias = value.includes("{");
  return (
    <div className="grid grid-cols-[18rem_4rem_1fr] items-center gap-6">
      <div className="flex min-w-0 flex-col">
        <code className="text-sm whitespace-nowrap">{name}</code>
        {alias && <code className="text-muted-foreground text-xs">{value}</code>}
      </div>
      <span className="text-muted-foreground text-xs whitespace-nowrap tabular-nums">
        {width === undefined ? value : `${width}px`}
      </span>
      <div className="flex h-3 items-center">
        <div
          ref={bar}
          className="h-3 bg-(--cipher-ink)"
          style={{ width: `var(--cipher-${name})` }}
        />
        {width === 0 && <div className="h-3 w-px bg-(--cipher-faint)" aria-hidden="true" />}
      </div>
    </div>
  );
}

function SpacingPage() {
  return (
    <>
      <PageHeader title="Spacing" description="The spacing scale. Corners are square everywhere." />
      <div className="mt-8 flex flex-col gap-3">
        {tokens.spacing.tokens
          .filter((token) => token.name.startsWith("space-"))
          .map((token) => (
            <SpacingRow key={token.name} name={token.name} value={token.value} />
          ))}
      </div>
    </>
  );
}

export const foundationPages = [
  { id: "color", title: "Color", Page: ColorPage },
  { id: "typography", title: "Typography", Page: TypographyPage },
  { id: "spacing", title: "Spacing", Page: SpacingPage }
];

import tokens from "@infisical/cipher/tokens.json";
import { PageHeader } from "@infisical/cipher/ui/page-header";

import styles from "./preview.module.css";

const themedColors = tokens.color.tokens.filter((token) => typeof token.value === "object");

function ColorPage() {
  return (
    <>
      <PageHeader title="Color" description="Every themed color token. Switch the theme to compare." />
      <div className="mt-8 grid grid-cols-[repeat(auto-fill,minmax(12rem,1fr))] gap-x-6 gap-y-8">
        {themedColors.map((token) => (
          <figure key={token.name} className="m-0 flex flex-col gap-2">
            <div className={styles.swatch} style={{ background: `var(--v4-${token.name})` }} />
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
  fontFamily: `var(--v4-type-${name}-font-family)`,
  fontSize: `var(--v4-type-${name}-font-size)`,
  lineHeight: `var(--v4-type-${name}-line-height)`,
  fontWeight: `var(--v4-type-${name}-font-weight)`,
  letterSpacing: `var(--v4-type-${name}-letter-spacing)`
});

function TypographyPage() {
  return (
    <>
      <PageHeader title="Typography" description="Archivo for everything people read, Geist Mono for machine values." />
      {tokens.type.groups.map((group) => (
        <section key={group.name} className="mt-10">
          <h2 className="mb-3 text-sm font-medium">{group.name}</h2>
          <div className="flex flex-col">
            {group.styles.map((style) => (
              <div
                key={style.name}
                className="grid grid-cols-[10rem_1fr] items-baseline gap-6 border-b border-(--v4-line-soft) py-4"
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

function SpacingPage() {
  return (
    <>
      <PageHeader title="Spacing" description="The spacing scale. Corners are square everywhere." />
      <div className="mt-8 flex flex-col gap-3">
        {tokens.spacing.tokens.filter((token) => token.name.startsWith("space-")).map((token) => (
          <div key={token.name} className="grid grid-cols-[10rem_4rem_1fr] items-center gap-6">
            <code className="text-sm">{token.name}</code>
            <span className="text-muted-foreground text-xs">{token.value}</span>
            <div className="h-3 bg-(--v4-ink)" style={{ width: token.value }} />
          </div>
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

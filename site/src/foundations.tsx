import tokens from "@infisical/cipher/tokens.json";
import { PageHeader } from "@infisical/cipher/ui/page-header";

import { ColorPage } from "./color/color-page";

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
      <PageHeader title="Typography" description="Archivo for everything people read, Geist Mono for machine values." />
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

function SpacingPage() {
  return (
    <>
      <PageHeader title="Spacing" description="The spacing scale. Corners are square everywhere." />
      <div className="mt-8 flex flex-col gap-3">
        {tokens.spacing.tokens.filter((token) => token.name.startsWith("space-")).map((token) => (
          <div key={token.name} className="grid grid-cols-[10rem_4rem_1fr] items-center gap-6">
            <code className="text-sm">{token.name}</code>
            <span className="text-muted-foreground text-xs">{token.value}</span>
            <div className="h-3 bg-(--cipher-ink)" style={{ width: token.value }} />
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

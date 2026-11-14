import { toast } from "@infisical/cipher/ui/sonner";

import { formatHex, formatOklch, formatRgb, type Rgba } from "./color-values";

import styles from "./color.module.css";

const copy = (value: string) => {
  void navigator.clipboard.writeText(value).then(() => toast("Copied " + value));
};

export function ColorValues({ color }: { color: Rgba | undefined }) {
  if (!color) return <span className="text-xs text-(--cipher-faint)">Reading</span>;
  return (
    <span className="flex flex-col items-start">
      {[formatHex(color), formatOklch(color), formatRgb(color)].map((value) => (
        <button
          key={value}
          type="button"
          className={styles.value}
          title={"Copy " + value}
          onClick={() => copy(value)}
        >
          {value}
        </button>
      ))}
    </span>
  );
}

export function Swatch({
  name,
  paint,
  color,
  reference
}: {
  name: string;
  paint: string;
  color: Rgba | undefined;
  reference?: string;
}) {
  return (
    <figure className={styles.swatch}>
      <div className={styles.chip}>
        <div className="absolute inset-0" style={{ background: paint }} />
      </div>
      <figcaption className="flex min-w-0 flex-col gap-1">
        <code className="truncate text-sm">{name}</code>
        {reference && <span className="truncate text-xs text-(--cipher-muted)">{reference}</span>}
        <ColorValues color={color} />
      </figcaption>
    </figure>
  );
}

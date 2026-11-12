import { useEffect, useId, useState } from "react";

import { Button } from "@infisical/cipher/ui/button";
import { type ToastItem, ToastStack } from "@infisical/cipher/ui/sonner";

const tones = {
  neutral: { id: "neutral", title: "Version available", tone: "neutral" },
  ok: { id: "ok", title: "Changes saved", tone: "ok" },
  bad: { id: "bad", title: "Connection failed", tone: "bad" },
  loading: { id: "loading", title: "Checking provider", tone: "loading" }
} satisfies Record<string, ToastItem>;

const resolved = { id: "loading", title: "Provider connected", tone: "ok" } satisfies ToastItem;

const ToneDemo = ({ tone }: { tone: keyof typeof tones }) => {
  const regionId = useId();
  const [item, setItem] = useState<ToastItem | null>(null);
  useEffect(() => {
    if (item?.tone !== "loading") return undefined;
    const timer = window.setTimeout(() => setItem(resolved), 1800);
    return () => window.clearTimeout(timer);
  }, [item]);
  return (
    <div className="flex w-full flex-col items-start gap-3">
      <Button
        variant="outline"
        aria-controls={regionId}
        onClick={() => setItem({ ...tones[tone], duration: 0 })}
      >
        Show {tone} notice
      </Button>
      <div id={regionId} className="min-h-14 w-full">
        <ToastStack inline items={item ? [item] : []} onDismiss={() => setItem(null)} />
      </div>
    </div>
  );
};

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,20rem),1fr))] items-start gap-x-6 gap-y-8">
      {(Object.keys(tones) as (keyof typeof tones)[]).map((tone) => (
        <figure key={tone} className="m-0 flex w-full min-w-0 flex-col gap-3">
          <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
            <ToneDemo tone={tone} />
          </div>
          <figcaption className="text-muted-foreground text-xs">{tone}</figcaption>
        </figure>
      ))}
    </div>
  );
}

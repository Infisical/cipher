import { useState } from "react";

import { Button } from "@infisical/cipher/ui/button";
import { type ToastItem, ToastStack } from "@infisical/cipher/ui/sonner";

const share = { label: "Share 2 secrets", onClick: () => undefined };

const cases: { label: string; item: ToastItem }[] = [
  { label: "ok, title only", item: { id: "ok", tone: "ok", title: "Changes saved" } },
  {
    label: "ok, description",
    item: {
      id: "ok-description",
      tone: "ok",
      title: "Changes saved",
      description: "New versions are available to clients."
    }
  },
  {
    label: "bad, description",
    item: {
      id: "bad",
      tone: "bad",
      title: "Connection failed",
      description: "Reconnect the integration before retrying."
    }
  },
  { label: "neutral, title only", item: { id: "neutral", title: "Version available" } },
  {
    label: "neutral, action",
    item: {
      id: "neutral-action",
      title: "Version available",
      description: "Reload to get the latest dashboard.",
      action: { label: "Reload", onClick: () => undefined }
    }
  },
  {
    label: "ok, action, no description",
    item: { id: "ok-action", tone: "ok", title: "Uploaded 2 secrets", action: share }
  },
  {
    label: "long title",
    item: {
      id: "long",
      tone: "ok",
      title: "Uploaded 2 secrets into Development, Staging, Production and Preview"
    }
  },
  {
    label: "upload",
    item: {
      id: "upload",
      tone: "ok",
      title: "Uploaded 2 secrets into Development, Staging, Production",
      description: "6 secrets created.",
      action: share
    }
  },
  { label: "loading", item: { id: "loading", tone: "loading", title: "Checking provider" } }
];

const Case = ({ item }: { item: ToastItem }) => {
  const [open, setOpen] = useState(true);
  if (!open)
    return (
      <Button variant="outline" onClick={() => setOpen(true)}>
        Show again
      </Button>
    );
  return <ToastStack inline items={[{ ...item, duration: 0 }]} onDismiss={() => setOpen(false)} />;
};

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,20rem),1fr))] items-start gap-x-6 gap-y-8">
      {cases.map(({ label, item }) => (
        <figure key={label} className="m-0 flex w-full min-w-0 flex-col gap-3">
          <div className="flex min-h-8 w-full min-w-0 flex-col items-start gap-3">
            <Case item={item} />
          </div>
          <figcaption className="text-muted-foreground text-xs">{label}</figcaption>
        </figure>
      ))}
    </div>
  );
}

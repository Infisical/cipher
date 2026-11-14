import { Icon } from "@infisical/cipher/ui/icon";

const added = [
  "pencil",
  "undo",
  "pause",
  "flag",
  "rocket",
  "activity",
  "cloud",
  "archive",
  "archive-restore",
  "arrow-right-left",
  "hourglass",
  "alarm",
  "calendar-clock",
  "chart-column",
  "receipt",
  "credit-card",
  "gift",
  "file-text",
  "award",
  "zap",
  "radar",
  "scan-line",
  "scan-search",
  "vault",
  "file-key",
  "users",
  "layout-grid",
  "server"
] as const;

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,8rem),1fr))] items-start justify-items-center gap-x-6 gap-y-8">
      {added.map((name) => (
        <span key={name} className="flex min-w-0 flex-col items-center gap-2 text-center text-sm">
          <span className="flex items-end gap-3">
            <Icon name={name} size={24} />
            <Icon name={name} />
          </span>
          <span>{name}</span>
        </span>
      ))}
    </div>
  );
}

import {
  ArrowBigUp,
  ArrowLeft,
  ArrowRight,
  ArrowRightToLine,
  ArrowUpDown,
  ChevronUp,
  Command,
  CornerDownLeft,
  Delete,
  Option
} from "lucide-react";

import { Icon } from "@infisical/cipher/ui/icon";

const fallbacks = [
  { icon: Command, name: "Command", use: "Kbd" },
  { icon: ArrowBigUp, name: "ArrowBigUp", use: "Kbd shift" },
  { icon: Option, name: "Option", use: "Kbd" },
  { icon: ChevronUp, name: "ChevronUp", use: "Kbd control" },
  { icon: CornerDownLeft, name: "CornerDownLeft", use: "Kbd enter" },
  { icon: Delete, name: "Delete", use: "Kbd backspace" },
  { icon: ArrowLeft, name: "ArrowLeft", use: "Kbd" },
  { icon: ArrowRight, name: "ArrowRight", use: "Kbd" },
  { icon: ArrowRightToLine, name: "ArrowRightToLine", use: "Kbd tab" },
  { icon: ArrowUpDown, name: "ArrowUpDown", use: "Unsorted column" }
];

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,8rem),1fr))] items-start justify-items-center gap-x-6 gap-y-8">
      {fallbacks.map(({ icon, name, use }) => (
        <span key={name} className="flex min-w-0 flex-col items-center gap-2 text-center text-sm">
          <Icon icon={icon} />
          <span>{name}</span>
          <span className="text-muted-foreground text-xs">Lucide, {use}</span>
        </span>
      ))}
    </div>
  );
}

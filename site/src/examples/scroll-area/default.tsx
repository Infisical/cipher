import * as UI from "@infisical/cipher/ui/scroll-area";

export default function Example() {
  return (
    <div className="flex w-full min-w-0 flex-col items-start gap-6">
      <UI.ScrollArea className="h-48 w-full">
        <ul className="space-y-3 p-4">
          {Array.from({ length: 20 }, (_, index) => (
            <li key={index}>Version {20 - index}</li>
          ))}
        </ul>
      </UI.ScrollArea>
    </div>
  );
}

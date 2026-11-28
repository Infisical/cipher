import { Button } from "@infisical/cipher/ui/button";
import { Tooltip, TooltipProvider } from "@infisical/cipher/ui/tooltip";

export default function Example() {
  return (
    <TooltipProvider>
      <div className="flex w-full min-w-0 flex-col items-start gap-24 pb-16">
        <Tooltip
          open
          side="bottom"
          align="start"
          content="Read access permits fetching values. It does not permit creating or updating secrets."
        >
          <Button variant="ghost">About read access</Button>
        </Tooltip>
        <Tooltip open side="bottom" align="start" content="Open search" shortcut="mod+K">
          <Button variant="outline">Search</Button>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}

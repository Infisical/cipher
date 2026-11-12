import { Button } from "@infisical/cipher/ui/button";
import * as UI from "@infisical/cipher/ui/collapsible";

export default function Example() {
  return (
    <div className="flex w-full min-w-0 flex-col items-start gap-6">
      <UI.Collapsible>
        <UI.CollapsibleTrigger asChild>
          <Button variant="outline">View connection details</Button>
        </UI.CollapsibleTrigger>
        <UI.CollapsibleContent>
          <p className="mt-4">Last synchronized 12 versions.</p>
        </UI.CollapsibleContent>
      </UI.Collapsible>
    </div>
  );
}

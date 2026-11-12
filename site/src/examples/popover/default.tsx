import { Button } from "@infisical/cipher/ui/button";
import { Input } from "@infisical/cipher/ui/input";
import { Label } from "@infisical/cipher/ui/label";
import * as UI from "@infisical/cipher/ui/popover";

export default function Example() {
  return (
    <div className="flex w-full min-w-0 flex-col items-start gap-6">
      <UI.Popover>
        <UI.PopoverTrigger asChild>
          <Button variant="outline">Connection settings</Button>
        </UI.PopoverTrigger>
        <UI.PopoverContent>
          <UI.PopoverHeader>
            <UI.PopoverTitle>Connection settings</UI.PopoverTitle>
            <UI.PopoverDescription>Choose the destination hostname.</UI.PopoverDescription>
          </UI.PopoverHeader>
          <Label htmlFor="popover-host">Hostname</Label>
          <Input id="popover-host" defaultValue="vault.example.test" />
        </UI.PopoverContent>
      </UI.Popover>
    </div>
  );
}

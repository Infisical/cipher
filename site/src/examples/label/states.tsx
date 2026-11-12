import { Input } from "@infisical/cipher/ui/input";
import { Label } from "@infisical/cipher/ui/label";

export default function Example() {
  return (
    <div className="flex w-full min-w-0 flex-col items-start gap-6">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="label-required">Name (required)</Label>
        <Input id="label-required" required />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="label-optional">Description (optional)</Label>
        <Input id="label-optional" />
      </div>
      <div className="group flex flex-col gap-1.5" data-disabled="true">
        <Label htmlFor="label-disabled">Managed name</Label>
        <Input id="label-disabled" disabled defaultValue="platform" />
      </div>
    </div>
  );
}

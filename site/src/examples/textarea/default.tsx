import { Label } from "@infisical/cipher/ui/label";
import * as UI from "@infisical/cipher/ui/textarea";

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,15rem),1fr))] items-start gap-x-6 gap-y-8">
      <div className="space-y-2">
        <Label htmlFor="description">Connection description</Label>
        <UI.Textarea id="description" defaultValue="Synchronizes the staging environment." />
      </div>
      <div className="space-y-2">
        <Label htmlFor="invalid-description">Change reason</Label>
        <UI.Textarea id="invalid-description" aria-invalid aria-describedby="reason-error" />
        <p id="reason-error">Explain why access is needed.</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="managed-description">Managed description</Label>
        <UI.Textarea id="managed-description" value="Required by policy" disabled />
      </div>
    </div>
  );
}

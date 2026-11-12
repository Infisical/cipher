import { Input } from "@infisical/cipher/ui/input";
import * as UI from "@infisical/cipher/ui/label";

export default function Example() {
  return (
    <div className="flex w-full min-w-0 flex-col items-start gap-6">
      <div className="flex flex-col gap-1.5">
        <UI.Label htmlFor="label-example">Environment name</UI.Label>
        <Input id="label-example" defaultValue="staging" />
      </div>
    </div>
  );
}

import { Button } from "@infisical/cipher/ui/button";
import * as UI from "@infisical/cipher/ui/dialog";
import { Field } from "@infisical/cipher/ui/field";
import { Input } from "@infisical/cipher/ui/input";

const entries = Array.from({ length: 30 }, (_, index) => ({
  version: 30 - index,
  change:
    index % 3 === 0
      ? "Rotated DATABASE_CONNECTION_STRING_FOR_THE_PRIMARY_EU_WEST_1_REPLICA_CLUSTER in production"
      : "Updated deployment configuration"
}));

export default function Example() {
  return (
    <div className="flex w-full min-w-0 flex-wrap items-start gap-3">
      <UI.Dialog>
        <UI.DialogTrigger asChild>
          <Button variant="outline">Short body</Button>
        </UI.DialogTrigger>
        <UI.DialogContent>
          <UI.DialogHeader>
            <UI.DialogTitle>Archive environment</UI.DialogTitle>
          </UI.DialogHeader>
          <UI.DialogBody>
            <p>Archived environments stay readable and can be restored at any time.</p>
          </UI.DialogBody>
          <UI.DialogFooter showCloseButton />
        </UI.DialogContent>
      </UI.Dialog>
      <UI.Dialog>
        <UI.DialogTrigger asChild>
          <Button variant="outline">Fields</Button>
        </UI.DialogTrigger>
        <UI.DialogContent>
          <UI.DialogHeader>
            <UI.DialogTitle>Add environment</UI.DialogTitle>
          </UI.DialogHeader>
          <UI.DialogBody>
            <Field label="Name">
              <Input defaultValue="staging" />
            </Field>
            <Field label="Slug">
              <Input defaultValue="staging" mono />
            </Field>
          </UI.DialogBody>
          <UI.DialogFooter>
            <UI.DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </UI.DialogClose>
            <Button>Add environment</Button>
          </UI.DialogFooter>
        </UI.DialogContent>
      </UI.Dialog>
      <UI.Dialog>
        <UI.DialogTrigger asChild>
          <Button variant="outline">Long body</Button>
        </UI.DialogTrigger>
        <UI.DialogContent>
          <UI.DialogHeader>
            <UI.DialogTitle>Environment history</UI.DialogTitle>
          </UI.DialogHeader>
          <UI.DialogBody>
            <ol>
              {entries.map((entry) => (
                <li key={entry.version}>
                  Version {entry.version}: {entry.change}
                </li>
              ))}
            </ol>
          </UI.DialogBody>
          <UI.DialogFooter showCloseButton />
        </UI.DialogContent>
      </UI.Dialog>
    </div>
  );
}

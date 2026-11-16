import { Button } from "@infisical/cipher/ui/button";
import * as UI from "@infisical/cipher/ui/dialog";
import { DocumentationLink } from "@infisical/cipher/ui/documentation-link";

export default function Example() {
  return (
    <div className="flex w-full min-w-0 flex-col items-start gap-6">
      <UI.Dialog>
        <UI.DialogTrigger asChild>
          <Button variant="outline">Add member</Button>
        </UI.DialogTrigger>
        <UI.DialogContent>
          <UI.DialogHeader>
            <UI.DialogTitle
              badges={
                <DocumentationLink
                  href="https://infisical.com/docs/documentation/platform/pki/code-signing"
                  subject="code signing members"
                />
              }
            >
              Add member
            </UI.DialogTitle>
            <UI.DialogDescription>Members can sign with this signer.</UI.DialogDescription>
          </UI.DialogHeader>
          <UI.DialogFooter>
            <UI.DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </UI.DialogClose>
            <Button>Add member</Button>
          </UI.DialogFooter>
        </UI.DialogContent>
      </UI.Dialog>
    </div>
  );
}

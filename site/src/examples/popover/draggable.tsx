import { useState } from "react";

import { Button } from "@infisical/cipher/ui/button";
import { Field } from "@infisical/cipher/ui/field";
import * as UI from "@infisical/cipher/ui/popover";
import { Textarea } from "@infisical/cipher/ui/textarea";

function CommentPopover() {
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState("");
  const [draft, setDraft] = useState(saved);
  return (
    <div className="flex flex-col gap-3">
      <p>Comment on STRIPE_WEBHOOK_SIGNING_SECRET: {saved || "none"}</p>
      <UI.Popover
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (next) setDraft(saved);
        }}
      >
        <UI.PopoverTrigger asChild>
          <Button variant="outline">{saved ? "Edit comment" : "Add comment"}</Button>
        </UI.PopoverTrigger>
        <UI.PopoverContent draggable align="start" aria-label="Comment">
          <form
            className="flex flex-col gap-3"
            onSubmit={(event) => {
              event.preventDefault();
              setSaved(draft.trim());
              setOpen(false);
            }}
          >
            <Field label="Comment">
              <Textarea
                value={draft}
                placeholder="Add a comment..."
                onChange={(event) => setDraft(event.target.value)}
              />
            </Field>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="ghost" size="xs" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="xs" disabled={draft.trim() === saved}>
                Save comment
              </Button>
            </div>
          </form>
        </UI.PopoverContent>
      </UI.Popover>
    </div>
  );
}

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-1 items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-start gap-3">
          <CommentPopover />
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Draggable comment"}</figcaption>
      </figure>
    </div>
  );
}

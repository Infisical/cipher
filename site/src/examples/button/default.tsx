import { useEffect, useRef, useState } from "react";

import { Button } from "@infisical/cipher/ui/button";

export default function Example() {
  const [pending, setPending] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,8rem),1fr))] items-start justify-items-center gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col items-center gap-3 text-center">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-center gap-3">
          <Button
            loading={pending}
            onClick={() => {
              setPending(true);
              timer.current = setTimeout(() => setPending(false), 900);
            }}
          >
            Save changes
          </Button>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"default"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col items-center gap-3 text-center">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-center gap-3">
          <Button variant="accent">Grant for 1 hour</Button>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"accent"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col items-center gap-3 text-center">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-center gap-3">
          <Button variant="outline">Edit settings</Button>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"outline"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col items-center gap-3 text-center">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-center gap-3">
          <Button variant="ghost">Cancel</Button>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"ghost"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col items-center gap-3 text-center">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-center gap-3">
          <Button variant="destructive">Delete project</Button>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"destructive"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col items-center gap-3 text-center">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-center gap-3">
          <Button variant="link" asChild>
            <a href="#input">Input guide</a>
          </Button>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"link"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col items-center gap-3 text-center">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-center gap-3">
          <Button variant="link" underline="hover" asChild>
            <a href="#table">Table guide</a>
          </Button>
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"link, underline on hover"}
        </figcaption>
      </figure>
    </div>
  );
}

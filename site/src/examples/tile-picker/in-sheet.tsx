import * as React from "react";

import { TilePicker } from "@infisical/cipher/patterns/tile-picker";
import { Button } from "@infisical/cipher/ui/button";
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@infisical/cipher/ui/sheet";

import { providers } from "./data";

export default function Example() {
  const [open, setOpen] = React.useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline">Add sync</Button>
      </SheetTrigger>
      <SheetContent size="lg">
        <SheetHeader>
          <SheetTitle>Choose a destination</SheetTitle>
          <SheetDescription>Where should Infisical write these secrets?</SheetDescription>
        </SheetHeader>
        <SheetBody>
          <TilePicker
            items={providers}
            onSelect={() => setOpen(false)}
            searchLabel="Search destinations"
            allLabel="All providers"
            noun="providers"
          />
        </SheetBody>
      </SheetContent>
    </Sheet>
  );
}

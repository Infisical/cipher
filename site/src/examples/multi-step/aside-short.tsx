import { Field } from "@infisical/cipher/ui/field";
import { Input } from "@infisical/cipher/ui/input";
import { MultiStep } from "@infisical/cipher/ui/multi-step";

import { OverlayStage } from "../overlay-stage";

const steps = [
  {
    title: "Name",
    aside: { description: "Shown in the secrets list and in secret paths." },
    content: (
      <Field label="Folder name">
        <Input defaultValue="payments" />
      </Field>
    )
  },
  { title: "Location", aside: { description: "The folder this one sits in." }, content: null },
  {
    title: "Review",
    aside: { description: "Nothing is created until you confirm." },
    content: null
  }
];

export default function Example() {
  return (
    <div className="flex w-full min-w-0 flex-col gap-6">
      <OverlayStage height={460}>
        <MultiStep
          variant="sheet"
          layout="aside"
          title="New folder"
          open
          modal={false}
          steps={steps}
        />
      </OverlayStage>
      <OverlayStage height={420}>
        <MultiStep
          variant="dialog"
          layout="aside"
          title="New folder"
          open
          modal={false}
          steps={steps}
        />
      </OverlayStage>
    </div>
  );
}

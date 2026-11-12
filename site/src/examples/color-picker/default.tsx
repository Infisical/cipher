import { useState } from "react";

import { ColorPicker, tagColorPresets } from "@infisical/cipher/ui/color-picker";
import { Field } from "@infisical/cipher/ui/field";

const hexColor = /^#[0-9a-f]{6}$/i;

export default function Example() {
  const [tag, setTag] = useState(tagColorPresets[3].value);
  const [custom, setCustom] = useState("#14324a");
  const [empty, setEmpty] = useState("");
  const [typo, setTypo] = useState("#12345");
  const [brand, setBrand] = useState("#f4f1ea");
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,15rem),1fr))] items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Field label="Color">
            <ColorPicker value={tag} onChange={setTag} presets={tagColorPresets} />
          </Field>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Tag color"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Field label="Color">
            <ColorPicker value={custom} onChange={setCustom} presets={tagColorPresets} />
          </Field>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Custom value"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Field label="Color" optional>
            <ColorPicker value={empty} onChange={setEmpty} presets={tagColorPresets} />
          </Field>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Empty"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Field
            label="Color"
            error={hexColor.test(typo) ? undefined : "Use a six-digit hex color"}
          >
            <ColorPicker value={typo} onChange={setTypo} presets={tagColorPresets} />
          </Field>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Invalid"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Field label="Color">
            <ColorPicker value={tag} onChange={setTag} presets={tagColorPresets} disabled />
          </Field>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Disabled"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Field label="Secondary color">
            <ColorPicker value={brand} onChange={setBrand} />
          </Field>
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"No presets, preview only"}
        </figcaption>
      </figure>
    </div>
  );
}

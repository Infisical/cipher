import { Label } from "@infisical/cipher/ui/label";
import { RadioGroup, RadioGroupItem } from "@infisical/cipher/ui/radio-group";

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,15rem),1fr))] items-start gap-x-6 gap-y-8">
      {(["horizontal", "vertical"] as const).map((orientation) => (
        <figure key={orientation} className="m-0 flex w-full min-w-0 flex-col gap-3">
          <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
            <RadioGroup
              orientation={orientation}
              aria-label={`${orientation} region`}
              defaultValue="west"
            >
              <div className={orientation === "horizontal" ? "flex flex-wrap gap-4" : "space-y-3"}>
                {["west", "east"].map((value) => (
                  <div key={value} className="flex items-center gap-3">
                    <RadioGroupItem id={`radio-${orientation}-${value}`} value={value} />
                    <Label htmlFor={`radio-${orientation}-${value}`}>{value}</Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>
          <figcaption className="text-muted-foreground text-xs">{orientation}</figcaption>
        </figure>
      ))}
    </div>
  );
}

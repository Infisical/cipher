import { FieldDescription, FieldError } from "@infisical/cipher/ui/field";
import { Label } from "@infisical/cipher/ui/label";
import { RadioGroup, RadioGroupItem } from "@infisical/cipher/ui/radio-group";

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,15rem),1fr))] items-start gap-x-6 gap-y-8">
      {[
        { id: "empty", name: "Empty choice", disabled: false, invalid: false },
        { id: "invalid", name: "Required choice", disabled: false, invalid: true },
        { id: "disabled", name: "Policy choice", disabled: true, invalid: false }
      ].map((item) => (
        <fieldset key={item.id} className="min-w-0 space-y-3">
          <legend className="text-sm">{item.name}</legend>
          <RadioGroup
            aria-label={item.name}
            disabled={item.disabled}
            aria-invalid={item.invalid || undefined}
            aria-describedby={item.invalid ? "radio-required-error" : undefined}
          >
            {["west", "east"].map((value) => (
              <div key={value} className="flex items-center gap-3">
                <RadioGroupItem
                  id={`radio-${item.id}-${value}`}
                  value={value}
                  aria-invalid={item.invalid || undefined}
                />
                <Label htmlFor={`radio-${item.id}-${value}`}>{value}</Label>
              </div>
            ))}
          </RadioGroup>
          {item.invalid && <FieldError id="radio-required-error">Choose a region.</FieldError>}
          {item.disabled && <FieldDescription>Region is managed by policy.</FieldDescription>}
        </fieldset>
      ))}
    </div>
  );
}

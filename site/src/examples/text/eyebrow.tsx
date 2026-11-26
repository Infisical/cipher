import { Eyebrow, SmallText } from "@infisical/cipher/ui/text";

const sections = [
  ["When", "A secret changes in production"],
  ["Conditions", "The path matches /payments/** and the author is not in the Platform group"],
  [
    "Then",
    "Notify #payments-oncall and require approval from a project admin before the change applies"
  ]
] as const;

export default function Example() {
  return (
    <div className="flex w-full max-w-md min-w-0 flex-col gap-5">
      {sections.map(([label, body]) => (
        <section key={label} className="flex min-w-0 flex-col gap-1">
          <Eyebrow>{label}</Eyebrow>
          <SmallText>{body}</SmallText>
        </section>
      ))}
    </div>
  );
}

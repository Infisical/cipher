import { ShareBar } from "@infisical/cipher/ui/share-bar";

const states = [
  {
    caption: "Empty",
    node: <ShareBar label="Auth methods" items={[]} empty="No secret access in the past 30 days" />
  },
  {
    caption: "One item",
    node: (
      <ShareBar
        label="Auth methods"
        items={[{ id: "universal-auth", label: "Universal Auth", value: 42 }]}
      />
    )
  },
  {
    caption: "Part of a larger total, no legend",
    node: (
      <ShareBar
        label="Seats used"
        legend={false}
        total={50}
        items={[
          { id: "admins", label: "Admins", value: 4 },
          { id: "members", label: "Members", value: 27 }
        ]}
      />
    )
  }
];

export default function Example() {
  return (
    <div className="flex w-full max-w-xl min-w-0 flex-col gap-8">
      {states.map((state) => (
        <figure key={state.caption} className="m-0 flex w-full min-w-0 flex-col gap-3">
          {state.node}
          <figcaption className="text-muted-foreground text-xs">{state.caption}</figcaption>
        </figure>
      ))}
    </div>
  );
}

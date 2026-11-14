import { useState } from "react";

import { Badge } from "@infisical/cipher/ui/badge";
import { Card, CardChoice, CardLink } from "@infisical/cipher/ui/card";
import { Icon } from "@infisical/cipher/ui/icon";
import { RadioGroup } from "@infisical/cipher/ui/radio-group";
import { ToggleGroup, ToggleGroupItem } from "@infisical/cipher/ui/toggle-group";

const plans = [
  { value: "pro", title: "Pro", price: "$18 per identity per month", tier: undefined },
  { value: "enterprise", title: "Enterprise", price: "Annual contract", tier: "Sales-led" },
  { value: "custom", title: "Custom", price: "Priced per deal", tier: undefined }
];

const products = [
  { value: "secrets", title: "Secrets Management" },
  { value: "pam", title: "Privileged Access" },
  { value: "scanning", title: "Secret Scanning" }
];

const rowFill = [
  "data-[selected]:[background-image:none]! [&_[data-slot=card-choice]>[aria-hidden]]:hidden!",
  "[&[data-selected]:not([data-variant=framed])]:bg-(--cipher-selected-surface)! [&[data-selected]:not([data-variant=framed])]:border-(--cipher-selected-border)!",
  "[&[data-selected][data-variant=framed]>:is([data-slot=card-content],[data-slot=card-footer]:not([data-placement=frame]))]:bg-(--cipher-selected-surface)! [&[data-selected][data-variant=framed]>:is([data-slot=card-content],[data-slot=card-footer]:not([data-placement=frame]))]:[background-image:none]! [&[data-selected][data-variant=framed]>:is([data-slot=card-content],[data-slot=card-footer]:not([data-placement=frame]))]:border-(--cipher-selected-border)!"
].join(" ");

export default function Example() {
  const [look, setLook] = useState("choice");
  const [plan, setPlan] = useState("enterprise");
  const [picked, setPicked] = useState<string[]>(["secrets"]);
  const alternative = look === "row";
  const mark = (on: boolean) =>
    alternative && on ? (
      <Icon name="check" aria-hidden className="text-(--cipher-ink)" />
    ) : undefined;
  return (
    <div className="grid w-full min-w-0 grid-cols-1 items-start gap-x-6 gap-y-8">
      <ToggleGroup
        type="single"
        value={look}
        onValueChange={(next) => next && setLook(next)}
        aria-label="Selected look"
      >
        <ToggleGroupItem value="choice">Choice mark (recommended)</ToggleGroupItem>
        <ToggleGroupItem value="row">Row fill (alternative)</ToggleGroupItem>
      </ToggleGroup>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <RadioGroup
          aria-label="Plan"
          value={plan}
          onValueChange={setPlan}
          className="grid-cols-1 gap-4 sm:grid-cols-3"
        >
          {plans.map((item) => (
            <Card
              key={item.value}
              className={alternative ? rowFill : undefined}
              title={<CardChoice value={item.value}>{item.title}</CardChoice>}
              badges={item.tier && <Badge tone="info">{item.tier}</Badge>}
              action={mark(plan === item.value)}
            >
              {item.price}
            </Card>
          ))}
        </RadioGroup>
        <figcaption className="text-muted-foreground text-xs">
          {
            "plain, one choice: CardChoice with a value is a radio in a RadioGroup, arrow keys move between cards"
          }
        </figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div role="group" aria-label="Products" className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {products.map((item) => (
            <Card
              key={item.value}
              variant="framed"
              className={alternative ? rowFill : undefined}
              footer={
                <>
                  Billed per identity
                  {mark(picked.includes(item.value))}
                </>
              }
            >
              <CardChoice
                checked={picked.includes(item.value)}
                onCheckedChange={(on) =>
                  setPicked((list) =>
                    on ? [...list, item.value] : list.filter((value) => value !== item.value)
                  )
                }
              >
                {item.title}
              </CardChoice>
            </Card>
          ))}
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"framed, several choices: CardChoice without a value is a checkbox"}
        </figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            ["Production", "412 secrets"],
            ["Staging", "398 secrets"],
            ["Development", "377 secrets"]
          ].map(([name, count], index) => (
            <Card
              key={name}
              selected={index === 0}
              className={alternative ? rowFill : undefined}
              title={
                <CardLink
                  link={{ href: "#/components/card" }}
                  aria-current={index === 0 ? "page" : undefined}
                >
                  {name}
                </CardLink>
              }
              action={mark(index === 0)}
            >
              {count}
            </Card>
          ))}
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"selected with a CardLink: the current card, marked aria-current"}
        </figcaption>
      </figure>
    </div>
  );
}

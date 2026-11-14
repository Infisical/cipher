import * as React from "react";

import { Card } from "@infisical/cipher/ui/card";
import { SortableGrid } from "@infisical/cipher/ui/sortable-grid";
import { SmallText } from "@infisical/cipher/ui/text";

const initial = [
  { id: "secrets", name: "Secrets Management", detail: "52 secrets in 9 environments" },
  { id: "certificates", name: "Certificate Manager", detail: "11 certificates, 2 CAs" },
  { id: "kms", name: "KMS", detail: "7 keys in 3 projects" },
  { id: "scanning", name: "Secret Scanning", detail: "51 findings across 5 sources" },
  { id: "pam", name: "Privileged Access Manager", detail: "14 accounts" },
  { id: "agent-vault", name: "Agent Vault", detail: "Not set up", locked: true }
];

export default function Example() {
  const [products, setProducts] = React.useState(initial);
  return (
    <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
      <SortableGrid
        label="Products"
        items={products}
        getKey={(product) => product.id}
        getLabel={(product) => product.name}
        isItemDisabled={(product) => Boolean(product.locked)}
        onReorder={setProducts}
        minItemWidth={220}
        renderItem={(product, { handle }) => (
          <Card title={product.name} action={handle}>
            <SmallText>{product.detail}</SmallText>
          </Card>
        )}
      />
      <figcaption className="text-muted-foreground text-xs">
        {`Order: ${products.map((product) => product.name).join(", ")}. Agent Vault is locked.`}
      </figcaption>
    </figure>
  );
}

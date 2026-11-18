import { TilePicker } from "@infisical/cipher/patterns/tile-picker";

import { providers } from "./data";

const docs = providers.map((provider) => ({
  ...provider,
  popular: false,
  href: `#${provider.value}`
}));

export default function Example() {
  return (
    <TilePicker items={docs} layout="list" searchLabel="Search integrations" noun="integrations" />
  );
}

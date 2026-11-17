import { TilePicker } from "@infisical/cipher/patterns/tile-picker";

import { providers } from "./data";

const few = providers
  .filter((provider) => ["aws-secrets-manager", "github", "vercel"].includes(provider.value))
  .map((provider) => ({ ...provider, popular: false }));

export default function Example() {
  return (
    <TilePicker
      items={few}
      onSelect={() => {}}
      searchLabel="Search providers"
      allLabel="All providers"
      noun="providers"
    />
  );
}

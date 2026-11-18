import { TilePicker } from "@infisical/cipher/patterns/tile-picker";

import { providers } from "./data";

export default function Example() {
  return (
    <TilePicker
      items={providers}
      onSelect={() => {}}
      density="compact"
      groupBy="category"
      searchLabel="Search providers"
      noun="providers"
    />
  );
}

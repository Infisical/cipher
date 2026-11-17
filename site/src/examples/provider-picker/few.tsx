import { ProviderPicker } from "@infisical/cipher/patterns/provider-picker";

import { providers } from "./data";

const few = providers
  .filter((provider) => ["aws-secrets-manager", "github", "vercel"].includes(provider.value))
  .map((provider) => ({ ...provider, popular: false }));

export default function Example() {
  return <ProviderPicker items={few} onSelect={() => {}} searchPlaceholder="Search providers" />;
}

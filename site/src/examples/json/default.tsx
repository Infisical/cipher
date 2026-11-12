import { Json } from "@infisical/cipher/ui/json";

export default function Example() {
  return (
    <Json
      value={{
        project: "production",
        events: [{ action: "secret.read", actor: "build-agent" }],
        credentials: { apiKey: "sample-secret" }
      }}
      redact={["apiKey"]}
      label="Audit event"
    />
  );
}

import { Badge } from "@infisical/cipher/ui/badge";
import { SettingsCard } from "@infisical/cipher/ui/settings-card";
import { Switch } from "@infisical/cipher/ui/switch";

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,26rem),1fr))] items-start gap-x-6 gap-y-8">
      <SettingsCard
        title="Audit log streams"
        badges={<Badge tone="outline">Enterprise</Badge>}
        action={
          <Switch aria-label="Stream audit logs" checked={false} onChange={() => undefined} />
        }
      />
      <SettingsCard
        title="Multi-factor authentication"
        badges={
          <>
            <Badge tone="ok" dot>
              Enforced
            </Badge>
            <Badge tone="outline">Email</Badge>
          </>
        }
        saveStatus="saved"
        action={<Switch aria-label="Enforce MFA" checked onChange={() => undefined} />}
      />
      <SettingsCard
        title="Require multi-factor authentication for every member, service account and machine identity in this organization"
        badges={
          <>
            <Badge tone="ok" dot>
              Enforced
            </Badge>
            <Badge tone="outline">Email</Badge>
            <Badge tone="outline">Authenticator app</Badge>
          </>
        }
        saveStatus="saved"
        action={<Switch aria-label="Require MFA everywhere" checked onChange={() => undefined} />}
      />
    </div>
  );
}

import { useState } from "react";

import { Button } from "@infisical/cipher/ui/button";
import { Field } from "@infisical/cipher/ui/field";
import { Input } from "@infisical/cipher/ui/input";
import { Select } from "@infisical/cipher/ui/select";
import { SettingsCard, useAutosave } from "@infisical/cipher/ui/settings-card";
import { toast } from "@infisical/cipher/ui/sonner";
import { Switch } from "@infisical/cipher/ui/switch";

const wait = (ms: number) =>
  new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });

export default function Example() {
  const [trustLdap, setTrustLdap] = useState(false);
  const [name, setName] = useState("Maya Chen");
  const ldap = useAutosave({
    value: trustLdap,
    errorMessage: "Couldn't update LDAP email verification. Try again.",
    onSave: async (next) => {
      await wait(1200);
      setTrustLdap(next);
      toast.success("LDAP email verification updated");
    }
  });
  const profile = useAutosave({
    value: name,
    errorMessage: "Couldn't update your name. Try again.",
    onSave: async (next) => {
      await wait(1200);
      setName(next.trim());
      toast.success("Name updated");
    }
  });
  const [aiModel, setAiModel] = useState("claude-sonnet");
  const [aiEnabled, setAiEnabled] = useState(true);
  const ai = useAutosave({
    value: aiModel,
    errorMessage: "Couldn't update the AI model. Try again.",
    onSave: async (next) => {
      await wait(1200);
      setAiModel(next);
      toast.success("AI model updated");
    }
  });
  const events = useAutosave({
    value: true,
    errorMessage: "Couldn't update the secret events class. Try again.",
    onSave: async () => {
      await wait(1200);
      throw new Error("Request failed");
    }
  });
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,26rem),1fr))] items-start gap-x-6 gap-y-8">
      <SettingsCard
        title="LDAP email verification"
        saveStatus={ldap.status}
        action={
          <Switch
            aria-label="Trust LDAP emails"
            checked={ldap.value}
            disabled={ldap.pending}
            onChange={(checked) => ldap.save(checked)}
          />
        }
      />
      <SettingsCard title="Profile" saveStatus={profile.status}>
        <Field label="Name" description="Saves when you leave the field or press Enter.">
          <Input
            value={profile.value}
            disabled={profile.pending}
            onChange={(event) => profile.edit(event.target.value)}
            onBlur={() => profile.save()}
            onKeyDown={(event) => {
              if (event.key === "Enter") profile.save();
              if (event.key === "Escape") profile.reset();
            }}
          />
        </Field>
      </SettingsCard>
      <SettingsCard
        title="AI features"
        saveStatus={ai.status}
        hint={aiEnabled ? undefined : "AI features are off for this organization."}
        actions={
          <Button variant="outline" size="sm" onClick={() => setAiEnabled((enabled) => !enabled)}>
            {aiEnabled ? "Turn off" : "Turn on"}
          </Button>
        }
      >
        <Field label="Model">
          <Select
            value={ai.value}
            disabled={ai.pending || !aiEnabled}
            onChange={(next) => ai.save(next)}
            options={[
              { value: "claude-sonnet", label: "Claude Sonnet" },
              { value: "claude-opus", label: "Claude Opus" }
            ]}
          />
        </Field>
      </SettingsCard>
      <SettingsCard title="Secret events" saveStatus={events.status}>
        <Switch
          layout="row"
          label="Record secret reads"
          description="This example always fails, so the switch goes back and a toast explains."
          checked={events.value}
          disabled={events.pending}
          onChange={(checked) => events.save(checked)}
        />
      </SettingsCard>
    </div>
  );
}

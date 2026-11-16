import { useState } from "react";

import { Button } from "@infisical/cipher/ui/button";
import { Field } from "@infisical/cipher/ui/field";
import { Input } from "@infisical/cipher/ui/input";
import { MultiStep, type MultiStepStep } from "@infisical/cipher/ui/multi-step";
import { toast } from "@infisical/cipher/ui/sonner";
import { Textarea } from "@infisical/cipher/ui/textarea";

const useReminderSteps = (twoSteps: boolean): MultiStepStep[] => {
  const [days, setDays] = useState("30");
  const [message, setMessage] = useState("Rotate the Stripe key before the quarter closes.");
  const schedule: MultiStepStep = {
    title: "Schedule",
    heading: "Remind every",
    validate: () => (Number(days) > 0 ? true : { fields: { days: "Enter a number of days." } }),
    content: (
      <Field label="Days" name="days">
        <Input inputMode="numeric" value={days} onChange={(event) => setDays(event.target.value)} />
      </Field>
    )
  };
  const note: MultiStepStep = {
    title: "Message",
    heading: "Reminder message",
    content: (
      <Field label="Message" optional>
        <Textarea value={message} onChange={(event) => setMessage(event.target.value)} rows={3} />
      </Field>
    )
  };
  return twoSteps
    ? [schedule, note]
    : [
        {
          ...schedule,
          heading: "Reminder",
          content: (
            <>
              {schedule.content}
              {note.content}
            </>
          )
        }
      ];
};

const deleteAction = (
  <Button variant="danger-ghost" size="sm" onClick={() => toast("Reminder deleted.")}>
    Delete
  </Button>
);

const ReminderSheet = ({ label, fails }: { label: string; fails?: boolean }) => (
  <MultiStep
    variant="sheet"
    title="Edit reminder"
    trigger={<Button variant="outline">{label}</Button>}
    steps={useReminderSteps(false)}
    completeLabel="Save"
    footerStart={deleteAction}
    onComplete={async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      if (fails) return { message: "The reminder service is unavailable." };
      toast("Reminder saved.");
    }}
  />
);

const ReminderDialog = () => (
  <MultiStep
    variant="dialog"
    title="Edit reminder"
    trigger={<Button variant="outline">Edit in two steps</Button>}
    steps={useReminderSteps(true)}
    completeLabel="Save"
    footerStart={deleteAction}
    onComplete={() => {
      toast("Reminder saved.");
    }}
  />
);

export default function Example() {
  return (
    <div className="flex flex-wrap gap-3">
      <ReminderSheet label="Edit reminder" />
      <ReminderSheet label="Save fails" fails />
      <ReminderDialog />
    </div>
  );
}

import { Identity } from "@infisical/cipher/ui/avatar";

export default function Example() {
  return (
    <div className="flex w-full min-w-0 flex-col items-start gap-6">
      <Identity name="Alex Kim" description="Workspace administrator" />
      <Identity name="deploy-production" kind="machine" />
      <Identity name="rotation-agent" kind="agent" description="Read access to staging" />
    </div>
  );
}

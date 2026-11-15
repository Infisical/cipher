import { Field } from "@infisical/cipher/ui/field";
import { Select, type SelectOption } from "@infisical/cipher/ui/select";

const single: SelectOption[] = [{ value: "dev", label: "Development" }];
const typical: SelectOption[] = [
  { value: "dev", label: "Development", description: "138 secrets" },
  { value: "staging", label: "Staging", description: "96 secrets" },
  { value: "prod", label: "Production", description: "212 secrets" }
];
const regions = ["us-east-1", "us-west-2", "eu-central-1", "eu-west-1", "ap-southeast-2"];
const services = [
  "payments-ledger-reconciliation-worker",
  "customer-identity-federation-gateway",
  "observability-metrics-ingestion-pipeline",
  "kubernetes-operator-secret-sync-controller",
  "legacy-billing-monolith-database-migration-runner",
  "internal-developer-portal-preview-environments"
];
const stressed: SelectOption[] = regions.flatMap((region) =>
  services.map((service, index) => ({
    value: `${service}-${region}`,
    label: `${service} / production / ${region} / primary-postgres-read-replica-connection-string`,
    description: index === 0 ? "2,481 secrets" : undefined,
    group: region
  }))
);
const longValue = stressed[0]!.value;

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,15rem),1fr))] items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Field label="Environment">
            <Select options={single} placeholder="Choose an environment" />
          </Field>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"One option"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Field label="Environment">
            <Select options={typical} defaultValue="prod" />
          </Field>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Labels that fit"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Field label="Connection">
            <Select options={stressed} defaultValue={longValue} />
          </Field>
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"Truncated, full label on hover"}
        </figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Field label="Connection">
            <Select options={stressed} defaultValue={longValue} wrap />
          </Field>
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"Wrapped in the list, one line in the trigger"}
        </figcaption>
      </figure>
    </div>
  );
}

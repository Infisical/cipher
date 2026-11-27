import { Button } from "@infisical/cipher/ui/button";
import { PageHeader } from "@infisical/cipher/ui/page-header";

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-1 items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <PageHeader scope={{ label: "Acme", icon: "building" }} title="Networking" />
        <figcaption className="text-muted-foreground text-xs">
          {"Organization scope, title only"}
        </figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <PageHeader
          scope={{ label: "Acme / Platform", icon: "layers" }}
          title="Networking"
          description="Gateways and relays that connect Infisical to your infrastructure."
          actions={
            <Button variant="accent" icon="plus">
              Deploy gateway
            </Button>
          }
        />
        <figcaption className="text-muted-foreground text-xs">
          {"Sub-organization scope"}
        </figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <PageHeader
          breadcrumb={[{ label: "Gateways", href: "#page-header" }]}
          scope={{
            label:
              "Acme Corporation International / Payments Infrastructure and Settlement Engineering",
            icon: "layers"
          }}
          title="payments-settlement-gateway-eu-west-production"
          actions={
            <Button variant="outline" icon="more">
              Options
            </Button>
          }
        />
        <figcaption className="text-muted-foreground text-xs">
          {"Long names: the scope stays on one line and truncates, the title wraps"}
        </figcaption>
      </figure>
      <figure className="m-0 flex w-full max-w-[390px] min-w-0 flex-col gap-3">
        <PageHeader
          scope={{
            label:
              "Acme Corporation International / Payments Infrastructure and Settlement Engineering",
            icon: "layers"
          }}
          title="payments-settlement-gateway-eu-west-production"
          description="Gateways and relays that connect Infisical to your infrastructure."
          actions={
            <Button variant="accent" icon="plus">
              Deploy gateway
            </Button>
          }
        />
        <figcaption className="text-muted-foreground text-xs">
          {"At 390px the scope truncates first and the title keeps two lines"}
        </figcaption>
      </figure>
    </div>
  );
}

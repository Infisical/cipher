import { useState } from "react";

import { Breadcrumb } from "@infisical/cipher/ui/breadcrumb";

export default function Example() {
  const [org, setOrg] = useState("acme");
  const [project, setProject] = useState("payments");
  const [environment, setEnvironment] = useState("prod");
  return (
    <div className="grid w-full min-w-0 grid-cols-1 items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-start gap-3">
          <Breadcrumb
            aria-label="Example path"
            maxItems={3}
            items={[
              { label: "Projects", href: "#breadcrumb" },
              { label: "Payments", href: "#breadcrumb" },
              { label: "Production", href: "#breadcrumb" },
              { label: "Services", href: "#breadcrumb" },
              { label: "Deployment token" }
            ]}
          />
        </div>
        <figcaption className="text-muted-foreground text-xs">{"default"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-start gap-3">
          <Breadcrumb
            aria-label="Product navigation example"
            variant="product"
            items={[
              {
                label: org === "acme" ? "Acme Corp" : "Globex",
                link: { href: "/design-system/components/navigation/breadcrumb" },
                switcher: {
                  label: "Switch organization",
                  value: org,
                  options: [
                    { value: "acme", label: "Acme Corp" },
                    { value: "globex", label: "Globex" }
                  ],
                  onChange: setOrg,
                  actions: [
                    {
                      label: "Organization settings",
                      link: { href: "/design-system/components/navigation/top-bar" }
                    }
                  ]
                }
              },
              { label: "Secrets Management" },
              {
                label: project,
                href: "#breadcrumb",
                switcher: {
                  label: "Switch project",
                  value: project,
                  options: [
                    { value: "payments", label: "payments" },
                    { value: "platform", label: "platform" }
                  ],
                  onChange: setProject
                }
              },
              {
                label: environment === "prod" ? "Production" : "Staging",
                switcher: {
                  label: "Switch environment",
                  value: environment,
                  options: [
                    { value: "staging", label: "Staging" },
                    { value: "prod", label: "Production" }
                  ],
                  onChange: setEnvironment
                }
              },
              { label: "Secrets" }
            ]}
          />
        </div>
        <figcaption className="text-muted-foreground text-xs">{"product"}</figcaption>
      </figure>
    </div>
  );
}

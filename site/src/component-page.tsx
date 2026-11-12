import { type ComponentType, lazy, Suspense } from "react";
import { Loader } from "@infisical/cipher/ui/loader";
import { PageHeader } from "@infisical/cipher/ui/page-header";

import type catalog from "./catalog.json";

import styles from "./preview.module.css";

const modules = import.meta.glob<{ default: ComponentType }>("./examples/**/*.tsx");
const examples = new Map(
  Object.entries(modules).map(([file, load]) => [
    file.slice("./examples/".length, -".tsx".length),
    lazy(load)
  ])
);

export function ComponentPage({ component }: { component: (typeof catalog)[number] }) {
  return (
    <>
      <PageHeader title={component.title} description={component.summary} />
      {component.examples.map((example) => {
        const Example = examples.get(example.module);
        if (!Example) return null;
        return (
          <section key={example.module} className="mt-10">
            <h2 className="mb-3 text-sm font-medium">{example.title}</h2>
            <div className={styles.frame}>
              <Suspense fallback={<Loader label="Loading example" />}>
                <Example />
              </Suspense>
            </div>
          </section>
        );
      })}
    </>
  );
}

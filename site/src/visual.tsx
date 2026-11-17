import { Component, type ComponentType, lazy, type ReactNode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { toTheme } from "@infisical/cipher/lib/theme-registry";
import { CipherScope } from "@infisical/cipher/scope";
import { TooltipProvider } from "@infisical/cipher/ui/tooltip";

import catalog from "./catalog.json";

import styles from "./preview.module.css";

import "./index.css";

const modules = import.meta.glob<{ default: ComponentType }>("./examples/**/*.tsx");
const params = new URLSearchParams(window.location.search);
const page = catalog.find((entry) => entry.id === params.get("page"));
const theme = toTheme(params.get("theme")) ?? "light";

class Boundary extends Component<{ children: ReactNode }, { error?: Error }> {
  state: { error?: Error } = {};
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  render() {
    if (this.state.error) return <pre data-visual-error="">{String(this.state.error.message)}</pre>;
    return this.props.children;
  }
}

function Visual() {
  return (
    <CipherScope theme={theme} className="min-h-dvh">
      <TooltipProvider>
        <main className="p-6">
          {page?.examples.map((example) => {
            const load = modules[`./examples/${example.module}.tsx`];
            if (!load) return null;
            const Example = lazy(load);
            return (
              <section key={example.module} data-example={example.module} className="mt-10">
                <h2 className="mb-3 text-sm font-medium">{example.title}</h2>
                <div className={styles.frame}>
                  <Boundary>
                    <Suspense fallback={<span data-visual-loading="" />}>
                      <Example />
                    </Suspense>
                  </Boundary>
                </div>
              </section>
            );
          })}
        </main>
      </TooltipProvider>
    </CipherScope>
  );
}

createRoot(document.getElementById("root")!).render(<Visual />);

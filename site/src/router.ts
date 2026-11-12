import { useSyncExternalStore } from "react";

const subscribe = (onChange: () => void) => {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
};

export const useRoute = () =>
  useSyncExternalStore(subscribe, () => window.location.hash.slice(1) || "/color");

export const href = (route: string) => `#${route}`;

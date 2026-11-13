/** Storage keys the boot theme reads: the shared light, dark or system preference, the named theme per scheme, and a session preview. */
export type ThemeStorageKeys = { shared: string; preferred: string; override: string };

export const themeStorage: ThemeStorageKeys = {
  shared: "cipher-scheme",
  preferred: "cipher-theme",
  override: "cipher-theme-override"
};

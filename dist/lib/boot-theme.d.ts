import { type ThemeStorageKeys, themeStorage } from "./boot-theme-keys";
export { type ThemeStorageKeys, themeStorage };
/**
 * The theme from storage alone, for UI that renders before CipherScope and the React theme
 * provider: a ?theme= or session preview when `allowPreview` is set, else the person's named theme
 * for the scheme their shared preference resolves to. With no stored preference it follows the OS
 * scheme. A single key is read as the shared light, dark or system preference.
 */
export declare const readBootTheme: ({ keys: keysOption, allowPreview, search }?: {
    keys?: ThemeStorageKeys | string;
    allowPreview?: boolean;
    search?: string;
}) => string;

declare const process: { env: { NODE_ENV?: string } };

/** True outside production builds. Bundlers replace process.env.NODE_ENV, so this needs no Vite types. */
export const isDev = process.env.NODE_ENV !== "production";

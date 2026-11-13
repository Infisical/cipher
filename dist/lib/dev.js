// src/lib/dev.ts
/** True outside production builds. Bundlers replace process.env.NODE_ENV, so this needs no Vite types. */
var isDev = process.env.NODE_ENV !== "production";
export { isDev };

//# sourceMappingURL=dev.js.map
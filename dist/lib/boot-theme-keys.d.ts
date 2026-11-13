/** Storage keys the app theme reads: the shared light, dark or system preference, the named theme per scheme, and a demo preview. */
export declare const v4ThemeStorage: {
    readonly shared: "infisical-theme";
    readonly preferred: "v4-theme";
    readonly override: "v4-theme-override";
};
/** A live org route: /v4/organizations/<id> with an id other than the demo org. */
export declare const v4LiveOrgPath: RegExp;

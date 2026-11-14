import { isDev } from "./dev.js";
import * as React from "react";
import { jsx } from "react/jsx-runtime";
// src/lib/frame-context.tsx
var FrameContext = React.createContext(false);
/** Marks a subtree as inside a framed container, or, with framed false, starts a fresh surface such as an overlay. */
function FrameScope({ framed, children }) {
	return /* @__PURE__ */ jsx(FrameContext, {
		value: framed,
		children
	});
}
/**
* Whether this primitive renders inside a framed container, where it drops its own frame so two frames never nest.
* Pass the variant the caller asked for to warn in development when an explicit framed variant is dropped.
*/
function useInFrame(component, requested) {
	const inFrame = React.useContext(FrameContext);
	const forced = inFrame && requested === "framed";
	React.useEffect(() => {
		if (isDev && forced) console.warn(`${component} variant="framed" renders inside another framed container, so it drops to its frameless treatment. Remove the variant.`);
	}, [component, forced]);
	return inFrame;
}
export { FrameScope, useInFrame };

//# sourceMappingURL=frame-context.js.map
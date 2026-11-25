import { isDev } from "./dev.js";
import * as React from "react";
import { jsx } from "react/jsx-runtime";
// src/lib/frame-context.tsx
var FrameContext = React.createContext(false);
var FrameFootContext = React.createContext(null);
/** Marks a subtree as inside a framed container, or, with framed false, starts a fresh surface such as an overlay. */
function FrameScope({ framed, children }) {
	return /* @__PURE__ */ jsx(FrameContext, {
		value: framed,
		children: framed ? children : /* @__PURE__ */ jsx(FrameFootContext, {
			value: null,
			children
		})
	});
}
/** Offers a frame's empty footer band to one descendant: the first to claim it owns it and portals its footer into target until it releases it. */
function FrameFootSlot({ value, children }) {
	return /* @__PURE__ */ jsx(FrameFootContext, {
		value,
		children
	});
}
function useFrameFoot() {
	return React.useContext(FrameFootContext);
}
/**
* Whether this primitive renders inside a framed container, where it drops its own frame so two frames never nest.
* Pass the variant the caller asked for to warn in development when an explicit framed variant is dropped.
*/
function useInFrame(component, requested) {
	const inFrame = React.useContext(FrameContext);
	const forced = inFrame && requested === "framed";
	React.useEffect(() => {
		if (isDev && forced) console.warn(`${component} variant="framed" renders inside another framed container, so it drops to its frameless treatment. Remove the variant, and use Inset for a block inside a frame: tinted, with no border.`);
	}, [component, forced]);
	return inFrame;
}
export { FrameFootSlot, FrameScope, useFrameFoot, useInFrame };

//# sourceMappingURL=frame-context.js.map
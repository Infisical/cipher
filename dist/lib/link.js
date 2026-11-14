import * as React from "react";
import { jsx } from "react/jsx-runtime";
// src/lib/link.tsx
var PlainLink = ({ link, ref, children, ...props }) => /* @__PURE__ */ jsx("a", {
	ref,
	href: link.href,
	...props,
	children
});
var noMatch = () => void 0;
var CipherRouterContext = React.createContext({
	Link: PlainLink,
	useLinkMatch: () => noMatch
});
/** Wires the app's router into Cipher once, at the root; without it links render plain anchors. */
function CipherRouterProvider({ router, children }) {
	return /* @__PURE__ */ jsx(CipherRouterContext, {
		value: router,
		children
	});
}
function CipherLink(props) {
	const { Link } = React.use(CipherRouterContext);
	return /* @__PURE__ */ jsx(Link, { ...props });
}
var useCipherLinkMatch = () => React.use(CipherRouterContext).useLinkMatch();
export { CipherLink, CipherRouterProvider, useCipherLinkMatch };

//# sourceMappingURL=link.js.map
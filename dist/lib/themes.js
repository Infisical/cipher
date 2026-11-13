// src/lib/themes.ts
var legacyThemes = {
	peach: "light",
	pale: "light",
	"dark-alt": "dark"
};
/** The theme and every theme it extends, nearest first, plus the base column the chain ends on. */
var themeChain = (themes, id) => {
	const chain = [];
	let current = themes.find((theme) => theme.id === id);
	while (current) {
		if (chain.includes(current)) throw new Error(`Theme ${id} extends itself`);
		chain.push(current);
		if (current.base) return {
			chain,
			base: current.base
		};
		const parent = current.extends;
		current = themes.find((theme) => theme.id === parent);
		if (!current) throw new Error(`Theme ${chain[chain.length - 1].id} extends unknown theme ${parent}`);
	}
	throw new Error(`Unknown theme ${id}`);
};
/** A themed token's raw value in a theme: the nearest override, then the base column. */
var themedValue = (themes, id, name, value) => {
	const { chain, base } = themeChain(themes, id);
	return chain.find((theme) => name in theme.overrides)?.overrides[name] ?? value[base] ?? value.light;
};
export { legacyThemes, themeChain, themedValue };

//# sourceMappingURL=themes.js.map
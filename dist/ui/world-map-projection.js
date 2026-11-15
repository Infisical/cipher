// src/ui/world-map-projection.ts
var A1 = 1.340264;
var A2 = -.081106;
var A3 = 893e-6;
var A4 = .003796;
var M = Math.sqrt(3) / 2;
var radians = Math.PI / 180;
/** Equal Earth (Savric, Patterson and Jenny, 2018) in unit space, so equal areas stay equal on the map. */
function equalEarth(lng, lat) {
	const theta = Math.asin(M * Math.sin(lat * radians));
	const t2 = theta * theta;
	const t6 = t2 * t2 * t2;
	return [lng * radians * Math.cos(theta) / (M * (A1 + 3 * A2 * t2 + t6 * (7 * A3 + 9 * A4 * t2))), theta * (A1 + A2 * t2 + t6 * (A3 + A4 * t2))];
}
export { equalEarth };

//# sourceMappingURL=world-map-projection.js.map
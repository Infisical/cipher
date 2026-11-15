const A1 = 1.340264;
const A2 = -0.081106;
const A3 = 0.000893;
const A4 = 0.003796;
const M = Math.sqrt(3) / 2;
const radians = Math.PI / 180;

/** Equal Earth (Savric, Patterson and Jenny, 2018) in unit space, so equal areas stay equal on the map. */
export function equalEarth(lng: number, lat: number): [number, number] {
  const theta = Math.asin(M * Math.sin(lat * radians));
  const t2 = theta * theta;
  const t6 = t2 * t2 * t2;
  return [
    (lng * radians * Math.cos(theta)) / (M * (A1 + 3 * A2 * t2 + t6 * (7 * A3 + 9 * A4 * t2))),
    theta * (A1 + A2 * t2 + t6 * (A3 + A4 * t2))
  ];
}

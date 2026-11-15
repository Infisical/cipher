import { Card } from "@infisical/cipher/ui/card";
import { WorldMap, type WorldMapLocation } from "@infisical/cipher/ui/world-map";

const cities: [string, string, number, number][] = [
  ["Ashburn, Virginia, United States of America", "US", 39.04, -77.49],
  ["Council Bluffs, Iowa, United States of America", "US", 41.26, -95.86],
  ["The Dalles, Oregon, United States of America", "US", 45.6, -121.18],
  ["Montreal, Quebec, Canada", "CA", 45.5, -73.57],
  ["Vancouver, British Columbia, Canada", "CA", 49.28, -123.12],
  ["Mexico City, Mexico", "MX", 19.43, -99.13],
  ["Bogota, Colombia", "CO", 4.71, -74.07],
  ["Santiago, Chile", "CL", -33.45, -70.67],
  ["Buenos Aires, Argentina", "AR", -34.6, -58.38],
  ["Sao Paulo, Brazil", "BR", -23.55, -46.63],
  ["Dublin, Ireland", "IE", 53.35, -6.26],
  ["London, United Kingdom", "GB", 51.51, -0.13],
  ["Paris, France", "FR", 48.86, 2.35],
  ["Amsterdam, Netherlands", "NL", 52.37, 4.9],
  ["Frankfurt am Main, Hesse, Germany", "DE", 50.11, 8.68],
  ["Zurich, Switzerland", "CH", 47.38, 8.54],
  ["Milan, Italy", "IT", 45.46, 9.19],
  ["Madrid, Spain", "ES", 40.42, -3.7],
  ["Stockholm, Sweden", "SE", 59.33, 18.07],
  ["Warsaw, Poland", "PL", 52.23, 21.01],
  ["Helsinki, Finland", "FI", 60.17, 24.94],
  ["Istanbul, Turkey", "TR", 41.01, 28.98],
  ["Tel Aviv, Israel", "IL", 32.09, 34.78],
  ["Dubai, United Arab Emirates", "AE", 25.2, 55.27],
  ["Johannesburg, South Africa", "ZA", -26.2, 28.05],
  ["Lagos, Nigeria", "NG", 6.52, 3.38],
  ["Nairobi, Kenya", "KE", -1.29, 36.82],
  ["Mumbai, Maharashtra, India", "IN", 19.08, 72.88],
  ["Bengaluru, Karnataka, India", "IN", 12.97, 77.59],
  ["Singapore", "SG", 1.35, 103.82],
  ["Jakarta, Indonesia", "ID", -6.21, 106.85],
  ["Hong Kong", "HK", 22.32, 114.17],
  ["Taipei, Taiwan", "TW", 25.03, 121.57],
  ["Seoul, South Korea", "KR", 37.57, 126.98],
  ["Tokyo, Japan", "JP", 35.68, 139.69],
  ["Osaka, Japan", "JP", 34.69, 135.5],
  ["Sydney, New South Wales, Australia", "AU", -33.87, 151.21],
  ["Melbourne, Victoria, Australia", "AU", -37.81, 144.96],
  ["Auckland, New Zealand", "NZ", -36.85, 174.76],
  ["Reykjavik, Iceland", "IS", 64.15, -21.94]
];
const locations: WorldMapLocation[] = [
  ...cities.map(([label, country, lat, lng], index) => ({
    label,
    country,
    lat,
    lng,
    count: Math.round(4_812_330 / (index + 1) ** 1.4)
  })),
  { label: "Local network (localhost, Docker and private IP ranges)", count: 287_114 }
];

export default function Example() {
  return (
    <Card title="Secret access locations" className="w-full">
      <WorldMap label="Secret access locations" locations={locations} />
    </Card>
  );
}

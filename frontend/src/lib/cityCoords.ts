export const CITY_COORDS: Record<string, [number, number]> = {
  "Tiranë": [41.3275, 19.8189],
  "Durrës": [41.3231, 19.4413],
  "Vlorë": [40.4675, 19.4889],
  "Elbasan": [41.1125, 20.0822],
  "Shkodër": [42.0683, 19.5126],
  "Fier": [40.7239, 19.5567],
  "Korçë": [40.6186, 20.7808],
  "Berat": [40.7058, 19.9522],
  "Sarandë": [39.8754, 20.0050],
  "Lezhë": [41.7811, 19.6442],
  "Pogradec": [40.9027, 20.6531],
  "Kavajë": [41.1864, 19.5567],
  "Lushnjë": [40.9419, 19.7050],
  "Kukës": [42.0769, 20.4218],
  "Krujë": [41.5092, 19.7931],
  "Gjirokastër": [40.0717, 20.1389],
  "Patos": [40.6831, 19.6253],
  "Kuçovë": [40.8014, 19.9111],
};

export const ALBANIA_CENTER: [number, number] = [41.1533, 20.1683];

export function coordsForCity(city: string | undefined): [number, number] | null {
  if (!city) return null;
  return CITY_COORDS[city] ?? null;
}

export interface LatLng {
  lat: number
  lng: number
}

/** Distancia geodésica en kilómetros (fórmula del semiverseno). */
export function haversineKm(a: LatLng, b: LatLng): number {
  const R = 6371
  const rad = (value: number) => (value * Math.PI) / 180
  const dLat = rad(b.lat - a.lat)
  const dLng = rad(b.lng - a.lng)
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2
  return Math.max(1, Math.round(2 * R * Math.asin(Math.min(1, Math.sqrt(h)))))
}

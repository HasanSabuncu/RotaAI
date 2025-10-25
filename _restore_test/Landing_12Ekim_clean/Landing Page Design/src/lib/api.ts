import type { PlaceListItem, PlaceDetail } from '../components/types/places';

const BASE = import.meta.env.VITE_API_BASE ?? '';

export async function fetchMuseums(lat?: number, lng?: number): Promise<PlaceListItem[]> {
  const qs = new URLSearchParams();
  if (lat != null && lng != null) { qs.set('lat', String(lat)); qs.set('lng', String(lng)); }
  const res = await fetch(`${BASE}/api/museums?${qs.toString()}`);
  if (!res.ok) throw new Error('Museums fetch failed');
  return res.json();
}

export async function fetchPlace(placeId: string): Promise<PlaceDetail> {
  const res = await fetch(`${BASE}/api/places/${placeId}`);
  if (!res.ok) throw new Error('Place fetch failed');
  return res.json();
}

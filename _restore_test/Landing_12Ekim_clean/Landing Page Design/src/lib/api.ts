import type { PlaceListItem, PlaceDetail } from '../components/types/places';

// Sabit backend kökü
export const API_BASE = 'http://localhost:5191';

// /api ile başlayan göreli URL'leri kökle
export const toApiUrl = (url?: string) =>
  url && url.startsWith('/api/') ? `${API_BASE}${url}` : url || '';

export async function fetchMuseums(lat?: number, lng?: number): Promise<PlaceListItem[]> {
  const qs = new URLSearchParams();
  if (lat != null && lng != null) {
    qs.set('lat', String(lat));
    qs.set('lng', String(lng));
  }
  const res = await fetch(`${API_BASE}/api/museums?${qs.toString()}`);
  if (!res.ok) throw new Error('Museums fetch failed');
  return res.json();
}

export async function fetchPlace(placeId: string): Promise<PlaceDetail> {
  const res = await fetch(`${API_BASE}/api/places/${encodeURIComponent(placeId)}`);
  if (!res.ok) throw new Error('Place fetch failed');
  return res.json();
}

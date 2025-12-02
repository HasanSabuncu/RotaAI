// frontend/src/lib/api.ts
import type { PlaceListItem, PlaceDetail } from '../components/types/places';

// Sabit backend kökü
export const API_BASE = 'http://localhost:5191';

// /api ile başlayan göreli URL'leri kökle
export const toApiUrl = (url?: string) =>
  url && url.startsWith('/api/') ? `${API_BASE}${url}` : url || '';

// ========= YERLER ==========

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

// ========= PLAN (GPT ROTASI) ==========

// Backend PlanRequestDto ile hizalı
export interface GeneratePlanRequest {
  startLat?: number;
  startLng?: number;
  durationHours: number;
  interests: string[]; // ['history','nature',...]
  intensity: 'relaxed' | 'moderate' | 'intensive';
  language: 'TR' | 'EN';
  date?: string; // ISO string (2025-12-01T00:00:00Z gibi)
  region?: 'nearby' | 'city';
}

// Backend PlanStopDto ile hizalı
export interface PlanStopDto {
  order: number;
  time: string;

  placeId: string;
  placeNameTr: string;
  placeNameEn: string;

  durationTr: string;
  durationEn: string;

  descriptionTr: string;
  descriptionEn: string;

  notesTr?: string | null;
  notesEn?: string | null;

  category: string;
  lat?: number | null;
  lng?: number | null;
}

// Backend PlanResponseDto ile hizalı
export interface PlanResponseDto {
  totalDurationMinutes: number;
  summaryTr: string;
  summaryEn: string;
  stops: PlanStopDto[];
}

// /api/plan çağrısı
export async function generatePlan(
  payload: GeneratePlanRequest
): Promise<PlanResponseDto> {
  const res = await fetch(`${API_BASE}/api/plan`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    console.error('generatePlan error', res.status, text);
    throw new Error('Plan generate failed');
  }

  return res.json();
}

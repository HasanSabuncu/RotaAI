// Liste kartları için
export interface PlaceListItem {
  placeId: string;
  nameTr: string;
  nameEn: string;
  category: 'historical' | 'art' | 'nature' | 'gastronomy' | 'family' | 'romantic';
  rating: number;
  distanceKm: number;
  imageUrl: string;
  durationTr: string;
  durationEn: string;
}

// Detay sayfası için
export interface PlaceDetail {
  placeId: string;
  name: string;
  rating: number;
  userRatingsTotal: number;
  formattedAddress: string;
  lat: number;
  lng: number;
  openingNow?: boolean | null;
  weekdayText?: string[] | null;
  phone?: string | null;
  website?: string | null;
  editorialSummary?: string | null;
  photoUrl: string;
  city: string;
  district: string;
  mainCategory: string;
}

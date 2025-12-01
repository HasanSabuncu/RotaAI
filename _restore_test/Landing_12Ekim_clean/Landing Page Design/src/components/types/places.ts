// Liste kartları için
export interface PlaceListItem {
  placeId: string;
  nameTr: string;
  nameEn: string;
  category: 'historical' | 'art' | 'nature' | 'gastronomy' | 'family' | 'romantic' | string;
  rating: number;
  distanceKm: number;
  imageUrl: string;
  durationTr: string;
  durationEn: string;
}

// Yorum tipi (backend ile birebir)
export interface PlaceReview {
  authorName?: string | null;
  rating: number;
  relativeTime?: string | null;
  text?: string | null;
  profilePhotoUrl?: string | null;
}

// Detay sayfası için (backend PlaceDetailDto ile hizalı)
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

  // HAKKINDA
  descriptionTr?: string | null;
  descriptionEn?: string | null;

  photoUrl: string;
  city: string;
  district: string;
  mainCategory: string;

  // İlk 3 yorum
  reviews?: PlaceReview[] | null;
}

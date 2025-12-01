import { useEffect, useState } from 'react';
import { MapPin, Star, Clock, Phone, Calendar, Share2, Heart, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';
import { ImageWithFallback } from './figma/ImageWithFallback';

import { fetchPlace, toApiUrl } from '../lib/api';
import type { PlaceDetail } from './types/places';

interface PlaceDetailPageProps {
  language: 'TR' | 'EN';
  onNavigate: (page: string) => void;
  // Discover'dan yalnızca placeId gelecek; eski tam obje gelirse de tolere ediyoruz
  placeData?: { placeId?: string; PlaceId?: string; id?: string; displayName?: string; imageUrl?: string } | any;
}

const FALLBACK_IMG =
  'https://images.unsplash.com/photo-1520975693411-58bbaafe21d9?q=80&w=1600&auto=format&fit=crop';

export function PlaceDetailPage({ language, onNavigate, placeData }: PlaceDetailPageProps) {
  const [data, setData] = useState<PlaceDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = placeData?.placeId ?? placeData?.PlaceId ?? placeData?.id;
    if (!id) {
      setLoading(false);
      return;
    }

    fetchPlace(id)
      .then((res) => setData(res))
      .finally(() => setLoading(false));
  }, [placeData]);

  const translations = {
    TR: {
      addToRoute: 'Rotama Ekle',
      createPlan: 'Benim İçin Plan Oluştur',
      share: 'Paylaş',
      about: 'Hakkında',
      contact: 'İletişim',
      aiSummary: 'AI Özeti',
      reviews: 'Kullanıcı Yorumları',
      allReviews: 'Tüm Yorumlar',
      phone: 'Telefon',
      openNow: 'Şimdi Açık',
      closedNow: 'Şimdi Kapalı',
      historical: 'Tarihi',
      reviewsCount: (n: number) => `(${n} değerlendirme)`,
      durationFallback: '2 saat',
      map: 'Harita',
      loading: 'Yükleniyor…',
      noPhone: '-',
      noReviews: 'Yorumlar yakında.',
      noAbout: 'Bu yer hakkında ayrıntılı bilgi yakında eklenecek.',
      mapNotAvailable: 'Harita konumu bulunamadı.'
    },
    EN: {
      addToRoute: 'Add to Route',
      createPlan: 'Create Plan for Me',
      share: 'Share',
      about: 'About',
      contact: 'Contact',
      aiSummary: 'AI Summary',
      reviews: 'User Reviews',
      allReviews: 'All Reviews',
      phone: 'Phone',
      openNow: 'Open Now',
      closedNow: 'Closed Now',
      historical: 'Historical',
      reviewsCount: (n: number) => `(${n} reviews)`,
      durationFallback: '2 hours',
      map: 'Map',
      loading: 'Loading…',
      noPhone: '-',
      noReviews: 'Reviews coming soon.',
      noAbout: 'Detailed information about this place will be added soon.',
      mapNotAvailable: 'Map location is not available.'
    }
  };
  const t = translations[language];

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">{t.loading}</div>;
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            {language === 'TR' ? 'Yer detayı bulunamadı.' : 'Place details not found.'}
          </p>
          <Button variant="outline" onClick={() => onNavigate('discover')}>
            {language === 'TR' ? 'Keşfe Dön' : 'Back to Discover'}
          </Button>
        </div>
      </div>
    );
  }

  // İsim ve süre (detay API tek isim döndürüyor, varsa Discover'dan geleni kullanıyoruz)
  const displayName =
    (language === 'TR' ? (data as any).nameTr : (data as any).nameEn) ??
    data.name ??
    placeData?.displayName ??
    '';

  const durationText =
    language === 'TR'
      ? ((data as any).durationTr ?? t.durationFallback)
      : ((data as any).durationEn ?? t.durationFallback);

  const photoUrl = toApiUrl(data.photoUrl || placeData?.imageUrl) || FALLBACK_IMG;
  const isOpen = typeof data.openingNow === 'boolean' ? data.openingNow : undefined;
  const hoursLine =
    Array.isArray(data.weekdayText) && data.weekdayText.length > 0 ? data.weekdayText[0] : undefined;

  // Google Maps embed (lat/lng varsa)
  const hasCoords = !!data.lat && !!data.lng;
  const googleMapSrc = hasCoords
    ? `https://www.google.com/maps?q=${data.lat},${data.lng}&hl=${
        language === 'TR' ? 'tr' : 'en'
      }&z=16&output=embed`
    : '';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Image */}
      <div className="relative h-96">
        <ImageWithFallback src={photoUrl} alt={displayName} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="container mx-auto">
            <div className="flex items-center gap-3 mb-2">
              <Badge className="bg-white text-gray-900">{t.historical}</Badge>
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span>{(data.rating as any)?.toFixed?.(1) ?? data.rating}</span>
                {!!data.userRatingsTotal && (
                  <span className="text-gray-200">{t.reviewsCount(data.userRatingsTotal)}</span>
                )}
              </div>
            </div>
            <h1 className="text-white mb-2">{displayName}</h1>
            <div className="flex items-center gap-4 text-gray-200">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{data.formattedAddress || '-'}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{durationText}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-white border-b border-gray-200 sticky top-20 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap gap-3">
            <Button className="gap-2" onClick={() => onNavigate('planner')}>
              <Plus className="w-4 h-4" />
              {t.addToRoute}
            </Button>
            <Button variant="outline" className="gap-2" onClick={() => onNavigate('planner')}>
              {t.createPlan}
            </Button>
            <Button variant="outline" size="icon">
              <Heart className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* AI Summary */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Star className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-gray-900 mb-2">{t.aiSummary}</h3>
                    <p className="text-gray-600">
                      {language === 'TR'
                        ? 'Çoğu kullanıcı burayı 2 saatlik bir tur için ideal buldu. Sabah erken saatlerde ziyaret etmeniz kalabalıktan kaçınmak için önerilir. Yakınında birçok restoran ve kafe bulunmaktadır.'
                        : 'Most users found this ideal for a 2-hour tour. Visiting early in the morning is recommended to avoid crowds. There are many restaurants and cafes nearby.'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* About */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-gray-900 mb-4">{t.about}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {language === 'TR' ? data.descriptionTr ?? t.noAbout : data.descriptionEn ?? t.noAbout}
                </p>
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-gray-900">{t.reviews}</h3>
                  {!!data.userRatingsTotal && (
                    <span className="text-sm text-gray-500">{t.reviewsCount(data.userRatingsTotal)}</span>
                  )}
                </div>

                {data.reviews && data.reviews.length > 0 ? (
                  <div className="space-y-6">
                    {data.reviews.map((r, idx) => (
                      <div key={idx} className="flex gap-4">
                        <Avatar className="h-10 w-10">
                          {r.profilePhotoUrl ? (
                            <img
                              src={r.profilePhotoUrl}
                              alt={r.authorName || 'User'}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            <AvatarFallback>
                              {(r.authorName || '?')
                                .split(' ')
                                .map((p) => p[0])
                                .join('')
                                .slice(0, 2)
                                .toUpperCase()}
                            </AvatarFallback>
                          )}
                        </Avatar>

                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-gray-900">
                              {r.authorName || (language === 'TR' ? 'Ziyaretçi' : 'Visitor')}
                            </p>
                            <span className="text-sm text-gray-500">{r.relativeTime || ''}</span>
                          </div>

                          <div className="flex items-center gap-1 mt-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.round(r.rating)
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>

                          {r.text && <p className="text-gray-700 mt-2 leading-relaxed">{r.text}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">{t.noReviews}</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 space-y-6">
              {/* Contact Info */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-gray-900 mb-4">{t.contact}</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-gray-600">{data.phone || t.noPhone}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-gray-600">{data.formattedAddress || '-'}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-gray-600">{hoursLine || '-'}</p>
                        {typeof isOpen === 'boolean' && (
                          <Badge
                            variant="outline"
                            className={`mt-1 ${
                              isOpen ? 'text-green-600 border-green-600' : 'text-red-600 border-red-600'
                            }`}
                          >
                            {isOpen ? t.openNow : t.closedNow}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Map */}
              <Card>
                <CardContent className="p-0">
                  {hasCoords ? (
                    <iframe
                      title="map"
                      src={googleMapSrc}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="w-full h-64 rounded-lg border-0"
                    />
                  ) : (
                    <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500">{t.mapNotAvailable}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

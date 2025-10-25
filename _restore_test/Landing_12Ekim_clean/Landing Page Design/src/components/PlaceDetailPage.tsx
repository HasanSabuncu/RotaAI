import { useEffect, useState } from 'react';
import { MapPin, Star, Clock, Phone, Calendar, Share2, Heart, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';
import { ImageWithFallback } from './figma/ImageWithFallback';

import { fetchPlace } from '../lib/api';
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
    const id =
      placeData?.placeId ??
      placeData?.PlaceId ??
      placeData?.id;

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
      location: 'Konum',
      contact: 'İletişim',
      hours: 'Açılış Saatleri',
      aiSummary: 'AI Özeti',
      reviews: 'Kullanıcı Yorumları',
      allReviews: 'Tüm Yorumlar',
      similarPlaces: 'Benzer Yerler',
      phone: 'Telefon',
      address: 'Adres',
      openNow: 'Şimdi Açık',
      closedNow: 'Şimdi Kapalı',
      historical: 'Tarihi',
      reviewsCount: (n: number) => `(${n} değerlendirme)`,
      durationFallback: '2 saat',
      map: 'Harita',
      loading: 'Yükleniyor…',
      noPhone: '-'
    },
    EN: {
      addToRoute: 'Add to Route',
      createPlan: 'Create Plan for Me',
      share: 'Share',
      about: 'About',
      location: 'Location',
      contact: 'Contact',
      hours: 'Opening Hours',
      aiSummary: 'AI Summary',
      reviews: 'User Reviews',
      allReviews: 'All Reviews',
      similarPlaces: 'Similar Places',
      phone: 'Phone',
      address: 'Address',
      openNow: 'Open Now',
      closedNow: 'Closed Now',
      historical: 'Historical',
      reviewsCount: (n: number) => `(${n} reviews)`,
      durationFallback: '2 hours',
      map: 'Map',
      loading: 'Loading…',
      noPhone: '-'
    }
  };
  const t = translations[language];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        {t.loading}
      </div>
    );
  }

  if (!data) {
    // placeId yoksa veya fetch hata verdiyse basit boş durum
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

  // İsim ve süre: backend TR/EN alanları varsa kullan, yoksa tekil name ve fallback
  const displayName =
    (language === 'TR' ? (data as any).nameTr : (data as any).nameEn) ?? data.name ?? placeData?.displayName ?? '';

  const durationText =
    language === 'TR'
      ? ((data as any).durationTr ?? t.durationFallback)
      : ((data as any).durationEn ?? t.durationFallback);

  const photoUrl = data.photoUrl || placeData?.imageUrl || FALLBACK_IMG;

  // Açık/kapalı
  const isOpen = typeof data.openingNow === 'boolean' ? data.openingNow : undefined;

  // Saat metni (ilk satır)
  const hoursLine =
    Array.isArray((data as any).weekdayText) && (data as any).weekdayText.length > 0
      ? (data as any).weekdayText[0]
      : undefined;

  // Basit sahte yorumlar (tasarım korunuyor)
  const mockReviews = [
    {
      id: 1,
      author: 'Ahmet Y.',
      rating: 5,
      dateTR: '2 gün önce',
      dateEN: '2 days ago',
      commentTR: 'Muhteşem bir deneyimdi! Tarih kokan her köşesi harika.',
      commentEN: 'Amazing experience! Every corner smells of history.'
    },
    {
      id: 2,
      author: 'Sarah M.',
      rating: 4,
      dateTR: '1 hafta önce',
      dateEN: '1 week ago',
      commentTR: 'Kesinlikle görülmesi gereken bir yer. Rehber eşliğinde gezmenizi öneririm.',
      commentEN: 'A must-see place. I recommend touring with a guide.'
    },
    {
      id: 3,
      author: 'Can K.',
      rating: 5,
      dateTR: '2 hafta önce',
      dateEN: '2 weeks ago',
      commentTR: 'Harika mimari ve muhteşem atmosfer. Fotoğraf çekmek için ideal.',
      commentEN: 'Great architecture and amazing atmosphere. Perfect for photography.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Image */}
      <div className="relative h-96">
        <ImageWithFallback
          src={photoUrl}
          alt={displayName}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="container mx-auto">
            <div className="flex items-center gap-3 mb-2">
              <Badge className="bg-white text-gray-900">
                {language === 'TR' ? t.historical : t.historical}
              </Badge>
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span>{data.rating?.toFixed?.(1) ?? data.rating}</span>
                {typeof data.userRatingsTotal === 'number' && (
                  <span className="text-gray-200">
                    {t.reviewsCount(data.userRatingsTotal)}
                  </span>
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
                  {language === 'TR'
                    ? (data.descriptionTr ??
                       'Bu yer hakkında ayrıntılı bilgi yakında eklenecek.')
                    : (data.descriptionEn ??
                       'Detailed information about this place will be added soon.')}
                </p>
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-gray-900">{t.reviews}</h3>
                  <Button variant="link">{t.allReviews}</Button>
                </div>
                <div className="space-y-6">
                  {mockReviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                      <div className="flex items-start gap-3">
                        <Avatar>
                          <AvatarFallback>{review.author[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-gray-900">{review.author}</span>
                            <span className="text-gray-500">
                              {language === 'TR' ? review.dateTR : review.dateEN}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 mb-2">
                            {Array.from({ length: review.rating }).map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                          <p className="text-gray-600">
                            {language === 'TR' ? review.commentTR : review.commentEN}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
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

              {/* Map Placeholder */}
              <Card>
                <CardContent className="p-0">
                  <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">{t.map}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

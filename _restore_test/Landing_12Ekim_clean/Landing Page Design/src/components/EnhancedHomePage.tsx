import { useState, useEffect } from 'react';
import { Search, MapPin, Filter, ChevronDown, SlidersHorizontal, Star } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { Slider } from './ui/slider';
import { AnimatedSection } from './AnimatedSection';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { motion, AnimatePresence } from 'motion/react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Checkbox } from './ui/checkbox';

import { fetchMuseums, toApiUrl } from '../lib/api';
import type { PlaceListItem } from './types/places';

interface EnhancedHomePageProps {
  language: 'TR' | 'EN';
  onNavigate: (page: string, data?: any) => void;
  isAuthenticated: boolean;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

// Şimdilik tek şehir: İzmir
const cities = [
  { id: 'izmir', name: 'İzmir', nameEn: 'Izmir' }
];

// Backend kategorileri ile hizalı kategori listesi
const categories = [
  { id: 'nature', icon: '🏞️', name: 'Doğa', nameEn: 'Nature' },
  { id: 'historical', icon: '🏛️', name: 'Tarihi Yerler', nameEn: 'Historical' },
  { id: 'art', icon: '🎨', name: 'Sanat', nameEn: 'Art' },
  { id: 'relax', icon: '♨️', name: 'Rahatlama / Spa', nameEn: 'Relax / Spa' },
  { id: 'shopping', icon: '🛍️', name: 'Alışveriş', nameEn: 'Shopping' },
  { id: 'gastronomy', icon: '🍽️', name: 'Gastronomi', nameEn: 'Gastronomy' },
  { id: 'family', icon: '👨‍👩‍👧', name: 'Aile', nameEn: 'Family' },
  { id: 'romantic', icon: '💝', name: 'Romantik', nameEn: 'Romantic' },
];

export function EnhancedHomePage({
  language,
  onNavigate,
  isAuthenticated,
  favorites,
  onToggleFavorite
}: EnhancedHomePageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('izmir');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('distance');
  const [distanceRange, setDistanceRange] = useState([2]); // km
  const [showCategories, setShowCategories] = useState(false);

  const [places, setPlaces] = useState<PlaceListItem[]>([]);
  const [loading, setLoading] = useState(true);

  const translations = {
    TR: {
      search: 'Nereye gitmek istiyorsun?',
      selectCity: 'Şehir Seç',
      categories: 'Kategoriler',
      sort: 'Sırala',
      sortOptions: {
        rating: 'En Yüksek Puan',
        distance: 'En Yakın',
        name: 'İsme Göre'
      },
      distance: 'Mesafe',
      km: 'km',
      nearby: 'Yakınınızdaki Yerler',
      viewAll: 'Tümünü Gör',
      loading: 'Yakınınızdaki yerler yükleniyor...',
      locationDenied: 'Konum alınamadı, İzmir merkezi baz alınarak listeleniyor.'
    },
    EN: {
      search: 'Where do you want to go?',
      selectCity: 'Select City',
      categories: 'Categories',
      sort: 'Sort',
      sortOptions: {
        rating: 'Highest Rating',
        distance: 'Nearest',
        name: 'By Name'
      },
      distance: 'Distance',
      km: 'km',
      nearby: 'Places Near You',
      viewAll: 'View All',
      loading: 'Loading nearby places...',
      locationDenied: 'Location not available, using Izmir city center.'
    }
  };

  const t = translations[language];

  // İlk açılışta kullanıcının konumunu alıp backend'e iletiyoruz
  useEffect(() => {
    let cancelled = false;

    // Bornova merkez (Kabaca Küçükpark / Büyükpark çevresi)
    const BORNOVA_CENTER = {
      lat: 38.4622,
      lng: 27.2160,
    };

    const loadPlaces = async (lat?: number, lng?: number) => {
      try {
        const data = await fetchMuseums(lat, lng);
        if (!cancelled) {
          setPlaces(data);
        }
      } catch (e) {
        console.error('fetchMuseums failed', e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude, accuracy } = pos.coords;
          console.log('[RotaAI][Geo][Home] position:', {
            latitude,
            longitude,
            accuracy,
          });

          // HTTP'de/desktop'ta accuracy genelde çok yüksek geliyor (3000m+).
          // 1000m üstü ise pek güvenmeyip Bornova fallback kullanıyoruz.
          const useFallback = !accuracy || accuracy > 1000;

          if (useFallback) {
            console.warn('[RotaAI][Geo][Home] accuracy kötü, Bornova fallback kullanılıyor');
            loadPlaces(BORNOVA_CENTER.lat, BORNOVA_CENTER.lng);
          } else {
            loadPlaces(latitude, longitude);
          }
        },
        (err) => {
          console.warn('[RotaAI][Geo][Home] hata, Bornova fallback kullanılıyor:', err);
          loadPlaces(BORNOVA_CENTER.lat, BORNOVA_CENTER.lng);
        },
        {
          enableHighAccuracy: true,
          timeout: 8000,
          maximumAge: 600000,
        }
      );
    } else {
      console.warn('[RotaAI][Geo][Home] geolocation yok, Bornova fallback kullanılıyor');
      loadPlaces(BORNOVA_CENTER.lat, BORNOVA_CENTER.lng);
    }

    return () => {
      cancelled = true;
    };
  }, []);

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(c => c !== categoryId)
        : [...prev, categoryId]
    );
  };

  const filteredPlaces = places
    .filter(place => {
      // Şimdilik tüm veriler İzmir, city filtresi sadece ileride farklı şehirler için
      if (selectedCity && (place as any).city && (place as any).city.toLowerCase() !== 'izmir') return false;

      if (selectedCategories.length > 0 && !selectedCategories.includes(place.category)) return false;

      if (place.distanceKm > distanceRange[0]) return false;

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          place.nameTr.toLowerCase().includes(query) ||
          place.nameEn.toLowerCase().includes(query)
        );
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'distance') return a.distanceKm - b.distanceKm;
      const aName = language === 'TR' ? a.nameTr : a.nameEn;
      const bName = language === 'TR' ? b.nameTr : b.nameEn;
      return aName.localeCompare(bName);
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 pb-20 md:pb-8">
      <div className="container mx-auto px-4 py-6">
        {/* Search Bar */}
        <AnimatedSection>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
              <Input
                type="text"
                placeholder={t.search}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-6 rounded-2xl glass-morphism shadow-lg border-0 text-base"
              />
            </div>
          </div>
        </AnimatedSection>

        {/* City Selector & Filters */}
        <AnimatedSection delay={0.1}>
          <div className="mb-4 space-y-3">
            {/* City Selector */}
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger className="glass-morphism border-0 rounded-xl">
                  <SelectValue placeholder={t.selectCity} />
                </SelectTrigger>
                <SelectContent>
                  {cities.map(city => (
                    <SelectItem key={city.id} value={city.id}>
                      {language === 'TR' ? city.name : city.nameEn}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Categories & Sort */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowCategories(!showCategories)}
                className="flex-1 glass-morphism border-0 rounded-xl justify-between"
              >
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  <span>{t.categories}</span>
                  {selectedCategories.length > 0 && (
                    <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {selectedCategories.length}
                    </span>
                  )}
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform ${showCategories ? 'rotate-180' : ''}`} />
              </Button>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-36 glass-morphism border-0 rounded-xl">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4" />
                    <span>{t.sort}</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">{t.sortOptions.rating}</SelectItem>
                  <SelectItem value="distance">{t.sortOptions.distance}</SelectItem>
                  <SelectItem value="name">{t.sortOptions.name}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Categories Dropdown */}
            <AnimatePresence>
              {showCategories && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <Card className="glass-morphism border-0">
                    <CardContent className="p-4">
                      <div className="grid grid-cols-2 gap-3">
                        {categories.map(category => (
                          <motion.div
                            key={category.id}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => toggleCategory(category.id)}
                            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                              selectedCategories.includes(category.id)
                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                                : 'bg-white/50 hover:bg-white/80'
                            }`}
                          >
                            <span className="text-2xl">{category.icon}</span>
                            <div className="flex-1">
                              <Checkbox
                                checked={selectedCategories.includes(category.id)}
                                className="sr-only"
                              />
                              <span className="text-sm">
                                {language === 'TR' ? category.name : category.nameEn}
                              </span>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </AnimatedSection>

        {/* Distance Slider */}
        <AnimatedSection delay={0.2}>
          <Card className="glass-morphism border-0 mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-700">
                  {t.distance}: {distanceRange[0]} {t.km}
                </span>
                <span className="text-sm text-gray-500">
                  {filteredPlaces.length} {language === 'TR' ? 'yer' : 'places'}
                </span>
              </div>
              <Slider
                value={distanceRange}
                onValueChange={setDistanceRange}
                max={20}
                min={1}
                step={1}
                className="w-full"
              />
            </CardContent>
          </Card>
        </AnimatedSection>

        {/* Places List */}
        <AnimatedSection delay={0.3}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-gray-900">{t.nearby}</h2>
            <Button
              variant="link"
              onClick={() => onNavigate('discover')}
              className="text-blue-600"
            >
              {t.viewAll}
            </Button>
          </div>

          {loading && (
            <div className="space-y-4">
              <p className="text-gray-500 text-sm">{t.loading}</p>
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 rounded-xl bg-gray-200/60 animate-pulse" />
              ))}
            </div>
          )}

          {!loading && (
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {filteredPlaces.map((place, index) => {
                  const displayName = language === 'TR' ? place.nameTr : place.nameEn;
                  const img = toApiUrl(place.imageUrl);

                  return (
                    <motion.div
                      key={place.placeId}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.03 }}
                      layout
                    >
                      <Card
                        className="glass-morphism border-0 cursor-pointer overflow-hidden"
                        onClick={() =>
                          onNavigate('place-detail', {
                            placeId: place.placeId,
                            displayName,
                            imageUrl: place.imageUrl
                          })
                        }
                      >
                        <CardContent className="p-0">
                          <div className="flex gap-4">
                            <div className="relative w-24 h-24 flex-shrink-0">
                              <ImageWithFallback
                                src={img}
                                alt={displayName}
                                className="w-full h-full object-cover rounded-l-xl"
                              />
                              <motion.button
                                whileTap={{ scale: 0.8 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (!isAuthenticated) {
                                    onNavigate('auth');
                                  } else {
                                    onToggleFavorite(place.placeId);
                                  }
                                }}
                                className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg"
                              >
                                <motion.div
                                  animate={{
                                    scale: favorites.includes(place.placeId) ? [1, 1.2, 1] : 1
                                  }}
                                  transition={{ duration: 0.3 }}
                                >
                                  ❤️
                                </motion.div>
                              </motion.button>
                            </div>
                            <div className="flex-1 py-3 pr-4">
                              <h3 className="text-gray-900 mb-1">
                                {displayName}
                              </h3>
                              <div className="flex items-center gap-3 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                  <span>{place.rating.toFixed(1)}</span>
                                </div>
                                <span>•</span>
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4 text-blue-500" />
                                  <span>{place.distanceKm} {t.km}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {!loading && filteredPlaces.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-gray-900 mb-2">
                    {language === 'TR' ? 'Sonuç Bulunamadı' : 'No Results Found'}
                  </h3>
                  <p className="text-gray-600">
                    {language === 'TR'
                      ? 'Farklı filtreler veya mesafe deneyin'
                      : 'Try different filters or distance range'}
                  </p>
                </motion.div>
              )}
            </div>
          )}
        </AnimatedSection>
      </div>
    </div>
  );
}

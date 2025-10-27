import { useEffect, useState } from 'react';
import { MapPin, Star, Clock, Filter, Sparkles, Search, X } from 'lucide-react';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Slider } from './ui/slider';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { AnimatedSection } from './AnimatedSection';
import { motion, AnimatePresence } from 'motion/react';

import { fetchMuseums, toApiUrl } from '../lib/api';
import type { PlaceListItem } from './types/places';

interface DiscoverPageProps {
  language: 'TR' | 'EN';
  onNavigate: (page: string, data?: any) => void;
}

export function DiscoverPage({ language, onNavigate }: DiscoverPageProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [distanceRange, setDistanceRange] = useState([20]);
  const [minRating, setMinRating] = useState(0);
  const [aiFilter, setAiFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // NEW: backend’ten doldurulan liste + loading
  const [places, setPlaces] = useState<PlaceListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // kullanıcı konumu yoksa backend İzmir merkezden mesafe hesaplıyor
    fetchMuseums()
      .then((data) => setPlaces(data))
      .finally(() => setLoading(false));
  }, []);

  const translations = {
    TR: {
      title: 'Keşfet',
      subtitle: 'İlgi alanlarına göre en iyi destinasyonları keşfet',
      filters: 'Filtreler',
      search: 'Ara...',
      category: 'Kategori',
      categories: {
        nature: 'Doğa',
        historical: 'Tarihi',
        art: 'Sanat',
        family: 'Aile',
        romantic: 'Romantik',
        gastronomy: 'Gastronomi'
      },
      distance: 'Mesafe',
      rating: 'Değerlendirme',
      aiFilter: 'AI\'ye Bırak',
      aiPlaceholder: 'Örn: macera, huzur, eğlence...',
      viewDetails: 'Detaylara Git',
      km: 'km',
      mapView: 'Harita Görünümü',
      clearFilters: 'Filtreleri Temizle',
      resultsFound: 'sonuç bulundu'
    },
    EN: {
      title: 'Discover',
      subtitle: 'Explore the best destinations based on your interests',
      filters: 'Filters',
      search: 'Search...',
      category: 'Category',
      categories: {
        nature: 'Nature',
        historical: 'Historical',
        art: 'Art',
        family: 'Family',
        romantic: 'Romantic',
        gastronomy: 'Gastronomy'
      },
      distance: 'Distance',
      rating: 'Rating',
      aiFilter: 'Let AI Decide',
      aiPlaceholder: 'E.g: adventure, peace, fun...',
      viewDetails: 'View Details',
      km: 'km',
      mapView: 'Map View',
      clearFilters: 'Clear Filters',
      resultsFound: 'results found'
    }
  };

  const t = translations[language];

  const categories = [
    { id: 'nature', label: t.categories.nature, icon: '🌿' },
    { id: 'historical', label: t.categories.historical, icon: '🏛️' },
    { id: 'art', label: t.categories.art, icon: '🎨' },
    { id: 'family', label: t.categories.family, icon: '👨‍👩‍👧' },
    { id: 'romantic', label: t.categories.romantic, icon: '💝' },
    { id: 'gastronomy', label: t.categories.gastronomy, icon: '🍽️' }
  ];

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(c => c !== categoryId)
        : [...prev, categoryId]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setDistanceRange([20]);
    setMinRating(0);
    setAiFilter('');
    setSearchQuery('');
  };

  // NEW: backend alan adlarına göre filtre
  const filteredPlaces = places.filter(place => {
    if (selectedCategories.length > 0 && !selectedCategories.includes(place.category)) return false;
    if (place.distanceKm > distanceRange[0]) return false;
    if (place.rating < minRating) return false;
    if (searchQuery) {
      const s = searchQuery.toLowerCase();
      const nameMatch =
        place.nameTr.toLowerCase().includes(s) ||
        place.nameEn.toLowerCase().includes(s);
      if (!nameMatch) return false;
    }
    return true;
  });

  const resultsCount = loading ? '...' : filteredPlaces.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      <div className="container mx-auto px-4 py-8">
        <AnimatedSection>
          <div className="text-center mb-8">
            <h1 className="text-gray-900 mb-2">{t.title}</h1>
            <p className="text-gray-600">{t.subtitle}</p>
          </div>
        </AnimatedSection>

        {/* Search Bar */}
        <AnimatedSection delay={0.1}>
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder={t.search}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-6 rounded-full glass-morphism shadow-lg border-0"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Panel */}
          <AnimatedSection delay={0.2} direction="left">
            <div className="lg:col-span-1">
              <Card className="sticky top-24 glass-morphism shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <Filter className="w-5 h-5 text-purple-600" />
                      <h3 className="text-gray-900">{t.filters}</h3>
                    </div>
                    {(selectedCategories.length > 0 || aiFilter) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="text-purple-600"
                      >
                        {t.clearFilters}
                      </Button>
                    )}
                  </div>

                  {/* AI Filter */}
                  <div className="mb-6">
                    <label className="flex items-center gap-2 mb-3 text-gray-700">
                      <Sparkles className="w-4 h-4 text-purple-600" />
                      {t.aiFilter}
                    </label>
                    <div className="relative">
                      <Input
                        type="text"
                        placeholder={t.aiPlaceholder}
                        value={aiFilter}
                        onChange={(e) => setAiFilter(e.target.value)}
                        className="w-full bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 focus:border-purple-400"
                      />
                      <Sparkles className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-purple-400" />
                    </div>
                  </div>

                  {/* Category Filter */}
                  <div className="mb-6">
                    <h4 className="text-gray-900 mb-3">{t.category}</h4>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <motion.div
                          key={category.id}
                          whileHover={{ scale: 1.02 }}
                          className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                            selectedCategories.includes(category.id)
                              ? 'bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200'
                              : 'hover:bg-gray-50'
                          }`}
                          onClick={() => toggleCategory(category.id)}
                        >
                          <Checkbox
                            id={category.id}
                            checked={selectedCategories.includes(category.id)}
                            onCheckedChange={() => toggleCategory(category.id)}
                          />
                          <span className="text-xl">{category.icon}</span>
                          <label htmlFor={category.id} className="text-gray-700 cursor-pointer flex-1">
                            {category.label}
                          </label>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Distance Filter */}
                  <div className="mb-6">
                    <h4 className="text-gray-900 mb-3">
                      {t.distance}: 0–{distanceRange[0]} {t.km}
                    </h4>
                    <Slider
                      value={distanceRange}
                      onValueChange={setDistanceRange}
                      max={50}
                      step={5}
                      className="w-full"
                    />
                  </div>

                  {/* Rating Filter */}
                  <div className="mb-4">
                    <h4 className="text-gray-900 mb-3">
                      {t.rating}: {minRating}+ ⭐
                    </h4>
                    <Slider
                      value={[minRating]}
                      onValueChange={(val) => setMinRating(val[0])}
                      max={5}
                      step={0.5}
                      className="w-full"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </AnimatedSection>

          {/* Places Grid */}
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <motion.p
                key={resultsCount as any}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-gray-600"
              >
                <span className="text-purple-600">{resultsCount}</span> {t.resultsFound}
              </motion.p>
              <Button variant="outline" className="gap-2 glass-morphism">
                <MapPin className="w-4 h-4" />
                {t.mapView}
              </Button>
            </div>

            {/* Basit yükleniyor durumu */}
            {loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-64 animate-pulse rounded-2xl bg-gray-200/60 border border-gray-100" />
                ))}
              </div>
            )}

            {!loading && (
              <AnimatePresence mode="wait">
                <motion.div
                  key={filteredPlaces.length}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                >
                  {filteredPlaces.map((place, index) => {
                    const displayName = language === 'TR' ? place.nameTr : place.nameEn;
                    const durationText = language === 'TR' ? place.durationTr : place.durationEn;

                    return (
                      <AnimatedSection key={place.placeId} delay={index * 0.05}>
                        <motion.div
                          whileHover={{ y: -8, transition: { duration: 0.3 } }}
                          className="h-full"
                        >
                          <Card
                            className="overflow-hidden hover:shadow-2xl transition-all cursor-pointer h-full border-0 glass-morphism group"
                            onClick={() =>
                              onNavigate('place-detail', {
                                placeId: place.placeId,
                                displayName,
                                imageUrl: place.imageUrl
                              })
                            }
                          >
                            <div className="relative h-48 overflow-hidden">
                              <motion.div
                                whileHover={{ scale: 1.1 }}
                                transition={{ duration: 0.4 }}
                                className="w-full h-full"
                              >
                                <ImageWithFallback
                                  src={toApiUrl(place.imageUrl)}
                                  alt={displayName}
                                  className="w-full h-full object-cover"
                                />
                              </motion.div>
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                              <Badge className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-gray-900 shadow-lg">
                                {t.categories[place.category as keyof typeof t.categories]}
                              </Badge>
                            </div>
                            <CardContent className="p-5">
                              <h3 className="text-gray-900 mb-3">{displayName}</h3>
                              <div className="flex items-center gap-4 mb-4 text-gray-600">
                                <div className="flex items-center gap-1">
                                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                  <span>{place.rating}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4 text-blue-500" />
                                  <span>{place.distanceKm} {t.km}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="w-4 h-4 text-purple-500" />
                                  <span className="text-sm">{durationText}</span>
                                </div>
                              </div>
                              <Button className="w-full group-hover:shadow-lg">
                                {t.viewDetails}
                              </Button>
                            </CardContent>
                          </Card>
                        </motion.div>
                      </AnimatedSection>
                    );
                  })}
                </motion.div>
              </AnimatePresence>
            )}

            {!loading && filteredPlaces.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20"
              >
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-gray-900 mb-2">
                  {language === 'TR' ? 'Sonuç Bulunamadı' : 'No Results Found'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {language === 'TR'
                    ? 'Farklı filtreler deneyebilirsiniz'
                    : 'Try different filters'}
                </p>
                <Button onClick={clearFilters} variant="outline">
                  {t.clearFilters}
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
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

interface EnhancedHomePageProps {
  language: 'TR' | 'EN';
  onNavigate: (page: string, data?: any) => void;
  isAuthenticated: boolean;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

const cities = [
  { id: 'izmir', name: 'İzmir', nameEn: 'Izmir' }
];

const categories = [
  { id: 'parks', icon: '🏞️', name: 'Parklar', nameEn: 'Parks' },
  { id: 'museums', icon: '🏛️', name: 'Müzeler', nameEn: 'Museums' },
  { id: 'baths', icon: '♨️', name: 'Hamamlar', nameEn: 'Turkish Baths' },
  { id: 'historical', icon: '🏺', name: 'Tarihi Yerler', nameEn: 'Historical Sites' }
];

const mockPlaces = [
  {
    id: '1',
    name: 'Kordonboyu',
    nameEn: 'Kordon Promenade',
    category: 'parks',
    rating: 4.8,
    distance: 1.2,
    image: 'https://images.unsplash.com/photo-1635148040718-acf281233b8e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXR1cmUlMjBsYW5kc2NhcGUlMjBtb3VudGFpbnN8ZW58MXx8fHwxNzU5OTg2NDk5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    city: 'izmir'
  },
  {
    id: '2',
    name: 'Kemeraltı Çarşısı',
    nameEn: 'Kemeralti Bazaar',
    category: 'historical',
    rating: 4.6,
    distance: 0.8,
    image: 'https://images.unsplash.com/photo-1663660408776-abc66d76f611?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmNpZW50JTIwaGlzdG9yaWNhbCUyMGJ1aWxkaW5nfGVufDF8fHx8MTc2MDA0Mjc3Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    city: 'izmir'
  },
  {
    id: '3',
    name: 'İzmir Arkeoloji Müzesi',
    nameEn: 'Izmir Archaeology Museum',
    category: 'museums',
    rating: 4.7,
    distance: 2.5,
    image: 'https://images.unsplash.com/photo-1752408735055-07a651855edc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnQlMjBtdXNldW0lMjBnYWxsZXJ5fGVufDF8fHx8MTc2MDA0Mjc3M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    city: 'izmir'
  },
  {
    id: '4',
    name: 'Tarihi Havra Hamamı',
    nameEn: 'Historic Havra Bath',
    category: 'baths',
    rating: 4.5,
    distance: 1.5,
    image: 'https://images.unsplash.com/photo-1692271731602-08778b94ef77?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpc3RhbmJ1bCUyMHRyYXZlbCUyMHRvdXJpc218ZW58MXx8fHwxNzYwMDQyNzcxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    city: 'izmir'
  }
];

export function EnhancedHomePage({ 
  language, 
  onNavigate, 
  isAuthenticated,
  favorites,
  onToggleFavorite 
}: EnhancedHomePageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('rating');
  const [distanceRange, setDistanceRange] = useState([2]);
  const [showCategories, setShowCategories] = useState(false);

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
      viewAll: 'Tümünü Gör'
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
      viewAll: 'View All'
    }
  };

  const t = translations[language];

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(c => c !== categoryId)
        : [...prev, categoryId]
    );
  };

  const filteredPlaces = mockPlaces.filter(place => {
    if (selectedCity && place.city !== selectedCity) return false;
    if (selectedCategories.length > 0 && !selectedCategories.includes(place.category)) return false;
    if (place.distance > distanceRange[0]) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return place.name.toLowerCase().includes(query) || place.nameEn.toLowerCase().includes(query);
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'distance') return a.distance - b.distance;
    return (language === 'TR' ? a.name : a.nameEn).localeCompare(language === 'TR' ? b.name : b.nameEn);
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
                max={10}
                min={0.5}
                step={0.5}
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

          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {filteredPlaces.map((place, index) => (
                <motion.div
                  key={place.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  layout
                >
                  <Card
                    className="glass-morphism border-0 cursor-pointer overflow-hidden"
                    onClick={() => onNavigate('place-detail', place)}
                  >
                    <CardContent className="p-0">
                      <div className="flex gap-4">
                        <div className="relative w-24 h-24 flex-shrink-0">
                          <ImageWithFallback
                            src={place.image}
                            alt={language === 'TR' ? place.name : place.nameEn}
                            className="w-full h-full object-cover rounded-l-xl"
                          />
                          <motion.button
                            whileTap={{ scale: 0.8 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!isAuthenticated) {
                                onNavigate('auth');
                              } else {
                                onToggleFavorite(place.id);
                              }
                            }}
                            className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg"
                          >
                            <motion.div
                              animate={{
                                scale: favorites.includes(place.id) ? [1, 1.2, 1] : 1
                              }}
                              transition={{ duration: 0.3 }}
                            >
                              ❤️
                            </motion.div>
                          </motion.button>
                        </div>
                        <div className="flex-1 py-3 pr-4">
                          <h3 className="text-gray-900 mb-1">
                            {language === 'TR' ? place.name : place.nameEn}
                          </h3>
                          <div className="flex items-center gap-3 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span>{place.rating}</span>
                            </div>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4 text-blue-500" />
                              <span>{place.distance} {t.km}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredPlaces.length === 0 && (
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
                    ? 'Farklı filtreler veya şehir deneyin'
                    : 'Try different filters or city'}
                </p>
              </motion.div>
            )}
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}

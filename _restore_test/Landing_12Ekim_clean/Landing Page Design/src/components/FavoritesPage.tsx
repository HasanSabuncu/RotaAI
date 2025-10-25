import { Heart, MapPin, Star } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { AnimatedSection } from './AnimatedSection';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { motion } from 'motion/react';

interface FavoritesPageProps {
  language: 'TR' | 'EN';
  onNavigate: (page: string, data?: any) => void;
  isAuthenticated: boolean;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

const allPlaces = [
  {
    id: '1',
    name: 'Ayasofya',
    nameEn: 'Hagia Sophia',
    category: 'Tarihi',
    categoryEn: 'Historical',
    rating: 4.8,
    distance: 1.2,
    image: 'https://images.unsplash.com/photo-1663660408776-abc66d76f611?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmNpZW50JTIwaGlzdG9yaWNhbCUyMGJ1aWxkaW5nfGVufDF8fHx8MTc2MDA0Mjc3Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
  {
    id: '2',
    name: 'Gülhane Parkı',
    nameEn: 'Gulhane Park',
    category: 'Doğa',
    categoryEn: 'Nature',
    rating: 4.6,
    distance: 0.8,
    image: 'https://images.unsplash.com/photo-1635148040718-acf281233b8e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXR1cmUlMjBsYW5kc2NhcGUlMjBtb3VudGFpbnN8ZW58MXx8fHwxNzU5OTg2NDk5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
  {
    id: '3',
    name: 'İstanbul Modern',
    nameEn: 'Istanbul Modern',
    category: 'Sanat',
    categoryEn: 'Art',
    rating: 4.7,
    distance: 2.5,
    image: 'https://images.unsplash.com/photo-1752408735055-07a651855edc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnQlMjBtdXNldW0lMjBnYWxsZXJ5fGVufDF8fHx8MTc2MDA0Mjc3M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  }
];

export function FavoritesPage({ 
  language, 
  onNavigate, 
  isAuthenticated, 
  favorites,
  onToggleFavorite 
}: FavoritesPageProps) {
  const translations = {
    TR: {
      title: 'Favorilerim',
      subtitle: 'Beğendiğiniz yerler',
      loginRequired: 'Giriş Yapmanız Gerekiyor',
      loginMessage: 'Yerleri favorilerinize eklemek için lütfen giriş yapın veya hesap oluşturun.',
      login: 'Giriş Yap / Kayıt Ol',
      noFavorites: 'Henüz Favori Yeriniz Yok',
      noFavoritesMessage: 'Beğendiğiniz yerleri favorilerinize ekleyerek burada görebilirsiniz.',
      explore: 'Keşfetmeye Başla',
      viewDetails: 'Detayları Gör',
      km: 'km'
    },
    EN: {
      title: 'My Favorites',
      subtitle: 'Places you liked',
      loginRequired: 'Login Required',
      loginMessage: 'Please login or create an account to add places to your favorites.',
      login: 'Login / Register',
      noFavorites: 'No Favorites Yet',
      noFavoritesMessage: 'Add places you like to your favorites to see them here.',
      explore: 'Start Exploring',
      viewDetails: 'View Details',
      km: 'km'
    }
  };

  const t = translations[language];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 pb-20 md:pb-8">
        <div className="container mx-auto px-4 py-8">
          <AnimatedSection>
            <div className="max-w-md mx-auto text-center py-20">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', duration: 0.6 }}
                className="w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <Heart className="w-12 h-12 text-white" />
              </motion.div>
              <h2 className="text-gray-900 mb-3">{t.loginRequired}</h2>
              <p className="text-gray-600 mb-6">{t.loginMessage}</p>
              <Button
                size="lg"
                onClick={() => onNavigate('auth')}
                className="px-8 rounded-full"
              >
                {t.login}
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </div>
    );
  }

  const favoritePlaces = allPlaces.filter(place => favorites.includes(place.id));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 pb-20 md:pb-8">
      <div className="container mx-auto px-4 py-6">
        <AnimatedSection>
          <div className="mb-6">
            <h1 className="text-gray-900 mb-2">{t.title}</h1>
            <p className="text-gray-600">{t.subtitle}</p>
          </div>
        </AnimatedSection>

        {favoritePlaces.length === 0 ? (
          <AnimatedSection delay={0.1}>
            <div className="text-center py-20">
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: 'reverse'
                }}
                className="text-6xl mb-4"
              >
                💜
              </motion.div>
              <h3 className="text-gray-900 mb-2">{t.noFavorites}</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {t.noFavoritesMessage}
              </p>
              <Button
                onClick={() => onNavigate('discover')}
                className="rounded-full"
              >
                {t.explore}
              </Button>
            </div>
          </AnimatedSection>
        ) : (
          <div className="space-y-4">
            {favoritePlaces.map((place, index) => (
              <AnimatedSection key={place.id} delay={index * 0.05}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -4 }}
                >
                  <Card
                    className="glass-morphism border-0 cursor-pointer overflow-hidden"
                    onClick={() => onNavigate('place-detail', place)}
                  >
                    <CardContent className="p-0">
                      <div className="flex gap-4">
                        <div className="relative w-32 h-32 flex-shrink-0">
                          <ImageWithFallback
                            src={place.image}
                            alt={language === 'TR' ? place.name : place.nameEn}
                            className="w-full h-full object-cover"
                          />
                          <motion.button
                            whileTap={{ scale: 0.8 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleFavorite(place.id);
                            }}
                            className="absolute top-2 right-2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg"
                          >
                            <motion.div
                              animate={{
                                scale: [1, 1.3, 1]
                              }}
                              transition={{ duration: 0.3 }}
                            >
                              <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                            </motion.div>
                          </motion.button>
                        </div>
                        <div className="flex-1 py-4 pr-4">
                          <h3 className="text-gray-900 mb-2">
                            {language === 'TR' ? place.name : place.nameEn}
                          </h3>
                          <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
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
                          <div className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">
                            {language === 'TR' ? place.category : place.categoryEn}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

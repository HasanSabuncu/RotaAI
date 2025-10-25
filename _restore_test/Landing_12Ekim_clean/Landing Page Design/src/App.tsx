import { useState, useEffect } from 'react'; 
import { Header } from './components/Header';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Chatbot } from './components/Chatbot';
import { SwipeIndicator } from './components/SwipeIndicator';
import { EnhancedHomePage } from './components/EnhancedHomePage';
import { DiscoverPage } from './components/DiscoverPage';
import { PlaceDetailPage } from './components/PlaceDetailPage';
import { PlannerPage } from './components/PlannerPage';
import { FavoritesPage } from './components/FavoritesPage';
import { EnhancedProfilePage } from './components/EnhancedProfilePage';
import { AboutPage } from './components/AboutPage';
import { AuthPage } from './components/AuthPage';
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from 'motion/react';

type Page = 'home' | 'discover' | 'place-detail' | 'planner' | 'profile' | 'about' | 'auth' | 'favorites';
type Language = 'TR' | 'EN';

const mainPages: Page[] = ['home', 'discover', 'favorites', 'profile'];

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [language, setLanguage] = useState<Language>('TR');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedPlaceData, setSelectedPlaceData] = useState<{ placeId?: string } | null>(null);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(['1', '2']); // Mock favorites

  const x = useMotionValue(0);
  const opacity = useTransform(x, [-100, 0, 100], [0.5, 1, 0.5]);

  const handleNavigate = (page: string, data?: any) => {
    setCurrentPage(page as Page);

    if (page === 'place-detail' && data) {
      const pid = data?.placeId ?? data?.PlaceId ?? data?.id;
      setSelectedPlaceData(pid ? { placeId: pid } : null);
    } else {
      // Diğer sayfalarda detay state'ini temizle
      setSelectedPlaceData(null);
    }

    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
  };

  const handleToggleFavorite = (id: string) => {
    setFavorites(prev =>
      prev.includes(id)
        ? prev.filter(f => f !== id)
        : [...prev, id]
    );
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage('home');
  };

  const handleDragEnd = (event: any, info: PanInfo) => {
    const currentIndex = mainPages.indexOf(currentPage);
    const threshold = 50;

    if (info.offset.x > threshold && currentIndex > 0) {
      // Swipe right - go to previous page
      setCurrentPage(mainPages[currentIndex - 1]);
    } else if (info.offset.x < -threshold && currentIndex < mainPages.length - 1) {
      // Swipe left - go to next page
      setCurrentPage(mainPages[currentIndex + 1]);
    }
  };

  // Page transition variants
  const pageVariants = {
    initial: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0
    }),
    animate: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0
    })
  };

  const pageTransition = {
    type: "spring",
    stiffness: 300,
    damping: 30
  };

  const isMainPage = mainPages.includes(currentPage);

  return (
    <div className="min-h-screen bg-white">
      {/* Desktop Header - Hidden on mobile for main pages */}
      <div className={`${isMainPage ? 'hidden md:block' : 'block'}`}>
        <Header
          currentPage={currentPage}
          onNavigate={handleNavigate}
          language={language}
          onLanguageChange={handleLanguageChange}
          isAuthenticated={isAuthenticated}
        />
      </div>
      
      <AnimatePresence mode="wait" custom={0}>
        <motion.div
          key={currentPage}
          custom={0}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={pageVariants}
          transition={pageTransition}
          drag={isMainPage ? "x" : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
          style={{ x: isMainPage ? x : 0, opacity: isMainPage ? opacity : 1 }}
        >
          {currentPage === 'home' && (
            <EnhancedHomePage
              language={language}
              onNavigate={handleNavigate}
              isAuthenticated={isAuthenticated}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
            />
          )}
          
          {currentPage === 'discover' && (
            <DiscoverPage language={language} onNavigate={handleNavigate} />
          )}
          
          {currentPage === 'favorites' && (
            <FavoritesPage
              language={language}
              onNavigate={handleNavigate}
              isAuthenticated={isAuthenticated}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
            />
          )}
          
          {currentPage === 'profile' && (
            <>
              {isAuthenticated ? (
                <EnhancedProfilePage
                  language={language}
                  onNavigate={handleNavigate}
                  onLogout={handleLogout}
                />
              ) : (
                <AuthPage
                  language={language}
                  onNavigate={(page) => {
                    if (page === 'home') {
                      setIsAuthenticated(true);
                      setCurrentPage('profile');
                    } else {
                      handleNavigate(page);
                    }
                  }}
                />
              )}
            </>
          )}
          
          {currentPage === 'place-detail' && (
            <PlaceDetailPage
              language={language}
              onNavigate={handleNavigate}
              placeData={selectedPlaceData}
            />
          )}
          
          {currentPage === 'planner' && (
            <PlannerPage language={language} onNavigate={handleNavigate} />
          )}
          
          {currentPage === 'about' && (
            <AboutPage language={language} onNavigate={handleNavigate} />
          )}
          
          {currentPage === 'auth' && (
            <AuthPage
              language={language}
              onNavigate={(page) => {
                if (page === 'home') {
                  setIsAuthenticated(true);
                }
                handleNavigate(page);
              }}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Swipe Indicator for main pages */}
      {isMainPage && (
        <SwipeIndicator currentPage={currentPage} language={language} />
      )}

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenChatbot={() => setIsChatbotOpen(true)}
        language={language}
        isAuthenticated={isAuthenticated}
      />

      {/* Chatbot */}
      <Chatbot
        isOpen={isChatbotOpen}
        onClose={() => setIsChatbotOpen(false)}
        language={language}
        onNavigate={(page, data) => {
          handleNavigate(page, data);
          setIsChatbotOpen(false);
        }}
      />

      {/* Footer - Only show on desktop and non-main pages */}
      {!isMainPage && (
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="hidden md:block bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white py-12 mt-20 relative overflow-hidden"
        >
          {/* Animated Background Elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shimmer-button">
                    <span className="text-white">RA</span>
                  </div>
                  <span className="text-xl">RotaAI</span>
                </div>
                <p className="text-gray-400">
                  {language === 'TR'
                    ? 'Yapay zekâ ile kişiselleştirilmiş seyahat rotaları.'
                    : 'Personalized travel routes with AI.'}
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                viewport={{ once: true }}
              >
                <h4 className="mb-4">{language === 'TR' ? 'Hızlı Linkler' : 'Quick Links'}</h4>
                <ul className="space-y-2 text-gray-400">
                  {[
                    { page: 'home', label: language === 'TR' ? 'Ana Sayfa' : 'Home' },
                    { page: 'discover', label: language === 'TR' ? 'Keşfet' : 'Discover' },
                    { page: 'planner', label: language === 'TR' ? 'Plan Oluştur' : 'Create Plan' },
                    { page: 'about', label: language === 'TR' ? 'Hakkımızda' : 'About' }
                  ].map((item) => (
                    <motion.li
                      key={item.page}
                      whileHover={{ x: 5 }}
                    >
                      <button
                        onClick={() => handleNavigate(item.page)}
                        className="hover:text-white transition-colors"
                      >
                        {item.label}
                      </button>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                viewport={{ once: true }}
              >
                <h4 className="mb-4">{language === 'TR' ? 'Destek' : 'Support'}</h4>
                <ul className="space-y-2 text-gray-400">
                  {[
                    language === 'TR' ? 'Yardım Merkezi' : 'Help Center',
                    language === 'TR' ? 'İletişim' : 'Contact',
                    language === 'TR' ? 'Gizlilik Politikası' : 'Privacy Policy',
                    language === 'TR' ? 'Kullanım Şartları' : 'Terms of Service'
                  ].map((item, index) => (
                    <motion.li
                      key={index}
                      whileHover={{ x: 5 }}
                    >
                      <a href="#" className="hover:text-white transition-colors">
                        {item}
                      </a>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                viewport={{ once: true }}
              >
                <h4 className="mb-4">{language === 'TR' ? 'İletişim' : 'Contact'}</h4>
                <ul className="space-y-2 text-gray-400">
                  <li>info@rotaai.com</li>
                  <li>+90 555 123 4567</li>
                  <li>İstanbul, Türkiye</li>
                </ul>
                <div className="flex gap-4 mt-4">
                  {['T', 'F', 'I'].map((social, index) => (
                    <motion.a
                      key={index}
                      href="#"
                      whileHover={{ scale: 1.2, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                    >
                      <span className="text-sm">{social}</span>
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            </div>
            
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              viewport={{ once: true }}
              className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400"
            >
              <p>© 2025 RotaAI. {language === 'TR' ? 'Tüm hakları saklıdır.' : 'All rights reserved.'}</p>
            </motion.div>
          </div>
        </motion.footer>
      )}
    </div>
  );
}

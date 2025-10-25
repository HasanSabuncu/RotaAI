import { Globe, Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  language: 'TR' | 'EN';
  onLanguageChange: (lang: 'TR' | 'EN') => void;
  isAuthenticated: boolean;
}

export function Header({ currentPage, onNavigate, language, onLanguageChange, isAuthenticated }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const translations = {
    TR: {
      home: 'Ana Sayfa',
      discover: 'Keşfet',
      planner: 'Plan Oluştur',
      about: 'Hakkında',
      login: 'Giriş / Kayıt Ol',
      profile: 'Profil',
      logout: 'Çıkış Yap'
    },
    EN: {
      home: 'Home',
      discover: 'Discover',
      planner: 'Create Plan',
      about: 'About',
      login: 'Login / Register',
      profile: 'Profile',
      logout: 'Logout'
    }
  };

  const t = translations[language];

  const menuItems = [
    { id: 'home', label: t.home },
    { id: 'discover', label: t.discover },
    { id: 'planner', label: t.planner },
    { id: 'about', label: t.about },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-50 glass-morphism border-b border-gray-200/50 shadow-lg"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shimmer-button">
              <span className="text-white">RA</span>
            </div>
            <span className="text-xl text-gray-900 hidden sm:block">RotaAI</span>
          </motion.button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {menuItems.map((item) => (
              <motion.button
                key={item.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onNavigate(item.id)}
                className={`px-4 py-2 rounded-lg transition-all ${
                  currentPage === item.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {item.label}
              </motion.button>
            ))}
          </nav>

          {/* Right Section */}
          <div className="hidden md:flex items-center gap-4">
            {/* Language Selector */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onLanguageChange(language === 'TR' ? 'EN' : 'TR')}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Globe className="w-4 h-4" />
              <span>{language}</span>
            </motion.button>

            {/* Auth Button */}
            {isAuthenticated ? (
              <>
                <Button
                  variant="ghost"
                  onClick={() => onNavigate('profile')}
                >
                  {t.profile}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => onNavigate('home')}
                >
                  {t.logout}
                </Button>
              </>
            ) : (
              <Button onClick={() => onNavigate('auth')}>
                {t.login}
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden pt-4 pb-2 border-t border-gray-200/50 mt-4 overflow-hidden"
            >
              <nav className="flex flex-col gap-2">
                {menuItems.map((item, index) => (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => {
                      onNavigate(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`text-left px-4 py-3 rounded-lg transition-all ${
                      currentPage === item.id
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {item.label}
                  </motion.button>
                ))}
                <div className="border-t border-gray-200 my-2"></div>
                <button
                  onClick={() => onLanguageChange(language === 'TR' ? 'EN' : 'TR')}
                  className="flex items-center gap-2 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg"
                >
                  <Globe className="w-4 h-4" />
                  <span>{language === 'TR' ? 'EN' : 'TR'}</span>
                </button>
                {isAuthenticated ? (
                  <>
                    <button
                      onClick={() => {
                        onNavigate('profile');
                        setMobileMenuOpen(false);
                      }}
                      className="px-4 py-3 text-left text-gray-600 hover:bg-gray-50 rounded-lg"
                    >
                      {t.profile}
                    </button>
                    <button
                      onClick={() => {
                        onNavigate('home');
                        setMobileMenuOpen(false);
                      }}
                      className="px-4 py-3 text-left text-gray-600 hover:bg-gray-50 rounded-lg"
                    >
                      {t.logout}
                    </button>
                  </>
                ) : (
                  <Button
                    onClick={() => {
                      onNavigate('auth');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full mt-2"
                  >
                    {t.login}
                  </Button>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}

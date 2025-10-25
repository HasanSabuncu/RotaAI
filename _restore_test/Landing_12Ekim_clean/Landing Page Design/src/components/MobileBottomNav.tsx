import { Home, Compass, Plus, Heart, User } from 'lucide-react';
import { motion } from 'motion/react';

interface MobileBottomNavProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onOpenChatbot: () => void;
  language: 'TR' | 'EN';
  isAuthenticated: boolean;
}

export function MobileBottomNav({ 
  currentPage, 
  onNavigate, 
  onOpenChatbot, 
  language,
  isAuthenticated 
}: MobileBottomNavProps) {
  const translations = {
    TR: {
      home: 'Ana Sayfa',
      discover: 'Keşfet',
      create: 'Plan Oluştur',
      favorites: 'Favorilerim',
      account: 'Hesabım'
    },
    EN: {
      home: 'Home',
      discover: 'Discover',
      create: 'Create Plan',
      favorites: 'Favorites',
      account: 'Account'
    }
  };

  const t = translations[language];

  const navItems = [
    { id: 'home', label: t.home, icon: Home },
    { id: 'discover', label: t.discover, icon: Compass },
    { id: 'create', label: t.create, icon: Plus, isCenter: true },
    { id: 'favorites', label: t.favorites, icon: Heart },
    { id: 'account', label: t.account, icon: User }
  ];

  const handleNavClick = (id: string) => {
    if (id === 'create') {
      onOpenChatbot();
    } else if (id === 'favorites' && !isAuthenticated) {
      onNavigate('auth');
    } else if (id === 'account') {
      if (isAuthenticated) {
        onNavigate('profile');
      } else {
        onNavigate('auth');
      }
    } else {
      onNavigate(id);
    }
  };

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
    >
      <div className="glass-morphism border-t border-gray-200/50 shadow-2xl pb-safe">
        <div className="container mx-auto px-2">
          <div className="flex items-center justify-around py-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              
              if (item.isCenter) {
                return (
                  <motion.button
                    key={item.id}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleNavClick(item.id)}
                    className="relative -mt-8"
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-2xl shimmer-button">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                  </motion.button>
                );
              }

              return (
                <motion.button
                  key={item.id}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all ${
                    isActive 
                      ? 'text-blue-600' 
                      : 'text-gray-500'
                  }`}
                >
                  <Icon className={`w-6 h-6 ${isActive ? 'fill-blue-600' : ''}`} />
                  <span className="text-xs">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

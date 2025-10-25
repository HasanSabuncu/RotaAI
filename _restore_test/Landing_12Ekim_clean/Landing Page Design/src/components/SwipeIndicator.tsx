import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';

interface SwipeIndicatorProps {
  currentPage: string;
  language: 'TR' | 'EN';
}

const pages = ['home', 'discover', 'favorites', 'profile'];

export function SwipeIndicator({ currentPage, language }: SwipeIndicatorProps) {
  const [showHint, setShowHint] = useState(false);
  const currentIndex = pages.indexOf(currentPage);

  useEffect(() => {
    // Show hint on first visit
    const hasSeenHint = localStorage.getItem('hasSeenSwipeHint');
    if (!hasSeenHint && currentPage === 'home') {
      setShowHint(true);
      setTimeout(() => {
        setShowHint(false);
        localStorage.setItem('hasSeenSwipeHint', 'true');
      }, 3000);
    }
  }, [currentPage]);

  const pageNames = {
    TR: {
      home: 'Ana Sayfa',
      discover: 'Keşfet',
      favorites: 'Favorilerim',
      profile: 'Hesabım'
    },
    EN: {
      home: 'Home',
      discover: 'Discover',
      favorites: 'Favorites',
      profile: 'Account'
    }
  };

  const t = pageNames[language];

  return (
    <>
      {/* Swipe Hint */}
      {showHint && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-40 md:hidden"
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-2">
            <motion.div
              animate={{ x: [-5, 5, -5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.div>
            <span className="text-sm">
              {language === 'TR' ? 'Kaydırarak gezin' : 'Swipe to navigate'}
            </span>
            <motion.div
              animate={{ x: [-5, 5, -5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ChevronRight className="w-5 h-5" />
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* Page Indicators */}
      <div className="fixed top-16 left-0 right-0 z-30 md:hidden">
        <div className="flex justify-center gap-2 py-2">
          {pages.map((page, index) => (
            <motion.div
              key={page}
              initial={false}
              animate={{
                width: currentPage === page ? 24 : 8,
                backgroundColor: currentPage === page ? '#3b82f6' : '#d1d5db'
              }}
              className="h-2 rounded-full"
            />
          ))}
        </div>
        
        {/* Current Page Name */}
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-sm text-gray-600 py-1"
        >
          {t[currentPage as keyof typeof t]}
        </motion.div>
      </div>

      {/* Side Navigation Hints */}
      {currentIndex > 0 && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 0.5, x: 0 }}
          className="fixed left-2 top-1/2 transform -translate-y-1/2 z-30 md:hidden pointer-events-none"
        >
          <motion.div
            animate={{ x: [-3, 0, -3] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-lg"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </motion.div>
        </motion.div>
      )}

      {currentIndex < pages.length - 1 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 0.5, x: 0 }}
          className="fixed right-2 top-1/2 transform -translate-y-1/2 z-30 md:hidden pointer-events-none"
        >
          <motion.div
            animate={{ x: [0, 3, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-lg"
          >
            <ChevronRight className="w-6 h-6 text-gray-600" />
          </motion.div>
        </motion.div>
      )}
    </>
  );
}

import { Search, Brain, User, Map, MapPin, Sparkles, TrendingUp, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { AnimatedSection } from './AnimatedSection';
import { ParallaxBackground } from './ParallaxBackground';
import { motion } from 'motion/react';

interface LandingPageProps {
  language: 'TR' | 'EN';
  onNavigate: (page: string) => void;
}

export function LandingPage({ language, onNavigate }: LandingPageProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const translations = {
    TR: {
      hero: {
        title: 'Yapay Zekâ ile Kendi Gezi Rotalarını Oluştur',
        subtitle: 'Konumuna ve ilgi alanına özel turistik yer önerileri al.',
        searchPlaceholder: 'Nereye gitmek istiyorsun?',
        startNow: 'Hemen Başla',
        createPlan: 'Plan Oluştur'
      },
      features: {
        title: 'Öne Çıkan Özellikler',
        ai: {
          title: 'AI Destekli Öneriler',
          desc: 'Yapay zekâ, tercihlerine göre en uygun rotaları önerir'
        },
        profile: {
          title: 'Kişisel Profil ve İlgi Alanları',
          desc: 'Profilini oluştur, ilgi alanlarını belirle ve özel öneriler al'
        },
        route: {
          title: 'Dinamik Rota Planı',
          desc: 'Saat bazlı, optimize edilmiş gezi rotaları oluştur'
        },
        map: {
          title: 'Harita Entegrasyonu',
          desc: 'Tüm noktaları harita üzerinde görüntüle ve takip et'
        }
      },
      howItWorks: {
        title: 'RotaAI Nasıl Çalışır?',
        step1: {
          title: 'İlgi Alanlarını Belirle',
          desc: 'Tercihlerini ve ilgi alanlarını belirt'
        },
        step2: {
          title: 'AI Analiz Eder',
          desc: 'Yapay zekâmız sana özel rotalar oluşturur'
        },
        step3: {
          title: 'Gezmeye Başla',
          desc: 'Planını indir ve keşfetmeye başla'
        }
      },
      stats: {
        users: 'Mutlu Kullanıcı',
        routes: 'Oluşturulan Rota',
        destinations: 'Destinasyon',
        rating: 'Kullanıcı Memnuniyeti'
      }
    },
    EN: {
      hero: {
        title: 'Create Your Travel Routes with AI',
        subtitle: 'Get personalized tourist spot recommendations based on your location and interests.',
        searchPlaceholder: 'Where do you want to go?',
        startNow: 'Start Now',
        createPlan: 'Create Plan'
      },
      features: {
        title: 'Featured Features',
        ai: {
          title: 'AI-Powered Recommendations',
          desc: 'AI suggests the most suitable routes based on your preferences'
        },
        profile: {
          title: 'Personal Profile & Interests',
          desc: 'Create your profile, set your interests and get custom recommendations'
        },
        route: {
          title: 'Dynamic Route Planning',
          desc: 'Create hourly, optimized travel routes'
        },
        map: {
          title: 'Map Integration',
          desc: 'View and track all points on the map'
        }
      },
      howItWorks: {
        title: 'How RotaAI Works?',
        step1: {
          title: 'Set Your Interests',
          desc: 'Specify your preferences and interests'
        },
        step2: {
          title: 'AI Analyzes',
          desc: 'Our AI creates personalized routes for you'
        },
        step3: {
          title: 'Start Exploring',
          desc: 'Download your plan and start exploring'
        }
      },
      stats: {
        users: 'Happy Users',
        routes: 'Routes Created',
        destinations: 'Destinations',
        rating: 'User Satisfaction'
      }
    }
  };

  const t = translations[language];

  const features = [
    {
      icon: <Brain className="w-8 h-8 text-blue-600" />,
      title: t.features.ai.title,
      desc: t.features.ai.desc,
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <User className="w-8 h-8 text-purple-600" />,
      title: t.features.profile.title,
      desc: t.features.profile.desc,
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: <MapPin className="w-8 h-8 text-green-600" />,
      title: t.features.route.title,
      desc: t.features.route.desc,
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: <Map className="w-8 h-8 text-orange-600" />,
      title: t.features.map.title,
      desc: t.features.map.desc,
      gradient: 'from-orange-500 to-red-500'
    }
  ];

  const stats = [
    { value: '10,000+', label: t.stats.users, icon: '👥' },
    { value: '50,000+', label: t.stats.routes, icon: '🗺️' },
    { value: '200+', label: t.stats.destinations, icon: '📍' },
    { value: '4.9/5', label: t.stats.rating, icon: '⭐' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section with Parallax */}
      <ParallaxBackground className="relative min-h-screen flex items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/90 via-purple-50/90 to-pink-50/90"></div>
        
        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, 0]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-20 left-10 w-20 h-20 bg-blue-400/20 rounded-full blur-xl"
          />
          <motion.div
            animate={{
              y: [0, 20, 0],
              rotate: [0, -5, 0]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-40 right-20 w-32 h-32 bg-purple-400/20 rounded-full blur-xl"
          />
          <motion.div
            animate={{
              y: [0, -30, 0],
              x: [0, 20, 0]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute bottom-20 left-1/4 w-24 h-24 bg-pink-400/20 rounded-full blur-xl"
          />
        </div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <AnimatedSection delay={0.1}>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full mb-6 shadow-lg border border-white/20"
              >
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span className="text-purple-600">
                  {language === 'TR' ? 'AI Destekli Seyahat Planlama' : 'AI-Powered Travel Planning'}
                </span>
              </motion.div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <h1 className="text-gray-900 mb-6 text-4xl md:text-5xl lg:text-6xl">
                {t.hero.title}
              </h1>
            </AnimatedSection>
            
            <AnimatedSection delay={0.3}>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto text-lg">
                {t.hero.subtitle}
              </p>
            </AnimatedSection>

            {/* Search Bar */}
            <AnimatedSection delay={0.4}>
              <div className="max-w-2xl mx-auto mb-8">
                <div className="relative glass-morphism rounded-full p-2 shadow-2xl">
                  <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder={t.hero.searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-14 pr-4 py-6 text-lg rounded-full border-0 bg-transparent focus:ring-0"
                  />
                </div>
              </div>
            </AnimatedSection>

            {/* CTA Buttons */}
            <AnimatedSection delay={0.5}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  onClick={() => onNavigate('auth')}
                  className="px-8 py-6 rounded-full text-lg shadow-2xl"
                >
                  <Sparkles className="w-5 h-5" />
                  {t.hero.startNow}
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => onNavigate('planner')}
                  className="px-8 py-6 rounded-full text-lg border-2 glass-morphism hover:scale-105 transition-all"
                >
                  {t.hero.createPlan}
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </ParallaxBackground>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjIiLz48L2c+PC9zdmc+')] animate-gradient"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <AnimatedSection key={index} delay={index * 0.1}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="text-center"
                >
                  <div className="text-4xl mb-2">{stat.icon}</div>
                  <div className="text-3xl md:text-4xl mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-gray-300">{stat.label}</div>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50"></div>
        <div className="container mx-auto px-4 relative z-10">
          <AnimatedSection>
            <h2 className="text-center text-gray-900 mb-4">
              {t.features.title}
            </h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              {language === 'TR' 
                ? 'RotaAI ile seyahat planlaması hiç bu kadar kolay olmamıştı'
                : 'Travel planning has never been this easy with RotaAI'}
            </p>
          </AnimatedSection>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {features.map((feature, index) => (
              <AnimatedSection key={index} delay={index * 0.1}>
                <motion.div
                  whileHover={{ 
                    y: -10,
                    transition: { duration: 0.3 }
                  }}
                  className="group relative p-8 bg-white rounded-2xl hover:shadow-2xl transition-all border border-gray-100 overflow-hidden h-full"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity`}></div>
                  <div className="relative">
                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.gradient} bg-opacity-10 mb-4`}>
                      {feature.icon}
                    </div>
                    <h3 className="text-gray-900 mb-3">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                  </div>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <h2 className="text-center text-gray-900 mb-16">
              {t.howItWorks.title}
            </h2>
          </AnimatedSection>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto relative">
            {/* Connection Lines */}
            <div className="hidden md:block absolute top-20 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-blue-200 via-purple-200 to-green-200"></div>
            
            {[
              { 
                num: 1, 
                title: t.howItWorks.step1.title, 
                desc: t.howItWorks.step1.desc,
                color: 'from-blue-500 to-blue-600',
                icon: <User className="w-6 h-6" />
              },
              { 
                num: 2, 
                title: t.howItWorks.step2.title, 
                desc: t.howItWorks.step2.desc,
                color: 'from-purple-500 to-purple-600',
                icon: <Brain className="w-6 h-6" />
              },
              { 
                num: 3, 
                title: t.howItWorks.step3.title, 
                desc: t.howItWorks.step3.desc,
                color: 'from-green-500 to-green-600',
                icon: <TrendingUp className="w-6 h-6" />
              }
            ].map((step, index) => (
              <AnimatedSection key={index} delay={index * 0.2}>
                <div className="text-center relative">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className={`w-20 h-20 bg-gradient-to-br ${step.color} text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg relative z-10`}
                  >
                    {step.icon}
                  </motion.div>
                  <h3 className="text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Visual Demo Section with Parallax */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="max-w-6xl mx-auto bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-3xl overflow-hidden shadow-2xl relative">
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative z-10 p-8 md:p-12">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-white mb-4">
                    {language === 'TR' ? 'Yapay Zekâ Gücünü Keşfet' : 'Discover the Power of AI'}
                  </h2>
                  <p className="text-white/90 mb-6 text-lg">
                    {language === 'TR' 
                      ? 'RotaAI, gelişmiş yapay zekâ algoritmaları ile sana en uygun rotaları oluşturur. Tercihlerini öğrenir ve her geçen gün daha iyi öneriler sunar.'
                      : 'RotaAI creates the most suitable routes for you with advanced AI algorithms. It learns your preferences and offers better recommendations every day.'}
                  </p>
                  <Button 
                    onClick={() => onNavigate('planner')}
                    className="bg-white text-purple-600 hover:bg-gray-100"
                  >
                    {language === 'TR' ? 'Hemen Dene' : 'Try Now'}
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="relative h-64 md:h-96"
                >
                  <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden">
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1692271731602-08778b94ef77?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpc3RhbmJ1bCUyMHRyYXZlbCUyMHRvdXJpc218ZW58MXx8fHwxNzYwMDQyNzcxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                      alt="Travel"
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  </div>
                </motion.div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-gray-900 mb-4">
                {language === 'TR' ? 'Seyahatini Planlamaya Hazır Mısın?' : 'Ready to Plan Your Journey?'}
              </h2>
              <p className="text-gray-600 mb-8 text-lg">
                {language === 'TR'
                  ? 'Binlerce kullanıcı RotaAI ile unutulmaz seyahatler planlıyor. Sen de hemen başla!'
                  : 'Thousands of users are planning unforgettable journeys with RotaAI. Start now!'}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  onClick={() => onNavigate('planner')}
                  className="px-8 py-6 rounded-full text-lg shadow-xl"
                >
                  <Sparkles className="w-5 h-5" />
                  {language === 'TR' ? 'Ücretsiz Dene' : 'Try for Free'}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => onNavigate('about')}
                  className="px-8 py-6 rounded-full text-lg border-2"
                >
                  {language === 'TR' ? 'Daha Fazla Bilgi' : 'Learn More'}
                </Button>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}

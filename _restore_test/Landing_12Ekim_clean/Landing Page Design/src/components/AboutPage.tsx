import { Brain, Target, Users, TrendingUp, BookOpen } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

interface AboutPageProps {
  language: 'TR' | 'EN';
  onNavigate: (page: string) => void;
}

export function AboutPage({ language, onNavigate }: AboutPageProps) {
  const translations = {
    TR: {
      title: 'Hakkımızda',
      subtitle: 'RotaAI ile Seyahatin Geleceğini Keşfedin',
      mission: {
        title: 'Misyonumuz',
        content: 'RotaAI, yapay zekâ teknolojisini kullanarak herkesin kendi kişiselleştirilmiş seyahat rotalarını kolayca oluşturabilmesini sağlamak için kuruldu. Hedefimiz, seyahat planlamasını daha akıllı, daha hızlı ve daha keyifli hale getirmektir.'
      },
      whyAi: {
        title: 'Neden Yapay Zekâ?',
        content: 'Geleneksel seyahat planlaması, saatler süren araştırma ve karmaşık karar verme süreçleri gerektirir. RotaAI, gelişmiş yapay zekâ algoritmaları sayesinde tercihlerinizi anlar, konum bilgilerinizi kullanır ve size özel rotalar oluşturur. Böylece siz sadece gezmeye odaklanabilirsiniz.'
      },
      features: {
        title: 'Özelliklerimiz',
        personalization: {
          title: 'Kişiselleştirme',
          desc: 'İlgi alanlarınıza göre özel rotalar'
        },
        smart: {
          title: 'Akıllı Öneriler',
          desc: 'AI destekli konum bazlı öneriler'
        },
        optimization: {
          title: 'Optimizasyon',
          desc: 'Zaman ve mesafe optimizasyonu'
        },
        community: {
          title: 'Topluluk',
          desc: 'Kullanıcı deneyimlerinden öğrenen sistem'
        }
      },
      blog: {
        title: 'Blog & Rehberler',
        subtitle: 'Seyahat ipuçları ve destinasyon rehberleri',
        readMore: 'Devamını Oku',
        allArticles: 'Tüm Yazılar'
      },
      cta: {
        title: 'Hemen Başlayın',
        subtitle: 'Yapay zekâ ile ilk rotanızı oluşturun',
        button: 'Plan Oluştur'
      }
    },
    EN: {
      title: 'About Us',
      subtitle: 'Discover the Future of Travel with RotaAI',
      mission: {
        title: 'Our Mission',
        content: 'RotaAI was founded to enable everyone to easily create their own personalized travel routes using artificial intelligence technology. Our goal is to make travel planning smarter, faster, and more enjoyable.'
      },
      whyAi: {
        title: 'Why AI?',
        content: 'Traditional travel planning requires hours of research and complex decision-making processes. Thanks to advanced AI algorithms, RotaAI understands your preferences, uses your location information, and creates custom routes for you. So you can focus only on exploring.'
      },
      features: {
        title: 'Our Features',
        personalization: {
          title: 'Personalization',
          desc: 'Custom routes based on your interests'
        },
        smart: {
          title: 'Smart Recommendations',
          desc: 'AI-powered location-based suggestions'
        },
        optimization: {
          title: 'Optimization',
          desc: 'Time and distance optimization'
        },
        community: {
          title: 'Community',
          desc: 'System that learns from user experiences'
        }
      },
      blog: {
        title: 'Blog & Guides',
        subtitle: 'Travel tips and destination guides',
        readMore: 'Read More',
        allArticles: 'All Articles'
      },
      cta: {
        title: 'Get Started Now',
        subtitle: 'Create your first route with AI',
        button: 'Create Plan'
      }
    }
  };

  const t = translations[language];

  const features = [
    {
      icon: <Target className="w-8 h-8 text-blue-600" />,
      title: t.features.personalization.title,
      desc: t.features.personalization.desc
    },
    {
      icon: <Brain className="w-8 h-8 text-purple-600" />,
      title: t.features.smart.title,
      desc: t.features.smart.desc
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-green-600" />,
      title: t.features.optimization.title,
      desc: t.features.optimization.desc
    },
    {
      icon: <Users className="w-8 h-8 text-orange-600" />,
      title: t.features.community.title,
      desc: t.features.community.desc
    }
  ];

  const blogPosts = [
    {
      id: 1,
      title: language === 'TR' ? 'İstanbul\'da 1 Günde Gezilecek 5 Yer' : 'Top 5 Places to Visit in Istanbul in 1 Day',
      excerpt: language === 'TR' 
        ? 'İstanbul\'un en ikonik yerlerini kısa sürede keşfetmek için rehberimiz.'
        : 'Our guide to discovering Istanbul\'s most iconic places in a short time.',
      date: language === 'TR' ? '5 Ekim 2025' : 'October 5, 2025',
      image: 'https://images.unsplash.com/photo-1692271731602-08778b94ef77?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpc3RhbmJ1bCUyMHRyYXZlbCUyMHRvdXJpc218ZW58MXx8fHwxNzYwMDQyNzcxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      id: 2,
      title: language === 'TR' ? 'Yapay Zekâ ile Seyahat Planlamanın Avantajları' : 'Benefits of AI-Powered Travel Planning',
      excerpt: language === 'TR'
        ? 'AI destekli seyahat planlaması nasıl zaman kazandırıyor?'
        : 'How AI-powered travel planning saves you time?',
      date: language === 'TR' ? '1 Ekim 2025' : 'October 1, 2025',
      image: 'https://images.unsplash.com/photo-1663660408776-abc66d76f611?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmNpZW50JTIwaGlzdG9yaWNhbCUyMGJ1aWxkaW5nfGVufDF8fHx8MTc2MDA0Mjc3Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      id: 3,
      title: language === 'TR' ? 'Doğa Tutkunları İçin En İyi Rotalar' : 'Best Routes for Nature Lovers',
      excerpt: language === 'TR'
        ? 'Türkiye\'nin en güzel doğa rotalarını keşfedin.'
        : 'Discover Turkey\'s most beautiful nature routes.',
      date: language === 'TR' ? '28 Eylül 2025' : 'September 28, 2025',
      image: 'https://images.unsplash.com/photo-1635148040718-acf281233b8e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXR1cmUlMjBsYW5kc2NhcGUlMjBtb3VudGFpbnN8ZW58MXx8fHwxNzU5OTg2NDk5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-gray-900 mb-4">{t.title}</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <Card>
                <CardContent className="p-8">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Target className="w-6 h-6 text-blue-600" />
                  </div>
                  <h2 className="text-gray-900 mb-4">{t.mission.title}</h2>
                  <p className="text-gray-600 leading-relaxed">
                    {t.mission.content}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-8">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <Brain className="w-6 h-6 text-purple-600" />
                  </div>
                  <h2 className="text-gray-900 mb-4">{t.whyAi.title}</h2>
                  <p className="text-gray-600 leading-relaxed">
                    {t.whyAi.content}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-center text-gray-900 mb-12">{t.features.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-center mb-4">{feature.icon}</div>
                  <h3 className="text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-4">
              <BookOpen className="w-4 h-4" />
              <span>{t.blog.title}</span>
            </div>
            <h2 className="text-gray-900 mb-2">{t.blog.title}</h2>
            <p className="text-gray-600">{t.blog.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-8">
            {blogPosts.map((post) => (
              <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gray-200">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <p className="text-gray-500 mb-2">{post.date}</p>
                  <h3 className="text-gray-900 mb-3">{post.title}</h3>
                  <p className="text-gray-600 mb-4">{post.excerpt}</p>
                  <Button variant="link" className="p-0">
                    {t.blog.readMore} →
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button variant="outline">{t.blog.allArticles}</Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-white mb-4">{t.cta.title}</h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            {t.cta.subtitle}
          </p>
          <Button
            size="lg"
            className="bg-white text-blue-600 hover:bg-gray-100"
            onClick={() => onNavigate('planner')}
          >
            {t.cta.button}
          </Button>
        </div>
      </section>
    </div>
  );
}

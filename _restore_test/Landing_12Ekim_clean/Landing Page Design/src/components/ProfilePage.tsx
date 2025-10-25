import { User, MapPin, Heart, Calendar, Settings, Bell, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Switch } from './ui/switch';

interface ProfilePageProps {
  language: 'TR' | 'EN';
  onNavigate: (page: string) => void;
}

export function ProfilePage({ language, onNavigate }: ProfilePageProps) {
  const translations = {
    TR: {
      title: 'Profilim',
      personalInfo: 'Kişisel Bilgiler',
      myPlans: 'Planlarım',
      favorites: 'Favorilerim',
      settings: 'Ayarlar',
      name: 'Ad Soyad',
      email: 'E-posta',
      phone: 'Telefon',
      age: 'Yaş',
      gender: 'Cinsiyet',
      maritalStatus: 'Medeni Durum',
      interests: 'İlgi Alanlarım',
      save: 'Kaydet',
      notifications: 'Bildirimler',
      emailNotifications: 'E-posta Bildirimleri',
      pushNotifications: 'Push Bildirimleri',
      aiReminders: 'AI Hatırlatmaları',
      recentPlans: 'Son Planlar',
      viewPlan: 'Planı Görüntüle',
      noPlans: 'Henüz plan oluşturmadınız',
      createPlan: 'Plan Oluştur',
      savedPlaces: 'Kayıtlı Yerler',
      noFavorites: 'Henüz favori yeriniz yok',
      explore: 'Keşfet'
    },
    EN: {
      title: 'My Profile',
      personalInfo: 'Personal Information',
      myPlans: 'My Plans',
      favorites: 'Favorites',
      settings: 'Settings',
      name: 'Full Name',
      email: 'Email',
      phone: 'Phone',
      age: 'Age',
      gender: 'Gender',
      maritalStatus: 'Marital Status',
      interests: 'My Interests',
      save: 'Save',
      notifications: 'Notifications',
      emailNotifications: 'Email Notifications',
      pushNotifications: 'Push Notifications',
      aiReminders: 'AI Reminders',
      recentPlans: 'Recent Plans',
      viewPlan: 'View Plan',
      noPlans: 'You haven\'t created any plans yet',
      createPlan: 'Create Plan',
      savedPlaces: 'Saved Places',
      noFavorites: 'You have no favorites yet',
      explore: 'Explore'
    }
  };

  const t = translations[language];

  const userInterests = [
    language === 'TR' ? 'Tarih' : 'History',
    language === 'TR' ? 'Doğa' : 'Nature',
    language === 'TR' ? 'Gastronomi' : 'Gastronomy',
    language === 'TR' ? 'Sanat' : 'Art'
  ];

  const mockPlans = [
    {
      id: 1,
      title: 'İstanbul Gezisi',
      titleEn: 'Istanbul Trip',
      date: '15 Ekim 2025',
      dateEn: 'October 15, 2025',
      stops: 5,
      duration: '8 saat',
      durationEn: '8 hours'
    },
    {
      id: 2,
      title: 'Kapadokya Macerası',
      titleEn: 'Cappadocia Adventure',
      date: '20 Ekim 2025',
      dateEn: 'October 20, 2025',
      stops: 6,
      duration: '10 saat',
      durationEn: '10 hours'
    }
  ];

  const mockFavorites = [
    {
      id: 1,
      name: 'Ayasofya',
      nameEn: 'Hagia Sophia',
      category: 'Tarihi',
      categoryEn: 'Historical',
      rating: 4.8
    },
    {
      id: 2,
      name: 'Kapadokya',
      nameEn: 'Cappadocia',
      category: 'Doğa',
      categoryEn: 'Nature',
      rating: 4.9
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header */}
          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <Avatar className="w-24 h-24">
                  <AvatarFallback className="text-2xl">AY</AvatarFallback>
                </Avatar>
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-gray-900 mb-2">Ahmet Yılmaz</h1>
                  <p className="text-gray-600 mb-3">ahmet.yilmaz@email.com</p>
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    {userInterests.map((interest, index) => (
                      <Badge key={index} variant="outline">{interest}</Badge>
                    ))}
                  </div>
                </div>
                <Button variant="outline" className="gap-2">
                  <Settings className="w-4 h-4" />
                  {language === 'TR' ? 'Profili Düzenle' : 'Edit Profile'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="info" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="info" className="gap-2">
                <User className="w-4 h-4" />
                {t.personalInfo}
              </TabsTrigger>
              <TabsTrigger value="plans" className="gap-2">
                <MapPin className="w-4 h-4" />
                {t.myPlans}
              </TabsTrigger>
              <TabsTrigger value="favorites" className="gap-2">
                <Heart className="w-4 h-4" />
                {t.favorites}
              </TabsTrigger>
              <TabsTrigger value="settings" className="gap-2">
                <Settings className="w-4 h-4" />
                {t.settings}
              </TabsTrigger>
            </TabsList>

            {/* Personal Info Tab */}
            <TabsContent value="info">
              <Card>
                <CardContent className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block mb-2 text-gray-700">{t.name}</label>
                      <Input defaultValue="Ahmet Yılmaz" />
                    </div>
                    <div>
                      <label className="block mb-2 text-gray-700">{t.email}</label>
                      <Input type="email" defaultValue="ahmet.yilmaz@email.com" />
                    </div>
                    <div>
                      <label className="block mb-2 text-gray-700">{t.phone}</label>
                      <Input type="tel" defaultValue="+90 555 123 4567" />
                    </div>
                    <div>
                      <label className="block mb-2 text-gray-700">{t.age}</label>
                      <Input type="number" defaultValue="28" />
                    </div>
                    <div>
                      <label className="block mb-2 text-gray-700">{t.gender}</label>
                      <Input defaultValue={language === 'TR' ? 'Erkek' : 'Male'} />
                    </div>
                    <div>
                      <label className="block mb-2 text-gray-700">{t.maritalStatus}</label>
                      <Input defaultValue={language === 'TR' ? 'Bekar' : 'Single'} />
                    </div>
                  </div>

                  <div>
                    <label className="block mb-3 text-gray-900">{t.interests}</label>
                    <div className="flex flex-wrap gap-2">
                      {['Tarih', 'Doğa', 'Gastronomi', 'Sanat', 'Alışveriş', 'Gece Hayatı'].map((interest, index) => (
                        <Badge key={index} className="cursor-pointer">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button>{t.save}</Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Plans Tab */}
            <TabsContent value="plans">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-gray-900">{t.recentPlans}</h2>
                  <Button onClick={() => onNavigate('planner')}>
                    {t.createPlan}
                  </Button>
                </div>

                {mockPlans.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {mockPlans.map((plan) => (
                      <Card key={plan.id} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          <h3 className="text-gray-900 mb-3">
                            {language === 'TR' ? plan.title : plan.titleEn}
                          </h3>
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-gray-600">
                              <Calendar className="w-4 h-4" />
                              <span>{language === 'TR' ? plan.date : plan.dateEn}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <MapPin className="w-4 h-4" />
                              <span>{plan.stops} {language === 'TR' ? 'durak' : 'stops'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Clock className="w-4 h-4" />
                              <span>{language === 'TR' ? plan.duration : plan.durationEn}</span>
                            </div>
                          </div>
                          <Button variant="outline" className="w-full">
                            {t.viewPlan}
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">{t.noPlans}</p>
                      <Button onClick={() => onNavigate('planner')}>
                        {t.createPlan}
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* Favorites Tab */}
            <TabsContent value="favorites">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-gray-900">{t.savedPlaces}</h2>
                  <Button onClick={() => onNavigate('discover')}>
                    {t.explore}
                  </Button>
                </div>

                {mockFavorites.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {mockFavorites.map((place) => (
                      <Card key={place.id} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-gray-900">
                              {language === 'TR' ? place.name : place.nameEn}
                            </h3>
                            <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                          </div>
                          <Badge variant="outline" className="mb-3">
                            {language === 'TR' ? place.category : place.categoryEn}
                          </Badge>
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-500">★</span>
                            <span className="text-gray-600">{place.rating}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">{t.noFavorites}</p>
                      <Button onClick={() => onNavigate('discover')}>
                        {t.explore}
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings">
              <Card>
                <CardContent className="p-6 space-y-6">
                  <div>
                    <h3 className="text-gray-900 mb-4 flex items-center gap-2">
                      <Bell className="w-5 h-5" />
                      {t.notifications}
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-gray-900">{t.emailNotifications}</p>
                          <p className="text-gray-600">
                            {language === 'TR' 
                              ? 'Önemli güncellemeler için e-posta alın'
                              : 'Receive emails for important updates'}
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-gray-900">{t.pushNotifications}</p>
                          <p className="text-gray-600">
                            {language === 'TR'
                              ? 'Mobil cihazınızda anlık bildirimler'
                              : 'Instant notifications on your mobile device'}
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-gray-900">{t.aiReminders}</p>
                          <p className="text-gray-600">
                            {language === 'TR'
                              ? 'AI tabanlı seyahat hatırlatmaları'
                              : 'AI-powered travel reminders'}
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

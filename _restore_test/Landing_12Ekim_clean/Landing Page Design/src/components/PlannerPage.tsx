import { useState } from 'react';
import { Calendar, Clock, Sparkles, Download, Share2, Save, MapPin, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Slider } from './ui/slider';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';

interface PlannerPageProps {
  language: 'TR' | 'EN';
  onNavigate: (page: string) => void;
}

export function PlannerPage({ language, onNavigate }: PlannerPageProps) {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState('');
  const [duration, setDuration] = useState([8]);
  const [interests, setInterests] = useState<string[]>([]);
  const [intensity, setIntensity] = useState('moderate');
  const [planGenerated, setPlanGenerated] = useState(false);

  const translations = {
    TR: {
      title: 'AI ile Plan Oluştur',
      step1: 'Tercihlerinizi Belirleyin',
      step2: 'AI Öneriniz Hazır',
      selectDate: 'Tarih Seçin',
      duration: 'Süre (Saat)',
      interests: 'İlgi Alanları',
      intensity: 'Gezi Yoğunluğu',
      intensityLevels: {
        relaxed: 'Rahat',
        moderate: 'Orta',
        intensive: 'Yoğun'
      },
      categories: {
        history: 'Tarih',
        nature: 'Doğa',
        gastronomy: 'Gastronomi',
        art: 'Sanat',
        shopping: 'Alışveriş',
        nightlife: 'Gece Hayatı',
        family: 'Aile',
        romantic: 'Romantik'
      },
      generatePlan: 'Plan Oluştur',
      yourPlan: 'Sizin İçin Oluşturulan Plan',
      downloadPdf: 'PDF İndir',
      sharePlan: 'Planı Paylaş',
      savePlan: 'Planı Kaydet',
      createNewPlan: 'Yeni Plan Oluştur',
      totalDuration: 'Toplam Süre',
      stops: 'Durak'
    },
    EN: {
      title: 'Create Plan with AI',
      step1: 'Set Your Preferences',
      step2: 'Your AI Recommendation is Ready',
      selectDate: 'Select Date',
      duration: 'Duration (Hours)',
      interests: 'Interests',
      intensity: 'Tour Intensity',
      intensityLevels: {
        relaxed: 'Relaxed',
        moderate: 'Moderate',
        intensive: 'Intensive'
      },
      categories: {
        history: 'History',
        nature: 'Nature',
        gastronomy: 'Gastronomy',
        art: 'Art',
        shopping: 'Shopping',
        nightlife: 'Nightlife',
        family: 'Family',
        romantic: 'Romantic'
      },
      generatePlan: 'Generate Plan',
      yourPlan: 'Your Custom Plan',
      downloadPdf: 'Download PDF',
      sharePlan: 'Share Plan',
      savePlan: 'Save Plan',
      createNewPlan: 'Create New Plan',
      totalDuration: 'Total Duration',
      stops: 'Stops'
    }
  };

  const t = translations[language];

  const interestOptions = [
    { id: 'history', label: t.categories.history },
    { id: 'nature', label: t.categories.nature },
    { id: 'gastronomy', label: t.categories.gastronomy },
    { id: 'art', label: t.categories.art },
    { id: 'shopping', label: t.categories.shopping },
    { id: 'nightlife', label: t.categories.nightlife },
    { id: 'family', label: t.categories.family },
    { id: 'romantic', label: t.categories.romantic }
  ];

  const toggleInterest = (interestId: string) => {
    setInterests(prev =>
      prev.includes(interestId)
        ? prev.filter(i => i !== interestId)
        : [...prev, interestId]
    );
  };

  const mockPlan = [
    {
      time: '09:00',
      duration: '1.5 saat',
      durationEn: '1.5 hours',
      place: 'Ayasofya',
      placeEn: 'Hagia Sophia',
      description: 'Tarihi camii ve müzeyi gezin',
      descriptionEn: 'Visit the historical mosque and museum'
    },
    {
      time: '11:00',
      duration: '1 saat',
      durationEn: '1 hour',
      place: 'Sultanahmet Meydanı',
      placeEn: 'Sultanahmet Square',
      description: 'Meydan ve çevresindeki tarihi yapıları keşfedin',
      descriptionEn: 'Explore the square and surrounding historical buildings'
    },
    {
      time: '12:30',
      duration: '1.5 saat',
      durationEn: '1.5 hours',
      place: 'Balat\'ta Kahve Molası',
      placeEn: 'Coffee Break in Balat',
      description: 'Renkli sokakları keşfedin ve yerel kahvede mola verin',
      descriptionEn: 'Explore colorful streets and have a break at a local café'
    },
    {
      time: '14:30',
      duration: '2 saat',
      durationEn: '2 hours',
      place: 'Topkapı Sarayı',
      placeEn: 'Topkapi Palace',
      description: 'Osmanlı İmparatorluğu\'nun kalbi olan sarayı gezin',
      descriptionEn: 'Tour the palace, heart of the Ottoman Empire'
    },
    {
      time: '17:00',
      duration: '1 saat',
      durationEn: '1 hour',
      place: 'Kapalıçarşı',
      placeEn: 'Grand Bazaar',
      description: 'Alışveriş yapın ve hediyelik eşya alın',
      descriptionEn: 'Shop and buy souvenirs'
    }
  ];

  const handleGeneratePlan = () => {
    // Simulate AI processing
    setTimeout(() => {
      setStep(2);
      setPlanGenerated(true);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full mb-4">
              <Sparkles className="w-4 h-4" />
              <span>AI Destekli</span>
            </div>
            <h1 className="text-gray-900 mb-2">{t.title}</h1>
            <p className="text-gray-600">
              {step === 1 ? t.step1 : t.step2}
            </p>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className={`flex items-center gap-2 ${step === 1 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step === 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}>
                1
              </div>
              <span>Tercihler</span>
            </div>
            <div className="w-12 h-0.5 bg-gray-300"></div>
            <div className={`flex items-center gap-2 ${step === 2 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step === 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}>
                2
              </div>
              <span>Planınız</span>
            </div>
          </div>

          {/* Step 1: Preferences Form */}
          {step === 1 && (
            <Card>
              <CardContent className="p-8 space-y-8">
                {/* Date Selection */}
                <div>
                  <label className="flex items-center gap-2 mb-3 text-gray-900">
                    <Calendar className="w-5 h-5" />
                    {t.selectDate}
                  </label>
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full"
                  />
                </div>

                {/* Duration */}
                <div>
                  <label className="flex items-center gap-2 mb-3 text-gray-900">
                    <Clock className="w-5 h-5" />
                    {t.duration}: {duration[0]} saat
                  </label>
                  <Slider
                    value={duration}
                    onValueChange={setDuration}
                    max={12}
                    min={2}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-gray-500 mt-2">
                    <span>2 saat</span>
                    <span>12 saat</span>
                  </div>
                </div>

                {/* Interests */}
                <div>
                  <label className="mb-3 text-gray-900 block">{t.interests}</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {interestOptions.map((option) => (
                      <div
                        key={option.id}
                        onClick={() => toggleInterest(option.id)}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          interests.includes(option.id)
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Checkbox
                          checked={interests.includes(option.id)}
                          onCheckedChange={() => toggleInterest(option.id)}
                          className="mb-2"
                        />
                        <p className="text-gray-900">{option.label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Intensity */}
                <div>
                  <label className="mb-3 text-gray-900 block">{t.intensity}</label>
                  <RadioGroup value={intensity} onValueChange={setIntensity}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div
                        onClick={() => setIntensity('relaxed')}
                        className={`p-4 border-2 rounded-lg cursor-pointer ${
                          intensity === 'relaxed' ? 'border-blue-600 bg-blue-50' : 'border-gray-200'
                        }`}
                      >
                        <RadioGroupItem value="relaxed" id="relaxed" className="mb-2" />
                        <label htmlFor="relaxed" className="text-gray-900 cursor-pointer block">
                          {t.intensityLevels.relaxed}
                        </label>
                        <p className="text-gray-600 mt-1">
                          {language === 'TR' ? 'Yavaş tempo, bol mola' : 'Slow pace, many breaks'}
                        </p>
                      </div>
                      <div
                        onClick={() => setIntensity('moderate')}
                        className={`p-4 border-2 rounded-lg cursor-pointer ${
                          intensity === 'moderate' ? 'border-blue-600 bg-blue-50' : 'border-gray-200'
                        }`}
                      >
                        <RadioGroupItem value="moderate" id="moderate" className="mb-2" />
                        <label htmlFor="moderate" className="text-gray-900 cursor-pointer block">
                          {t.intensityLevels.moderate}
                        </label>
                        <p className="text-gray-600 mt-1">
                          {language === 'TR' ? 'Dengeli tempo' : 'Balanced pace'}
                        </p>
                      </div>
                      <div
                        onClick={() => setIntensity('intensive')}
                        className={`p-4 border-2 rounded-lg cursor-pointer ${
                          intensity === 'intensive' ? 'border-blue-600 bg-blue-50' : 'border-gray-200'
                        }`}
                      >
                        <RadioGroupItem value="intensive" id="intensive" className="mb-2" />
                        <label htmlFor="intensive" className="text-gray-900 cursor-pointer block">
                          {t.intensityLevels.intensive}
                        </label>
                        <p className="text-gray-600 mt-1">
                          {language === 'TR' ? 'Hızlı tempo, çok nokta' : 'Fast pace, many stops'}
                        </p>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <Button
                  className="w-full gap-2 py-6"
                  onClick={handleGeneratePlan}
                  disabled={!selectedDate || interests.length === 0}
                >
                  <Sparkles className="w-5 h-5" />
                  {t.generatePlan}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Generated Plan */}
          {step === 2 && planGenerated && (
            <div className="space-y-6">
              {/* Action Buttons */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-wrap gap-3 justify-between items-center">
                    <div>
                      <h2 className="text-gray-900">{t.yourPlan}</h2>
                      <p className="text-gray-600">
                        {mockPlan.length} {t.stops} • {duration[0]} {language === 'TR' ? 'saat' : 'hours'}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="gap-2">
                        <Download className="w-4 h-4" />
                        {t.downloadPdf}
                      </Button>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Share2 className="w-4 h-4" />
                        {t.sharePlan}
                      </Button>
                      <Button size="sm" className="gap-2">
                        <Save className="w-4 h-4" />
                        {t.savePlan}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Plan Timeline */}
              <div className="space-y-4">
                {mockPlan.map((item, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0">
                            <span>{item.time}</span>
                          </div>
                          {index < mockPlan.length - 1 && (
                            <div className="w-0.5 h-full bg-blue-200 mt-2"></div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-gray-900">
                                {language === 'TR' ? item.place : item.placeEn}
                              </h3>
                              <div className="flex items-center gap-2 text-gray-600 mt-1">
                                <Clock className="w-4 h-4" />
                                <span>{language === 'TR' ? item.duration : item.durationEn}</span>
                              </div>
                            </div>
                            <Badge variant="outline">#{index + 1}</Badge>
                          </div>
                          <p className="text-gray-600">
                            {language === 'TR' ? item.description : item.descriptionEn}
                          </p>
                          <div className="flex items-center gap-2 mt-3">
                            <Button variant="outline" size="sm" className="gap-1">
                              <MapPin className="w-4 h-4" />
                              {language === 'TR' ? 'Haritada Göster' : 'Show on Map'}
                            </Button>
                            <Button variant="link" size="sm" className="gap-1">
                              {language === 'TR' ? 'Detaylar' : 'Details'}
                              <ArrowRight className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Create New Plan Button */}
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setStep(1);
                  setPlanGenerated(false);
                  setSelectedDate('');
                  setInterests([]);
                }}
              >
                {t.createNewPlan}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

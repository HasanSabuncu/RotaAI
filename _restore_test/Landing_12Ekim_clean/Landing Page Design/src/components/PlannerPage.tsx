// frontend/src/components/PlannerPage.tsx
import { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Sparkles,
  Download,
  Share2,
  Save,
  MapPin,
  ArrowRight
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Slider } from './ui/slider';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';

import {
  generatePlan,
  type PlanResponseDto
} from '../lib/api';

interface PlannerPageProps {
  language: 'TR' | 'EN';
  onNavigate: (page: string) => void;
}

export function PlannerPage({ language, onNavigate }: PlannerPageProps) {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState('');
  const [duration, setDuration] = useState([8]);
  const [interests, setInterests] = useState<string[]>([]);
  const [intensity, setIntensity] = useState<'relaxed' | 'moderate' | 'intensive'>('moderate');
  const [region, setRegion] = useState<'nearby' | 'city'>('nearby');

  const [planGenerated, setPlanGenerated] = useState(false);
  const [plan, setPlan] = useState<PlanResponseDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Son oluşturulan planın mekanlarını tut (tekrarda aynı yerleri vermemek için)
  const [lastPlaceIds, setLastPlaceIds] = useState<string[]>([]);

  // Sayfa açılınca localStorage'dan önceki plan mekanlarını al
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const raw = localStorage.getItem('rotaai_last_plan_places');
    if (raw) {
      try {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr)) setLastPlaceIds(arr);
      } catch {
        // geçersiz json ise umursama
      }
    }
  }, []);

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
      regionTitle: 'Rota Bölgesi',
      regionOptions: {
        nearby: 'Yakınımdaki Yerler',
        city: 'İzmir Geneli'
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
      generating: 'Plan Oluşturuluyor...',
      yourPlan: 'Sizin İçin Oluşturulan Plan',
      downloadPdf: 'PDF İndir',
      sharePlan: 'Planı Paylaş',
      savePlan: 'Planı Kaydet',
      createNewPlan: 'Yeni Plan Oluştur',
      totalDuration: 'Toplam Süre',
      stops: 'Durak',
      error: 'Plan oluşturulamadı. Lütfen tekrar deneyin.'
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
      regionTitle: 'Route Area',
      regionOptions: {
        nearby: 'Near Me',
        city: 'Whole Izmir'
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
      generating: 'Generating Plan...',
      yourPlan: 'Your Custom Plan',
      downloadPdf: 'Download PDF',
      sharePlan: 'Share Plan',
      savePlan: 'Save Plan',
      createNewPlan: 'Create New Plan',
      totalDuration: 'Total Duration',
      stops: 'Stops',
      error: 'Failed to generate plan. Please try again.'
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
    setInterests((prev) =>
      prev.includes(interestId)
        ? prev.filter((i) => i !== interestId)
        : [...prev, interestId]
    );
  };

  // ---- Konum alma helper'ı ----
  const getUserLocation = (): Promise<{ lat?: number; lng?: number }> => {
    if (typeof navigator === 'undefined' || !('geolocation' in navigator)) {
      return Promise.resolve({});
    }

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          resolve({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          });
        },
        () => resolve({}),
        { enableHighAccuracy: true, timeout: 8000 }
      );
    });
  };

  // ---- GPT ile plan oluşturma ----
  const handleGeneratePlan = async () => {
    setError(null);
    setLoading(true);

    try {
      const loc = await getUserLocation();

      const payload = {
        startLat: loc.lat,
        startLng: loc.lng,
        durationHours: duration[0],
        interests,
        intensity,
        language,
        date: selectedDate ? new Date(selectedDate).toISOString() : undefined,
        region,
        excludePlaceIds: lastPlaceIds   // önceki plandaki mekanları backend'e gönder
      } as const;

      const result = await generatePlan(payload);

      setPlan(result);
      setStep(2);
      setPlanGenerated(true);

      // Yeni planın placeId'lerini sakla ki bir dahaki planda elensin
      const newIds = result.stops.map((s) => s.placeId).filter(Boolean);
      setLastPlaceIds(newIds);
      if (typeof window !== 'undefined') {
        localStorage.setItem('rotaai_last_plan_places', JSON.stringify(newIds));
      }
    } catch (e) {
      console.error(e);
      setError(t.error);
    } finally {
      setLoading(false);
    }
  };

  const resetPlanner = () => {
    setStep(1);
    setPlanGenerated(false);
    setPlan(null);
    setSelectedDate('');
    setInterests([]);
    setIntensity('moderate');
    setRegion('nearby');
    setError(null);
  };

  const totalHoursFromPlan = plan
    ? Math.round((plan.totalDurationMinutes / 60) * 10) / 10
    : duration[0];

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
            <div
              className={`flex items-center gap-2 ${
                step === 1 ? 'text-blue-600' : 'text-gray-400'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step === 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'
                }`}
              >
                1
              </div>
              <span>Tercihler</span>
            </div>
            <div className="w-12 h-0.5 bg-gray-300" />
            <div
              className={`flex items-center gap-2 ${
                step === 2 ? 'text-blue-600' : 'text-gray-400'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step === 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'
                }`}
              >
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
                    {t.duration}: {duration[0]}{' '}
                    {language === 'TR' ? 'saat' : 'hours'}
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
                  <label className="mb-3 text-gray-900 block">
                    {t.interests}
                  </label>
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
                  <label className="mb-3 text-gray-900 block">
                    {t.intensity}
                  </label>
                  <RadioGroup
                    value={intensity}
                    onValueChange={(val) =>
                      setIntensity(val as 'relaxed' | 'moderate' | 'intensive')
                    }
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div
                        onClick={() => setIntensity('relaxed')}
                        className={`p-4 border-2 rounded-lg cursor-pointer ${
                          intensity === 'relaxed'
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200'
                        }`}
                      >
                        <RadioGroupItem
                          value="relaxed"
                          id="relaxed"
                          className="mb-2"
                        />
                        <label
                          htmlFor="relaxed"
                          className="text-gray-900 cursor-pointer block"
                        >
                          {t.intensityLevels.relaxed}
                        </label>
                        <p className="text-gray-600 mt-1">
                          {language === 'TR'
                            ? 'Yavaş tempo, bol mola'
                            : 'Slow pace, many breaks'}
                        </p>
                      </div>
                      <div
                        onClick={() => setIntensity('moderate')}
                        className={`p-4 border-2 rounded-lg cursor-pointer ${
                          intensity === 'moderate'
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200'
                        }`}
                      >
                        <RadioGroupItem
                          value="moderate"
                          id="moderate"
                          className="mb-2"
                        />
                        <label
                          htmlFor="moderate"
                          className="text-gray-900 cursor-pointer block"
                        >
                          {t.intensityLevels.moderate}
                        </label>
                        <p className="text-gray-600 mt-1">
                          {language === 'TR'
                            ? 'Dengeli tempo'
                            : 'Balanced pace'}
                        </p>
                      </div>
                      <div
                        onClick={() => setIntensity('intensive')}
                        className={`p-4 border-2 rounded-lg cursor-pointer ${
                          intensity === 'intensive'
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200'
                        }`}
                      >
                        <RadioGroupItem
                          value="intensive"
                          id="intensive"
                          className="mb-2"
                        />
                        <label
                          htmlFor="intensive"
                          className="text-gray-900 cursor-pointer block"
                        >
                          {t.intensityLevels.intensive}
                        </label>
                        <p className="text-gray-600 mt-1">
                          {language === 'TR'
                            ? 'Hızlı tempo, çok nokta'
                            : 'Fast pace, many stops'}
                        </p>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                {/* Route Region */}
                <div>
                  <label className="mb-3 text-gray-900 block">
                    {t.regionTitle}
                  </label>
                  <RadioGroup
                    value={region}
                    onValueChange={(val) =>
                      setRegion(val as 'nearby' | 'city')
                    }
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div
                        onClick={() => setRegion('nearby')}
                        className={`p-4 border-2 rounded-lg cursor-pointer ${
                          region === 'nearby'
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200'
                        }`}
                      >
                        <RadioGroupItem
                          value="nearby"
                          id="nearby"
                          className="mb-2"
                        />
                        <label
                          htmlFor="nearby"
                          className="text-gray-900 cursor-pointer block"
                        >
                          {t.regionOptions.nearby}
                        </label>
                        <p className="text-gray-600 mt-1 text-sm">
                          {language === 'TR'
                            ? 'Konumuna yakın, yürünebilir rota'
                            : 'Walkable route around your location'}
                        </p>
                      </div>

                      <div
                        onClick={() => setRegion('city')}
                        className={`p-4 border-2 rounded-lg cursor-pointer ${
                          region === 'city'
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200'
                        }`}
                      >
                        <RadioGroupItem
                          value="city"
                          id="city"
                          className="mb-2"
                        />
                        <label
                          htmlFor="city"
                          className="text-gray-900 cursor-pointer block"
                        >
                          {t.regionOptions.city}
                        </label>
                        <p className="text-gray-600 mt-1 text-sm">
                          {language === 'TR'
                            ? 'Tüm İzmirde farklı bölgeleri kapsayan rota'
                            : 'Route covering different areas of Izmir'}
                        </p>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                {error && (
                  <p className="text-red-600 text-sm">{error}</p>
                )}

                <Button
                  className="w-full gap-2 py-6"
                  onClick={handleGeneratePlan}
                  disabled={
                    !selectedDate || interests.length === 0 || loading
                  }
                >
                  <Sparkles className="w-5 h-5" />
                  {loading ? t.generating : t.generatePlan}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Generated Plan */}
          {step === 2 && planGenerated && plan && (
            <div className="space-y-6">
              {/* Action Buttons */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-wrap gap-3 justify-between items-center">
                    <div>
                      <h2 className="text-gray-900">{t.yourPlan}</h2>
                      <p className="text-gray-600">
                        {plan.stops.length} {t.stops} •{' '}
                        {t.totalDuration}:{' '}
                        {totalHoursFromPlan}{' '}
                        {language === 'TR' ? 'saat' : 'hours'}
                      </p>
                      <p className="text-gray-600 mt-2 text-sm">
                        {language === 'TR'
                          ? plan.summaryTr
                          : plan.summaryEn}
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
                {plan.stops
                  .slice()
                  .sort((a, b) => a.order - b.order)
                  .map((item, index) => (
                    <Card
                      key={item.placeId + '-' + item.order}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-6">
                        <div className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0">
                              <span>{item.time}</span>
                            </div>
                            {index < plan.stops.length - 1 && (
                              <div className="w-0.5 h-full bg-blue-200 mt-2" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="text-gray-900">
                                  {language === 'TR'
                                    ? item.placeNameTr
                                    : item.placeNameEn}
                                </h3>
                                <div className="flex items-center gap-2 text-gray-600 mt-1">
                                  <Clock className="w-4 h-4" />
                                  <span>
                                    {language === 'TR'
                                      ? item.durationTr
                                      : item.durationEn}
                                  </span>
                                </div>
                              </div>
                              <Badge variant="outline">
                                #{item.order}
                              </Badge>
                            </div>
                            <p className="text-gray-600">
                              {language === 'TR'
                                ? item.descriptionTr
                                : item.descriptionEn}
                            </p>
                            <div className="flex items-center gap-2 mt-3">
                              <Button
                                variant="outline"
                                size="sm"
                                className="gap-1"
                              >
                                <MapPin className="w-4 h-4" />
                                {language === 'TR'
                                  ? 'Haritada Göster'
                                  : 'Show on Map'}
                              </Button>
                              <Button
                                variant="link"
                                size="sm"
                                className="gap-1"
                              >
                                {language === 'TR'
                                  ? 'Detaylar'
                                  : 'Details'}
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
                onClick={resetPlanner}
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

import { User, Save, Settings, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';
import { AnimatedSection } from './AnimatedSection';
import { motion } from 'motion/react';
import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface EnhancedProfilePageProps {
  language: 'TR' | 'EN';
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export function EnhancedProfilePage({ language, onNavigate, onLogout }: EnhancedProfilePageProps) {
  const [name, setName] = useState('Ahmet Yılmaz');
  const [email, setEmail] = useState('ahmet.yilmaz@email.com');
  const [phone, setPhone] = useState('+90 555 123 4567');
  const [age, setAge] = useState('28');
  const [gender, setGender] = useState('male');
  const [maritalStatus, setMaritalStatus] = useState('single');
  const [disability, setDisability] = useState('none');

  const translations = {
    TR: {
      title: 'Hesabım',
      subtitle: 'Profilinizi yönetin',
      personalInfo: 'Kişisel Bilgiler',
      name: 'Ad Soyad',
      email: 'E-posta',
      phone: 'Telefon',
      age: 'Yaş',
      gender: 'Cinsiyet',
      genderOptions: {
        male: 'Erkek',
        female: 'Kadın',
        other: 'Diğer',
        prefer_not: 'Belirtmek İstemiyorum'
      },
      maritalStatus: 'Medeni Durum',
      maritalOptions: {
        single: 'Bekar',
        married: 'Evli',
        divorced: 'Boşanmış',
        widowed: 'Dul'
      },
      disability: 'Engel Durumu',
      disabilityOptions: {
        none: 'Yok',
        physical: 'Fiziksel Engel',
        visual: 'Görme Engeli',
        hearing: 'İşitme Engeli',
        cognitive: 'Bilişsel Engel',
        other: 'Diğer'
      },
      save: 'Kaydet',
      logout: 'Çıkış Yap',
      saveSuccess: 'Bilgileriniz başarıyla kaydedildi!'
    },
    EN: {
      title: 'My Account',
      subtitle: 'Manage your profile',
      personalInfo: 'Personal Information',
      name: 'Full Name',
      email: 'Email',
      phone: 'Phone',
      age: 'Age',
      gender: 'Gender',
      genderOptions: {
        male: 'Male',
        female: 'Female',
        other: 'Other',
        prefer_not: 'Prefer Not to Say'
      },
      maritalStatus: 'Marital Status',
      maritalOptions: {
        single: 'Single',
        married: 'Married',
        divorced: 'Divorced',
        widowed: 'Widowed'
      },
      disability: 'Disability Status',
      disabilityOptions: {
        none: 'None',
        physical: 'Physical Disability',
        visual: 'Visual Impairment',
        hearing: 'Hearing Impairment',
        cognitive: 'Cognitive Disability',
        other: 'Other'
      },
      save: 'Save',
      logout: 'Logout',
      saveSuccess: 'Your information has been saved successfully!'
    }
  };

  const t = translations[language];

  const handleSave = () => {
    // Save logic here
    alert(t.saveSuccess);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 pb-20 md:pb-8">
      <div className="container mx-auto px-4 py-6">
        {/* Profile Header */}
        <AnimatedSection>
          <Card className="glass-morphism border-0 mb-6">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="relative"
                >
                  <Avatar className="w-20 h-20">
                    <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-600 to-purple-600 text-white">
                      {name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 border-2 border-white rounded-full"></div>
                </motion.div>
                <div className="flex-1">
                  <h2 className="text-gray-900">{name}</h2>
                  <p className="text-gray-600">{email}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onLogout}
                  className="text-red-600"
                >
                  <LogOut className="w-5 h-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </AnimatedSection>

        {/* Personal Information Form */}
        <AnimatedSection delay={0.1}>
          <Card className="glass-morphism border-0">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-blue-600" />
                <h3 className="text-gray-900">{t.personalInfo}</h3>
              </div>

              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block mb-2 text-gray-700">{t.name}</label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="glass-morphism border-0"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block mb-2 text-gray-700">{t.email}</label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="glass-morphism border-0"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block mb-2 text-gray-700">{t.phone}</label>
                  <Input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="glass-morphism border-0"
                  />
                </div>

                {/* Age */}
                <div>
                  <label className="block mb-2 text-gray-700">{t.age}</label>
                  <Input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="glass-morphism border-0"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="block mb-2 text-gray-700">{t.gender}</label>
                  <Select value={gender} onValueChange={setGender}>
                    <SelectTrigger className="glass-morphism border-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">{t.genderOptions.male}</SelectItem>
                      <SelectItem value="female">{t.genderOptions.female}</SelectItem>
                      <SelectItem value="other">{t.genderOptions.other}</SelectItem>
                      <SelectItem value="prefer_not">{t.genderOptions.prefer_not}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Marital Status */}
                <div>
                  <label className="block mb-2 text-gray-700">{t.maritalStatus}</label>
                  <Select value={maritalStatus} onValueChange={setMaritalStatus}>
                    <SelectTrigger className="glass-morphism border-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">{t.maritalOptions.single}</SelectItem>
                      <SelectItem value="married">{t.maritalOptions.married}</SelectItem>
                      <SelectItem value="divorced">{t.maritalOptions.divorced}</SelectItem>
                      <SelectItem value="widowed">{t.maritalOptions.widowed}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Disability Status */}
                <div>
                  <label className="block mb-2 text-gray-700">{t.disability}</label>
                  <Select value={disability} onValueChange={setDisability}>
                    <SelectTrigger className="glass-morphism border-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">{t.disabilityOptions.none}</SelectItem>
                      <SelectItem value="physical">{t.disabilityOptions.physical}</SelectItem>
                      <SelectItem value="visual">{t.disabilityOptions.visual}</SelectItem>
                      <SelectItem value="hearing">{t.disabilityOptions.hearing}</SelectItem>
                      <SelectItem value="cognitive">{t.disabilityOptions.cognitive}</SelectItem>
                      <SelectItem value="other">{t.disabilityOptions.other}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Save Button */}
              <Button
                onClick={handleSave}
                className="w-full mt-6"
              >
                <Save className="w-5 h-5 mr-2" />
                {t.save}
              </Button>
            </CardContent>
          </Card>
        </AnimatedSection>
      </div>
    </div>
  );
}

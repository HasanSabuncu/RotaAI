import { useState } from 'react';
import { Mail, Lock, User, Facebook, Chrome } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';

interface AuthPageProps {
  language: 'TR' | 'EN';
  onNavigate: (page: string) => void;
}

export function AuthPage({ language, onNavigate }: AuthPageProps) {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');

  const translations = {
    TR: {
      login: 'Giriş Yap',
      register: 'Kayıt Ol',
      email: 'E-posta',
      password: 'Şifre',
      name: 'Ad Soyad',
      loginButton: 'Giriş Yap',
      registerButton: 'Kayıt Ol',
      forgotPassword: 'Şifremi Unuttum?',
      orContinueWith: 'veya devam et',
      google: 'Google ile Devam Et',
      facebook: 'Facebook ile Devam Et',
      noAccount: 'Hesabınız yok mu?',
      hasAccount: 'Zaten hesabınız var mı?',
      signUp: 'Kayıt olun',
      signIn: 'Giriş yapın',
      welcome: 'Hoş Geldiniz',
      welcomeBack: 'Tekrar Hoş Geldiniz',
      subtitle: 'Yapay zekâ ile seyahat planlamaya başlayın',
      subtitleLogin: 'Hesabınıza giriş yapın ve planlamaya devam edin'
    },
    EN: {
      login: 'Login',
      register: 'Register',
      email: 'Email',
      password: 'Password',
      name: 'Full Name',
      loginButton: 'Login',
      registerButton: 'Register',
      forgotPassword: 'Forgot Password?',
      orContinueWith: 'or continue with',
      google: 'Continue with Google',
      facebook: 'Continue with Facebook',
      noAccount: 'Don\'t have an account?',
      hasAccount: 'Already have an account?',
      signUp: 'Sign up',
      signIn: 'Sign in',
      welcome: 'Welcome',
      welcomeBack: 'Welcome Back',
      subtitle: 'Start planning your trips with AI',
      subtitleLogin: 'Login to your account and continue planning'
    }
  };

  const t = translations[language];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login
    onNavigate('home');
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate registration
    onNavigate('home');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl">RA</span>
              </div>
              <span className="text-2xl text-gray-900">RotaAI</span>
            </div>
          </div>

          <Card>
            <CardContent className="p-8">
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8">
                  <TabsTrigger value="login">{t.login}</TabsTrigger>
                  <TabsTrigger value="register">{t.register}</TabsTrigger>
                </TabsList>

                {/* Login Tab */}
                <TabsContent value="login">
                  <div className="text-center mb-6">
                    <h2 className="text-gray-900 mb-2">{t.welcomeBack}</h2>
                    <p className="text-gray-600">{t.subtitleLogin}</p>
                  </div>

                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <label className="block mb-2 text-gray-700">{t.email}</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                          type="email"
                          placeholder="ornek@email.com"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          className="pl-11"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block mb-2 text-gray-700">{t.password}</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                          type="password"
                          placeholder="••••••••"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          className="pl-11"
                          required
                        />
                      </div>
                    </div>

                    <div className="text-right">
                      <Button variant="link" className="p-0 h-auto">
                        {t.forgotPassword}
                      </Button>
                    </div>

                    <Button type="submit" className="w-full">
                      {t.loginButton}
                    </Button>
                  </form>

                  <div className="mt-6">
                    <div className="relative">
                      <Separator className="my-4" />
                      <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-gray-500">
                        {t.orContinueWith}
                      </span>
                    </div>

                    <div className="space-y-3 mt-6">
                      <Button variant="outline" className="w-full gap-2" type="button">
                        <Chrome className="w-5 h-5" />
                        {t.google}
                      </Button>
                      <Button variant="outline" className="w-full gap-2" type="button">
                        <Facebook className="w-5 h-5" />
                        {t.facebook}
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                {/* Register Tab */}
                <TabsContent value="register">
                  <div className="text-center mb-6">
                    <h2 className="text-gray-900 mb-2">{t.welcome}</h2>
                    <p className="text-gray-600">{t.subtitle}</p>
                  </div>

                  <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                      <label className="block mb-2 text-gray-700">{t.name}</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                          type="text"
                          placeholder="Ahmet Yılmaz"
                          value={registerName}
                          onChange={(e) => setRegisterName(e.target.value)}
                          className="pl-11"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block mb-2 text-gray-700">{t.email}</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                          type="email"
                          placeholder="ornek@email.com"
                          value={registerEmail}
                          onChange={(e) => setRegisterEmail(e.target.value)}
                          className="pl-11"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block mb-2 text-gray-700">{t.password}</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                          type="password"
                          placeholder="••••••••"
                          value={registerPassword}
                          onChange={(e) => setRegisterPassword(e.target.value)}
                          className="pl-11"
                          required
                        />
                      </div>
                    </div>

                    <Button type="submit" className="w-full">
                      {t.registerButton}
                    </Button>
                  </form>

                  <div className="mt-6">
                    <div className="relative">
                      <Separator className="my-4" />
                      <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-gray-500">
                        {t.orContinueWith}
                      </span>
                    </div>

                    <div className="space-y-3 mt-6">
                      <Button variant="outline" className="w-full gap-2" type="button">
                        <Chrome className="w-5 h-5" />
                        {t.google}
                      </Button>
                      <Button variant="outline" className="w-full gap-2" type="button">
                        <Facebook className="w-5 h-5" />
                        {t.facebook}
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useLanguage } from '@/hooks/useLanguage';
import { HelpCircle, Check } from 'lucide-react';
import walletIllustration from '@assets/generated_images/digital_wallet_app_illustration.png';

export default function Register() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { t } = useLanguage();
  const queryClient = useQueryClient();

  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    referralCode: ''
  });

  const [selectedCountry, setSelectedCountry] = useState({
    code: '+212',
    flag: '🇲🇦',
    name: 'Morocco'
  });

  const countries = [
    { code: '+212', flag: '🇲🇦', name: 'Morocco' },
    { code: '+213', flag: '🇩🇿', name: 'Algeria' },
    { code: '+216', flag: '🇹🇳', name: 'Tunisia' },
    { code: '+218', flag: '🇱🇾', name: 'Libya' },
    { code: '+20', flag: '🇪🇬', name: 'Egypt' },
    { code: '+249', flag: '🇸🇩', name: 'Sudan' },
    { code: '+966', flag: '🇸🇦', name: 'Saudi Arabia' },
    { code: '+971', flag: '🇦🇪', name: 'UAE' },
    { code: '+962', flag: '🇯🇴', name: 'Jordan' },
    { code: '+961', flag: '🇱🇧', name: 'Lebanon' },
    { code: '+965', flag: '🇰🇼', name: 'Kuwait' },
    { code: '+974', flag: '🇶🇦', name: 'Qatar' },
    { code: '+1', flag: '🇺🇸', name: 'United States' },
    { code: '+44', flag: '🇬🇧', name: 'United Kingdom' },
    { code: '+33', flag: '🇫🇷', name: 'France' },
    { code: '+49', flag: '🇩🇪', name: 'Germany' },
    { code: '+34', flag: '🇪🇸', name: 'Spain' },
    { code: '+39', flag: '🇮🇹', name: 'Italy' },
    { code: '+90', flag: '🇹🇷', name: 'Turkey' },
    { code: '+91', flag: '🇮🇳', name: 'India' },
    { code: '+86', flag: '🇨🇳', name: 'China' },
    { code: '+81', flag: '🇯🇵', name: 'Japan' },
    { code: '+82', flag: '🇰🇷', name: 'South Korea' },
    { code: '+55', flag: '🇧🇷', name: 'Brazil' },
    { code: '+52', flag: '🇲🇽', name: 'Mexico' },
    { code: '+27', flag: '🇿🇦', name: 'South Africa' },
    { code: '+234', flag: '🇳🇬', name: 'Nigeria' },
    { code: '+254', flag: '🇰🇪', name: 'Kenya' },
    { code: '+61', flag: '🇦🇺', name: 'Australia' },
    { code: '+64', flag: '🇳🇿', name: 'New Zealand' },
  ];

  const registerMutation = useMutation({
    mutationFn: async (data: { firstName: string; lastName: string; email: string; phone: string; password: string; referralCode?: string }) => {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: data.email,
          email: data.email,
          phone: data.phone,
          password: data.password,
          firstName: data.firstName,
          lastName: data.lastName
        }),
      });
      if (!response.ok) throw new Error('Failed to create account');
      return response.json();
    },
    onSuccess: async () => {
      toast({
        title: t('welcome'),
        description: t('accountCreated'),
      });
      
      await queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      
      setTimeout(() => {
        setLocation('/dashboard');
      }, 100);
    },
    onError: (error: any) => {
      toast({
        title: t('accountCreationError'),
        description: error.message || t('tryAgain'),
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.password) {
      toast({
        title: t('incompleteData'),
        description: t('fillAllFields'),
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: t('weakPassword'),
        description: t('passwordMinLength'),
        variant: "destructive",
      });
      return;
    }

    registerMutation.mutate({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: selectedCountry.code + formData.phone,
      password: formData.password,
      referralCode: formData.referralCode || undefined
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const bgColor = '#0f0a19';

  return (
    <div 
      className="fixed inset-0 overflow-y-auto"
      style={{ backgroundColor: bgColor }}
    >
      <div className="min-h-full flex flex-col" style={{ backgroundColor: bgColor }}>
        {/* Top Section with Logo and Illustration */}
        <div className="flex-shrink-0 pt-8 pb-4 px-4 text-center" style={{ backgroundColor: bgColor }}>
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">W</span>
            </div>
            <span className="text-white font-bold text-xl tracking-wide">WALLET<span className="text-purple-400">PAY</span></span>
          </div>

          {/* Illustration Area */}
          <div className="relative w-full max-w-xs mx-auto h-32 flex items-center justify-center">
            <img 
              src={walletIllustration} 
              alt="Digital Wallet" 
              className="w-36 h-36 object-contain drop-shadow-2xl"
            />
          </div>
        </div>

        {/* Form Section */}
        <div className="flex-1 px-6 pt-6 pb-20" style={{ backgroundColor: bgColor }}>
          {/* Header with Help Icon */}
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-white text-2xl font-semibold">{t('createNewAccount')}</h2>
            <button className="text-gray-400 hover:text-white transition-colors">
              <HelpCircle className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* First Name Field */}
            <div className="space-y-2">
              <Label className="text-gray-400 text-sm font-medium">
                {t('firstName')}
              </Label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="w-full h-14 rounded-xl text-lg px-4 pr-12 outline-none focus:ring-2 focus:ring-purple-500"
                  style={{ backgroundColor: '#1f1730', border: '1px solid #2a2040', color: 'white' }}
                  placeholder={t('enterFirstName')}
                  data-testid="input-firstname"
                />
                {formData.firstName && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Last Name Field */}
            <div className="space-y-2">
              <Label className="text-gray-400 text-sm font-medium">
                {t('lastName')}
              </Label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="w-full h-14 rounded-xl text-lg px-4 pr-12 outline-none focus:ring-2 focus:ring-purple-500"
                  style={{ backgroundColor: '#1f1730', border: '1px solid #2a2040', color: 'white' }}
                  placeholder={t('enterLastName')}
                  data-testid="input-lastname"
                />
                {formData.lastName && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label className="text-gray-400 text-sm font-medium">
                {t('email')}
              </Label>
              <div className="relative">
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full h-14 rounded-xl text-lg px-4 pr-12 outline-none focus:ring-2 focus:ring-purple-500"
                  style={{ backgroundColor: '#1f1730', border: '1px solid #2a2040', color: 'white' }}
                  placeholder={t('enterEmail')}
                  data-testid="input-email"
                />
                {formData.email && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Phone Number Field */}
            <div className="space-y-2">
              <Label className="text-gray-400 text-sm font-medium">
                {t('phoneNumber')}
              </Label>
              <div className="flex rounded-xl overflow-hidden" style={{ backgroundColor: '#1f1730', border: '1px solid #2a2040' }}>
                {/* Country Code Selector */}
                <div className="relative">
                  <select
                    value={selectedCountry.code}
                    onChange={(e) => {
                      const country = countries.find(c => c.code === e.target.value);
                      if (country) setSelectedCountry(country);
                    }}
                    className="h-14 pl-3 pr-8 bg-[#2a2040] border-r border-[#2a2040] text-white text-sm font-medium appearance-none cursor-pointer hover:bg-[#352850] transition-colors"
                    style={{ backgroundColor: '#2a2040' }}
                  >
                    {countries.map((country, index) => (
                      <option key={`${country.code}-${country.name}-${index}`} value={country.code}>
                        {country.flag} {country.code}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                
                {/* Phone Number Input */}
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="flex-1 h-14 px-4 bg-transparent text-white text-lg outline-none focus:ring-0"
                  placeholder={t('enterPhoneNumber')}
                  data-testid="input-phone"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label className="text-gray-400 text-sm font-medium">
                {t('password')}
              </Label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="w-full h-14 rounded-xl text-lg px-4 outline-none focus:ring-2 focus:ring-purple-500"
                style={{ backgroundColor: '#1f1730', border: '1px solid #2a2040', color: 'white' }}
                placeholder={t('enterPassword')}
                data-testid="input-password"
              />
            </div>

            {/* Register Button */}
            <Button
              type="submit"
              disabled={registerMutation.isPending}
              className="w-full h-14 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/30 text-lg transition-all duration-300 mt-6"
              data-testid="button-register"
            >
              {registerMutation.isPending ? t('creatingAccount') : t('createAccount')}
            </Button>

            {/* Divider */}
            <div className="flex items-center justify-center py-2">
              <div className="flex-1 h-px bg-[#2a2040]"></div>
              <span className="px-4 text-gray-500 text-sm">or</span>
              <div className="flex-1 h-px bg-[#2a2040]"></div>
            </div>

            {/* Google Register */}
            <Button
              type="button"
              onClick={() => window.location.href = '/api/auth/google'}
              className="w-full h-14 bg-[#1f1730] hover:bg-[#2a2040] text-white font-medium rounded-xl border border-[#2a2040] flex items-center justify-center gap-3 transition-all duration-300"
              data-testid="button-google-register"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>Continue with Google</span>
            </Button>

            {/* Login Link */}
            <div className="text-center pt-2">
              <p className="text-gray-500 text-sm">
                Already have an account?{' '}
                <Link href="/login">
                  <span className="text-purple-400 font-semibold hover:text-purple-300 cursor-pointer">
                    Log In
                  </span>
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

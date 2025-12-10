import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useLanguage } from '@/hooks/useLanguage';
import { HelpCircle, Check, CreditCard, Wallet } from 'lucide-react';

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
        <div className="flex-shrink-0 pt-4 sm:pt-6 md:pt-8 pb-2 sm:pb-3 md:pb-4 px-3 sm:px-4 text-center" style={{ backgroundColor: bgColor }}>
          {/* Logo */}
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-3 sm:mb-4 md:mb-6">
            <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm sm:text-base md:text-lg">W</span>
            </div>
            <span className="text-white font-bold text-base sm:text-lg md:text-xl tracking-wide">WALLET<span className="text-purple-400">PAY</span></span>
          </div>

          {/* Illustration Area */}
          <div className="relative w-full max-w-[160px] sm:max-w-[200px] md:max-w-xs mx-auto h-24 sm:h-28 md:h-36 flex items-center justify-center">
            {/* Glow Effects */}
            <div className="absolute w-20 sm:w-24 md:w-32 h-20 sm:h-24 md:h-32 bg-purple-600/20 rounded-full blur-3xl"></div>
            <div className="absolute w-12 sm:w-16 md:w-20 h-12 sm:h-16 md:h-20 bg-pink-500/15 rounded-full blur-2xl translate-x-4 sm:translate-x-6 -translate-y-2 sm:-translate-y-3"></div>
            
            {/* Main Phone */}
            <div className="relative z-10">
              <div className="w-16 sm:w-20 md:w-24 h-28 sm:h-32 md:h-40 bg-gradient-to-b from-[#2a1f4e] to-[#1a1030] rounded-xl sm:rounded-2xl md:rounded-3xl border-2 border-purple-500/30 shadow-2xl shadow-purple-500/20 flex flex-col items-center justify-center p-1.5 sm:p-2 relative overflow-hidden">
                {/* Screen Shine */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/5 to-transparent"></div>
                
                {/* Wallet Icon */}
                <div className="w-8 sm:w-10 md:w-12 h-8 sm:h-10 md:h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg sm:rounded-xl md:rounded-2xl flex items-center justify-center mb-1.5 sm:mb-2 shadow-lg">
                  <Wallet className="w-4 sm:w-5 md:w-7 h-4 sm:h-5 md:h-7 text-white" />
                </div>
                
                {/* Balance Text */}
                <div className="text-center">
                  <p className="text-gray-400 text-[7px] sm:text-[8px] md:text-[9px]">Balance</p>
                  <p className="text-white font-bold text-[9px] sm:text-[10px] md:text-xs">$2,459.00</p>
                </div>
              </div>
              
              {/* Floating Card 1 */}
              <div className="absolute -left-5 sm:-left-6 md:-left-8 top-1 sm:top-2 md:top-3 w-10 sm:w-12 md:w-14 h-6 sm:h-7 md:h-9 bg-gradient-to-r from-purple-600 to-pink-500 rounded-md sm:rounded-lg shadow-xl shadow-purple-500/30 flex items-center justify-center transform -rotate-12">
                <CreditCard className="w-3 sm:w-4 md:w-5 h-3 sm:h-4 md:h-5 text-white/80" />
              </div>
              
              {/* Floating Card 2 */}
              <div className="absolute -right-4 sm:-right-5 md:-right-6 top-6 sm:top-8 md:top-10 w-9 sm:w-10 md:w-12 h-5 sm:h-6 md:h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-md sm:rounded-lg shadow-xl shadow-pink-500/30 flex items-center justify-center transform rotate-12">
                <CreditCard className="w-2.5 sm:w-3 md:w-4 h-2.5 sm:h-3 md:h-4 text-white/80" />
              </div>
              
              {/* Floating Coins */}
              <div className="absolute -right-2 sm:-right-3 md:-right-4 bottom-4 sm:bottom-5 md:bottom-6 w-4 sm:w-5 md:w-7 h-4 sm:h-5 md:h-7 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full shadow-lg flex items-center justify-center">
                <span className="text-yellow-900 font-bold text-[6px] sm:text-[8px] md:text-[10px]">$</span>
              </div>
              <div className="absolute -left-1 sm:-left-2 md:-left-3 bottom-8 sm:bottom-9 md:bottom-10 w-3 sm:w-4 md:w-5 h-3 sm:h-4 md:h-5 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full shadow-md flex items-center justify-center">
                <span className="text-yellow-800 font-bold text-[5px] sm:text-[6px] md:text-[7px]">$</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="flex-1 px-4 sm:px-5 md:px-6 pt-3 sm:pt-4 md:pt-6 pb-6 sm:pb-10 md:pb-20" style={{ backgroundColor: bgColor }}>
          {/* Header with Help Icon */}
          <div className="flex items-center justify-between mb-3 sm:mb-4 md:mb-5">
            <h2 className="text-white text-base sm:text-xl md:text-2xl font-semibold">{t('createNewAccount')}</h2>
            <button className="text-gray-400 hover:text-white transition-colors">
              <HelpCircle className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-2.5 sm:space-y-3 md:space-y-4">
            {/* First Name Field */}
            <div className="space-y-1 sm:space-y-1.5 md:space-y-2">
              <Label className="text-gray-400 text-xs sm:text-sm font-medium">
                {t('firstName')}
              </Label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="w-full h-10 sm:h-11 md:h-14 rounded-lg sm:rounded-xl text-sm sm:text-base md:text-lg px-3 sm:px-4 pr-10 sm:pr-12 outline-none focus:ring-2 focus:ring-purple-500"
                  style={{ backgroundColor: '#1f1730', border: '1px solid #2a2040', color: 'white' }}
                  placeholder={t('enterFirstName')}
                  data-testid="input-firstname"
                />
                {formData.firstName && (
                  <div className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 bg-purple-500 rounded-full flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 text-white" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Last Name Field */}
            <div className="space-y-1 sm:space-y-1.5 md:space-y-2">
              <Label className="text-gray-400 text-xs sm:text-sm font-medium">
                {t('lastName')}
              </Label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="w-full h-10 sm:h-11 md:h-14 rounded-lg sm:rounded-xl text-sm sm:text-base md:text-lg px-3 sm:px-4 pr-10 sm:pr-12 outline-none focus:ring-2 focus:ring-purple-500"
                  style={{ backgroundColor: '#1f1730', border: '1px solid #2a2040', color: 'white' }}
                  placeholder={t('enterLastName')}
                  data-testid="input-lastname"
                />
                {formData.lastName && (
                  <div className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 bg-purple-500 rounded-full flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 text-white" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-1 sm:space-y-1.5 md:space-y-2">
              <Label className="text-gray-400 text-xs sm:text-sm font-medium">
                {t('email')}
              </Label>
              <div className="relative">
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full h-10 sm:h-11 md:h-14 rounded-lg sm:rounded-xl text-sm sm:text-base md:text-lg px-3 sm:px-4 pr-10 sm:pr-12 outline-none focus:ring-2 focus:ring-purple-500"
                  style={{ backgroundColor: '#1f1730', border: '1px solid #2a2040', color: 'white' }}
                  placeholder={t('enterEmail')}
                  data-testid="input-email"
                />
                {formData.email && (
                  <div className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 bg-purple-500 rounded-full flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 text-white" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Phone Number Field */}
            <div className="space-y-1 sm:space-y-1.5 md:space-y-2">
              <Label className="text-gray-400 text-xs sm:text-sm font-medium">
                {t('phoneNumber')}
              </Label>
              <div className="flex rounded-lg sm:rounded-xl overflow-hidden" style={{ backgroundColor: '#1f1730', border: '1px solid #2a2040' }}>
                {/* Country Code Selector */}
                <div className="relative">
                  <select
                    value={selectedCountry.code}
                    onChange={(e) => {
                      const country = countries.find(c => c.code === e.target.value);
                      if (country) setSelectedCountry(country);
                    }}
                    className="h-10 sm:h-11 md:h-14 pl-2 sm:pl-3 pr-6 sm:pr-8 bg-[#2a2040] border-r border-[#2a2040] text-white text-xs sm:text-sm font-medium appearance-none cursor-pointer hover:bg-[#352850] transition-colors"
                    style={{ backgroundColor: '#2a2040' }}
                  >
                    {countries.map((country, index) => (
                      <option key={`${country.code}-${country.name}-${index}`} value={country.code}>
                        {country.flag} {country.code}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-1 sm:right-2 flex items-center pointer-events-none">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                
                {/* Phone Number Input */}
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="flex-1 h-10 sm:h-11 md:h-14 px-3 sm:px-4 bg-transparent text-white text-sm sm:text-base md:text-lg outline-none focus:ring-0"
                  placeholder={t('enterPhoneNumber')}
                  data-testid="input-phone"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1 sm:space-y-1.5 md:space-y-2">
              <Label className="text-gray-400 text-xs sm:text-sm font-medium">
                {t('password')}
              </Label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="w-full h-10 sm:h-11 md:h-14 rounded-lg sm:rounded-xl text-sm sm:text-base md:text-lg px-3 sm:px-4 outline-none focus:ring-2 focus:ring-purple-500"
                style={{ backgroundColor: '#1f1730', border: '1px solid #2a2040', color: 'white' }}
                placeholder={t('enterPassword')}
                data-testid="input-password"
              />
            </div>

            {/* Register Button */}
            <Button
              type="submit"
              disabled={registerMutation.isPending}
              className="w-full h-10 sm:h-11 md:h-14 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-semibold rounded-lg sm:rounded-xl shadow-lg shadow-purple-500/30 text-sm sm:text-base md:text-lg transition-all duration-300 mt-3 sm:mt-4 md:mt-6"
              data-testid="button-register"
            >
              {registerMutation.isPending ? t('creatingAccount') : t('createAccount')}
            </Button>

            {/* Divider */}
            <div className="flex items-center justify-center py-1 sm:py-1.5 md:py-2">
              <div className="flex-1 h-px bg-[#2a2040]"></div>
              <span className="px-3 sm:px-4 text-gray-500 text-xs sm:text-sm">or</span>
              <div className="flex-1 h-px bg-[#2a2040]"></div>
            </div>

            {/* Google Register */}
            <Button
              type="button"
              onClick={() => window.location.href = '/api/auth/google'}
              className="w-full h-10 sm:h-11 md:h-14 bg-[#1f1730] hover:bg-[#2a2040] text-white font-medium rounded-lg sm:rounded-xl border border-[#2a2040] flex items-center justify-center gap-2 sm:gap-3 transition-all duration-300"
              data-testid="button-google-register"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-sm sm:text-base">Continue with Google</span>
            </Button>

            {/* Login Link */}
            <div className="text-center pt-1 sm:pt-2">
              <p className="text-gray-500 text-xs sm:text-sm">
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

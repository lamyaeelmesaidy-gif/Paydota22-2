import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useLanguage } from '@/hooks/useLanguage';
import { LanguageToggle } from '@/components/language-toggle';
import { ThemeToggle } from '@/components/theme-toggle';
import { useKeyboard } from '@/hooks/useKeyboard';


export default function Register() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const { isKeyboardOpen, keyboardHeight } = useKeyboard();
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
    // Arab Countries
    { code: '+212', flag: '🇲🇦', name: 'Morocco' },
    { code: '+213', flag: '🇩🇿', name: 'Algeria' },
    { code: '+216', flag: '🇹🇳', name: 'Tunisia' },
    { code: '+218', flag: '🇱🇾', name: 'Libya' },
    { code: '+20', flag: '🇪🇬', name: 'Egypt' },
    { code: '+249', flag: '🇸🇩', name: 'Sudan' },
    { code: '+211', flag: '🇸🇸', name: 'South Sudan' },
    { code: '+251', flag: '🇪🇹', name: 'Ethiopia' },
    { code: '+252', flag: '🇸🇴', name: 'Somalia' },
    { code: '+253', flag: '🇩🇯', name: 'Djibouti' },
    { code: '+222', flag: '🇲🇷', name: 'Mauritania' },
    { code: '+966', flag: '🇸🇦', name: 'Saudi Arabia' },
    { code: '+971', flag: '🇦🇪', name: 'UAE' },
    { code: '+962', flag: '🇯🇴', name: 'Jordan' },
    { code: '+961', flag: '🇱🇧', name: 'Lebanon' },
    { code: '+963', flag: '🇸🇾', name: 'Syria' },
    { code: '+964', flag: '🇮🇶', name: 'Iraq' },
    { code: '+965', flag: '🇰🇼', name: 'Kuwait' },
    { code: '+974', flag: '🇶🇦', name: 'Qatar' },
    { code: '+973', flag: '🇧🇭', name: 'Bahrain' },
    { code: '+968', flag: '🇴🇲', name: 'Oman' },
    { code: '+967', flag: '🇾🇪', name: 'Yemen' },
    { code: '+970', flag: '🇵🇸', name: 'Palestine' },
    { code: '+269', flag: '🇰🇲', name: 'Comoros' },
    
    // Major International Countries
    { code: '+1', flag: '🇺🇸', name: 'United States' },
    { code: '+1', flag: '🇨🇦', name: 'Canada' },
    { code: '+44', flag: '🇬🇧', name: 'United Kingdom' },
    { code: '+33', flag: '🇫🇷', name: 'France' },
    { code: '+49', flag: '🇩🇪', name: 'Germany' },
    { code: '+39', flag: '🇮🇹', name: 'Italy' },
    { code: '+34', flag: '🇪🇸', name: 'Spain' },
    { code: '+31', flag: '🇳🇱', name: 'Netherlands' },
    { code: '+32', flag: '🇧🇪', name: 'Belgium' },
    { code: '+41', flag: '🇨🇭', name: 'Switzerland' },
    { code: '+43', flag: '🇦🇹', name: 'Austria' },
    { code: '+45', flag: '🇩🇰', name: 'Denmark' },
    { code: '+46', flag: '🇸🇪', name: 'Sweden' },
    { code: '+47', flag: '🇳🇴', name: 'Norway' },
    { code: '+358', flag: '🇫🇮', name: 'Finland' },
    { code: '+351', flag: '🇵🇹', name: 'Portugal' },
    { code: '+353', flag: '🇮🇪', name: 'Ireland' },
    { code: '+354', flag: '🇮🇸', name: 'Iceland' },
    { code: '+352', flag: '🇱🇺', name: 'Luxembourg' },
    
    // European Countries
    { code: '+7', flag: '🇷🇺', name: 'Russia' },
    { code: '+48', flag: '🇵🇱', name: 'Poland' },
    { code: '+420', flag: '🇨🇿', name: 'Czech Republic' },
    { code: '+421', flag: '🇸🇰', name: 'Slovakia' },
    { code: '+36', flag: '🇭🇺', name: 'Hungary' },
    { code: '+40', flag: '🇷🇴', name: 'Romania' },
    { code: '+359', flag: '🇧🇬', name: 'Bulgaria' },
    { code: '+385', flag: '🇭🇷', name: 'Croatia' },
    { code: '+381', flag: '🇷🇸', name: 'Serbia' },
    { code: '+382', flag: '🇲🇪', name: 'Montenegro' },
    { code: '+387', flag: '🇧🇦', name: 'Bosnia and Herzegovina' },
    { code: '+386', flag: '🇸🇮', name: 'Slovenia' },
    { code: '+389', flag: '🇲🇰', name: 'North Macedonia' },
    { code: '+355', flag: '🇦🇱', name: 'Albania' },
    { code: '+30', flag: '🇬🇷', name: 'Greece' },
    { code: '+357', flag: '🇨🇾', name: 'Cyprus' },
    { code: '+90', flag: '🇹🇷', name: 'Turkey' },
    { code: '+380', flag: '🇺🇦', name: 'Ukraine' },
    { code: '+375', flag: '🇧🇾', name: 'Belarus' },
    { code: '+370', flag: '🇱🇹', name: 'Lithuania' },
    { code: '+371', flag: '🇱🇻', name: 'Latvia' },
    { code: '+372', flag: '🇪🇪', name: 'Estonia' },
    { code: '+373', flag: '🇲🇩', name: 'Moldova' },
    
    // Asian Countries
    { code: '+86', flag: '🇨🇳', name: 'China' },
    { code: '+91', flag: '🇮🇳', name: 'India' },
    { code: '+81', flag: '🇯🇵', name: 'Japan' },
    { code: '+82', flag: '🇰🇷', name: 'South Korea' },
    { code: '+65', flag: '🇸🇬', name: 'Singapore' },
    { code: '+60', flag: '🇲🇾', name: 'Malaysia' },
    { code: '+66', flag: '🇹🇭', name: 'Thailand' },
    { code: '+84', flag: '🇻🇳', name: 'Vietnam' },
    { code: '+62', flag: '🇮🇩', name: 'Indonesia' },
    { code: '+63', flag: '🇵🇭', name: 'Philippines' },
    { code: '+852', flag: '🇭🇰', name: 'Hong Kong' },
    { code: '+853', flag: '🇲🇴', name: 'Macau' },
    { code: '+886', flag: '🇹🇼', name: 'Taiwan' },
    { code: '+95', flag: '🇲🇲', name: 'Myanmar' },
    { code: '+855', flag: '🇰🇭', name: 'Cambodia' },
    { code: '+856', flag: '🇱🇦', name: 'Laos' },
    { code: '+673', flag: '🇧🇳', name: 'Brunei' },
    { code: '+92', flag: '🇵🇰', name: 'Pakistan' },
    { code: '+880', flag: '🇧🇩', name: 'Bangladesh' },
    { code: '+94', flag: '🇱🇰', name: 'Sri Lanka' },
    { code: '+977', flag: '🇳🇵', name: 'Nepal' },
    { code: '+975', flag: '🇧🇹', name: 'Bhutan' },
    { code: '+960', flag: '🇲🇻', name: 'Maldives' },
    { code: '+93', flag: '🇦🇫', name: 'Afghanistan' },
    { code: '+98', flag: '🇮🇷', name: 'Iran' },
    { code: '+994', flag: '🇦🇿', name: 'Azerbaijan' },
    { code: '+995', flag: '🇬🇪', name: 'Georgia' },
    { code: '+374', flag: '🇦🇲', name: 'Armenia' },
    { code: '+7', flag: '🇰🇿', name: 'Kazakhstan' },
    { code: '+996', flag: '🇰🇬', name: 'Kyrgyzstan' },
    { code: '+992', flag: '🇹🇯', name: 'Tajikistan' },
    { code: '+993', flag: '🇹🇲', name: 'Turkmenistan' },
    { code: '+998', flag: '🇺🇿', name: 'Uzbekistan' },
    
    // African Countries
    { code: '+27', flag: '🇿🇦', name: 'South Africa' },
    { code: '+234', flag: '🇳🇬', name: 'Nigeria' },
    { code: '+233', flag: '🇬🇭', name: 'Ghana' },
    { code: '+254', flag: '🇰🇪', name: 'Kenya' },
    { code: '+255', flag: '🇹🇿', name: 'Tanzania' },
    { code: '+256', flag: '🇺🇬', name: 'Uganda' },
    { code: '+250', flag: '🇷🇼', name: 'Rwanda' },
    { code: '+257', flag: '🇧🇮', name: 'Burundi' },
    { code: '+243', flag: '🇨🇩', name: 'DR Congo' },
    { code: '+242', flag: '🇨🇬', name: 'Republic of the Congo' },
    { code: '+236', flag: '🇨🇫', name: 'Central African Republic' },
    { code: '+235', flag: '🇹🇩', name: 'Chad' },
    { code: '+237', flag: '🇨🇲', name: 'Cameroon' },
    { code: '+240', flag: '🇬🇶', name: 'Equatorial Guinea' },
    { code: '+241', flag: '🇬🇦', name: 'Gabon' },
    { code: '+239', flag: '🇸🇹', name: 'São Tomé and Príncipe' },
    { code: '+238', flag: '🇨🇻', name: 'Cape Verde' },
    { code: '+221', flag: '🇸🇳', name: 'Senegal' },
    { code: '+220', flag: '🇬🇲', name: 'Gambia' },
    { code: '+224', flag: '🇬🇳', name: 'Guinea' },
    { code: '+245', flag: '🇬🇼', name: 'Guinea-Bissau' },
    { code: '+232', flag: '🇸🇱', name: 'Sierra Leone' },
    { code: '+231', flag: '🇱🇷', name: 'Liberia' },
    { code: '+225', flag: '🇨🇮', name: 'Côte d\'Ivoire' },
    { code: '+226', flag: '🇧🇫', name: 'Burkina Faso' },
    { code: '+223', flag: '🇲🇱', name: 'Mali' },
    { code: '+227', flag: '🇳🇪', name: 'Niger' },
    { code: '+229', flag: '🇧🇯', name: 'Benin' },
    { code: '+228', flag: '🇹🇬', name: 'Togo' },
    { code: '+230', flag: '🇲🇺', name: 'Mauritius' },
    { code: '+248', flag: '🇸🇨', name: 'Seychelles' },
    { code: '+261', flag: '🇲🇬', name: 'Madagascar' },
    { code: '+262', flag: '🇷🇪', name: 'Réunion' },
    { code: '+290', flag: '🇸🇭', name: 'Saint Helena' },
    { code: '+244', flag: '🇦🇴', name: 'Angola' },
    { code: '+258', flag: '🇲🇿', name: 'Mozambique' },
    { code: '+260', flag: '🇿🇲', name: 'Zambia' },
    { code: '+263', flag: '🇿🇼', name: 'Zimbabwe' },
    { code: '+267', flag: '🇧🇼', name: 'Botswana' },
    { code: '+268', flag: '🇸🇿', name: 'Eswatini' },
    { code: '+266', flag: '🇱🇸', name: 'Lesotho' },
    { code: '+264', flag: '🇳🇦', name: 'Namibia' },
    
    // Americas
    { code: '+52', flag: '🇲🇽', name: 'Mexico' },
    { code: '+55', flag: '🇧🇷', name: 'Brazil' },
    { code: '+54', flag: '🇦🇷', name: 'Argentina' },
    { code: '+56', flag: '🇨🇱', name: 'Chile' },
    { code: '+57', flag: '🇨🇴', name: 'Colombia' },
    { code: '+58', flag: '🇻🇪', name: 'Venezuela' },
    { code: '+51', flag: '🇵🇪', name: 'Peru' },
    { code: '+593', flag: '🇪🇨', name: 'Ecuador' },
    { code: '+591', flag: '🇧🇴', name: 'Bolivia' },
    { code: '+595', flag: '🇵🇾', name: 'Paraguay' },
    { code: '+598', flag: '🇺🇾', name: 'Uruguay' },
    { code: '+594', flag: '🇬🇫', name: 'French Guiana' },
    { code: '+597', flag: '🇸🇷', name: 'Suriname' },
    { code: '+592', flag: '🇬🇾', name: 'Guyana' },
    { code: '+507', flag: '🇵🇦', name: 'Panama' },
    { code: '+506', flag: '🇨🇷', name: 'Costa Rica' },
    { code: '+505', flag: '🇳🇮', name: 'Nicaragua' },
    { code: '+504', flag: '🇭🇳', name: 'Honduras' },
    { code: '+503', flag: '🇸🇻', name: 'El Salvador' },
    { code: '+502', flag: '🇬🇹', name: 'Guatemala' },
    { code: '+501', flag: '🇧🇿', name: 'Belize' },
    { code: '+53', flag: '🇨🇺', name: 'Cuba' },
    { code: '+1', flag: '🇯🇲', name: 'Jamaica' },
    { code: '+1', flag: '🇭🇹', name: 'Haiti' },
    { code: '+1', flag: '🇩🇴', name: 'Dominican Republic' },
    { code: '+1', flag: '🇵🇷', name: 'Puerto Rico' },
    { code: '+1', flag: '🇹🇹', name: 'Trinidad and Tobago' },
    { code: '+1', flag: '🇧🇧', name: 'Barbados' },
    { code: '+1', flag: '🇱🇨', name: 'Saint Lucia' },
    { code: '+1', flag: '🇬🇩', name: 'Grenada' },
    { code: '+1', flag: '🇻🇨', name: 'Saint Vincent' },
    { code: '+1', flag: '🇦🇬', name: 'Antigua and Barbuda' },
    { code: '+1', flag: '🇰🇳', name: 'Saint Kitts and Nevis' },
    { code: '+1', flag: '🇩🇲', name: 'Dominica' },
    { code: '+1', flag: '🇧🇸', name: 'Bahamas' },
    { code: '+1', flag: '🇧🇲', name: 'Bermuda' },
    
    // Oceania
    { code: '+61', flag: '🇦🇺', name: 'Australia' },
    { code: '+64', flag: '🇳🇿', name: 'New Zealand' },
    { code: '+679', flag: '🇫🇯', name: 'Fiji' },
    { code: '+676', flag: '🇹🇴', name: 'Tonga' },
    { code: '+685', flag: '🇼🇸', name: 'Samoa' },
    { code: '+686', flag: '🇰🇮', name: 'Kiribati' },
    { code: '+687', flag: '🇳🇨', name: 'New Caledonia' },
    { code: '+689', flag: '🇵🇫', name: 'French Polynesia' },
    { code: '+690', flag: '🇹🇰', name: 'Tokelau' },
    { code: '+691', flag: '🇫🇲', name: 'Micronesia' },
    { code: '+692', flag: '🇲🇭', name: 'Marshall Islands' },
    { code: '+680', flag: '🇵🇼', name: 'Palau' },
    { code: '+678', flag: '🇻🇺', name: 'Vanuatu' },
    { code: '+677', flag: '🇸🇧', name: 'Solomon Islands' },
    { code: '+675', flag: '🇵🇬', name: 'Papua New Guinea' }
  ];

  const registerMutation = useMutation({
    mutationFn: async (data: { firstName: string; lastName: string; email: string; phone: string; password: string; referralCode?: string }) => {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: data.email, // Use email as username
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
      
      // إعادة تحميل بيانات المستخدم بعد التسجيل الناجح
      await queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      
      // انتظار قصير للتأكد من تحديث حالة المصادقة
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

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 relative overflow-hidden flex flex-col safe-area-inset keyboard-adjust">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 bg-gradient-to-br from-purple-200/15 to-pink-200/15 dark:from-purple-500/10 dark:to-pink-500/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-0 left-0 w-20 h-20 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 bg-gradient-to-tr from-blue-200/10 to-purple-200/10 dark:from-blue-500/10 dark:to-purple-500/10 rounded-full blur-xl"></div>
      
      {/* Header */}
      <div className="flex-none pt-2 pb-3 px-4 sm:px-6 md:px-8 relative z-10">
        {/* Language and Theme Toggle */}
        <div className="flex justify-end items-center gap-2 mb-1">
          <ThemeToggle className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800" />
          <LanguageToggle />
        </div>
        
        <div className="text-center">
          <h1 className="text-gray-600 dark:text-gray-400 text-base sm:text-lg md:text-xl mb-1 font-medium">
            {t('joinUs')}
          </h1>
          <h2 className="text-gray-900 dark:text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold">
            {t('createNewAccount')}
          </h2>
        </div>
      </div>

      {/* Register Form */}
      <div className="flex-1 px-4 sm:px-6 md:px-8 pb-6 overflow-y-auto scroll-smooth relative z-10">
        <div className="max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 md:space-y-6 min-h-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 lg:p-10 shadow-xl dark:shadow-2xl">
                
            {/* First Name Field */}
            <div>
              <Label htmlFor="firstName" className="text-gray-700 dark:text-gray-300 font-medium text-sm sm:text-base md:text-lg">
                {t('firstName')}
              </Label>
              <Input
                id="firstName"
                type="text"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className="w-full h-11 sm:h-12 md:h-14 mt-2 rounded-xl border-gray-200 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-1 focus:ring-purple-500 dark:focus:ring-purple-400 bg-white dark:bg-gray-700 dark:text-white text-base md:text-lg"
                placeholder={t('enterFirstName')}
                required
              />
            </div>

            {/* Last Name Field */}
            <div>
              <Label htmlFor="lastName" className="text-gray-700 dark:text-gray-300 font-medium text-sm sm:text-base md:text-lg">
                {t('lastName')}
              </Label>
              <Input
                id="lastName"
                type="text"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className="w-full h-11 sm:h-12 md:h-14 mt-2 rounded-xl border-gray-200 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-1 focus:ring-purple-500 dark:focus:ring-purple-400 bg-white dark:bg-gray-700 dark:text-white text-base md:text-lg"
                placeholder={t('enterLastName')}
                required
              />
            </div>

            {/* Email Field */}
            <div>
              <Label htmlFor="email" className="text-gray-700 dark:text-gray-300 font-medium text-sm sm:text-base md:text-lg">
                {t('email')}
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full h-11 sm:h-12 md:h-14 mt-2 rounded-xl border-gray-200 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-1 focus:ring-purple-500 dark:focus:ring-purple-400 bg-white dark:bg-gray-700 dark:text-white text-base md:text-lg"
                placeholder={t('enterEmail')}
                required
              />
            </div>

            {/* Phone Number Field */}
            <div>
              <Label htmlFor="phone" className="text-gray-700 dark:text-gray-300 font-medium text-sm sm:text-base md:text-lg">
                {t('phoneNumber')}
              </Label>
              <div className="flex rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 overflow-hidden h-11 sm:h-12 md:h-14 mt-2">
                {/* Country Code Selector */}
                <div className="relative">
                  <select
                    value={selectedCountry.code}
                    onChange={(e) => {
                      const country = countries.find(c => c.code === e.target.value);
                      if (country) setSelectedCountry(country);
                    }}
                    className="h-11 sm:h-12 md:h-14 pl-3 pr-8 bg-gray-50 dark:bg-gray-600 border-r border-gray-200 dark:border-gray-600 dark:text-white text-sm md:text-base font-medium appearance-none cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-500 transition-colors"
                  >
                    {countries.map((country, index) => (
                      <option key={`${country.code}-${country.name}-${index}`} value={country.code}>
                        {country.flag} {country.code}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                
                {/* Phone Number Input */}
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="flex-1 h-11 sm:h-12 md:h-14 border-0 focus:ring-0 focus:ring-offset-0 bg-transparent dark:text-white text-base md:text-lg"
                  placeholder={t('enterPhoneNumber')}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <Label htmlFor="password" className="text-gray-700 dark:text-gray-300 font-medium text-sm sm:text-base md:text-lg">
                {t('password')}
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="w-full h-11 sm:h-12 md:h-14 mt-2 rounded-xl border-gray-200 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-1 focus:ring-purple-500 dark:focus:ring-purple-400 bg-white dark:bg-gray-700 dark:text-white text-base md:text-lg"
                placeholder={t('enterPassword')}
                required
              />
            </div>

            {/* Submit Button */}
            <div className="pt-3 md:pt-4">
              <Button
                type="submit"
                disabled={registerMutation.isPending}
                className="w-full h-11 sm:h-12 md:h-14 lg:h-16 wallet-gradient hover:opacity-90 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-sm sm:text-base md:text-lg"
              >
                {registerMutation.isPending ? t('creatingAccount') : t('createAccount')}
              </Button>
            </div>

            {/* Login Link */}
            <div className="text-center pt-4 sm:pt-5 md:pt-6">
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base md:text-lg">
                {t('alreadyHaveAccount')}{' '}
                <Link href="/login">
                  <span className="text-purple-600 dark:text-purple-400 font-semibold hover:underline cursor-pointer">
                    {t('signIn')}
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
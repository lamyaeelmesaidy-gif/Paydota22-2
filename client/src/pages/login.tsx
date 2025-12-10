import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useLanguage } from '@/hooks/useLanguage';
import { HelpCircle, Check, Smartphone, CreditCard, Wallet } from 'lucide-react';

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const loginMutation = useMutation({
    mutationFn: async (data: { username: string; password: string }) => {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error(t('loginFailed'));
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: t('welcomeBackSuccess'),
        description: t('loginSuccessful'),
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      setTimeout(() => {
        setLocation('/dashboard');
      }, 200);
    },
    onError: (error: any) => {
      toast({
        title: t('loginError'),
        description: error.message || t('checkCredentials'),
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      toast({
        title: t('missingData'),
        description: t('fillAllFields'),
        variant: "destructive",
      });
      return;
    }
    loginMutation.mutate(formData);
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
        <div className="flex-shrink-0 pt-6 sm:pt-8 md:pt-12 pb-3 sm:pb-4 md:pb-6 px-3 sm:px-4 text-center" style={{ backgroundColor: bgColor }}>
          {/* Logo */}
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-4 sm:mb-6 md:mb-8">
            <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm sm:text-base md:text-lg">W</span>
            </div>
            <span className="text-white font-bold text-base sm:text-lg md:text-xl tracking-wide">WALLET<span className="text-purple-400">PAY</span></span>
          </div>

          {/* Illustration Area */}
          <div className="relative w-full max-w-[200px] sm:max-w-[240px] md:max-w-xs mx-auto h-32 sm:h-40 md:h-48 flex items-center justify-center">
            {/* Glow Effects */}
            <div className="absolute w-28 sm:w-32 md:w-40 h-28 sm:h-32 md:h-40 bg-purple-600/20 rounded-full blur-3xl"></div>
            <div className="absolute w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 bg-pink-500/15 rounded-full blur-2xl translate-x-6 sm:translate-x-8 -translate-y-3 sm:-translate-y-4"></div>
            
            {/* Main Phone */}
            <div className="relative z-10">
              <div className="w-20 sm:w-24 md:w-28 h-32 sm:h-40 md:h-48 bg-gradient-to-b from-[#2a1f4e] to-[#1a1030] rounded-2xl sm:rounded-3xl border-2 border-purple-500/30 shadow-2xl shadow-purple-500/20 flex flex-col items-center justify-center p-2 sm:p-3 relative overflow-hidden">
                {/* Screen Shine */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/5 to-transparent"></div>
                
                {/* Wallet Icon */}
                <div className="w-10 sm:w-12 md:w-14 h-10 sm:h-12 md:h-14 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl sm:rounded-2xl flex items-center justify-center mb-2 sm:mb-3 shadow-lg">
                  <Wallet className="w-5 sm:w-6 md:w-8 h-5 sm:h-6 md:h-8 text-white" />
                </div>
                
                {/* Balance Text */}
                <div className="text-center">
                  <p className="text-gray-400 text-[8px] sm:text-[9px] md:text-[10px]">Balance</p>
                  <p className="text-white font-bold text-[10px] sm:text-xs md:text-sm">$2,459.00</p>
                </div>
              </div>
              
              {/* Floating Card 1 */}
              <div className="absolute -left-6 sm:-left-8 md:-left-10 top-2 sm:top-3 md:top-4 w-12 sm:w-14 md:w-16 h-7 sm:h-8 md:h-10 bg-gradient-to-r from-purple-600 to-pink-500 rounded-md sm:rounded-lg shadow-xl shadow-purple-500/30 flex items-center justify-center transform -rotate-12 animate-pulse">
                <CreditCard className="w-4 sm:w-5 md:w-6 h-4 sm:h-5 md:h-6 text-white/80" />
              </div>
              
              {/* Floating Card 2 */}
              <div className="absolute -right-5 sm:-right-6 md:-right-8 top-8 sm:top-10 md:top-12 w-10 sm:w-12 md:w-14 h-6 sm:h-7 md:h-9 bg-gradient-to-r from-pink-500 to-purple-600 rounded-md sm:rounded-lg shadow-xl shadow-pink-500/30 flex items-center justify-center transform rotate-12">
                <CreditCard className="w-3 sm:w-4 md:w-5 h-3 sm:h-4 md:h-5 text-white/80" />
              </div>
              
              {/* Floating Coins */}
              <div className="absolute -right-3 sm:-right-4 md:-right-6 bottom-6 sm:bottom-7 md:bottom-8 w-5 sm:w-6 md:w-8 h-5 sm:h-6 md:h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full shadow-lg flex items-center justify-center">
                <span className="text-yellow-900 font-bold text-[8px] sm:text-[10px] md:text-xs">$</span>
              </div>
              <div className="absolute -left-2 sm:-left-3 md:-left-4 bottom-10 sm:bottom-11 md:bottom-12 w-4 sm:w-5 md:w-6 h-4 sm:h-5 md:h-6 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full shadow-md flex items-center justify-center">
                <span className="text-yellow-800 font-bold text-[6px] sm:text-[7px] md:text-[8px]">$</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="flex-1 px-4 sm:px-5 md:px-6 pt-4 sm:pt-6 md:pt-8 pb-6 sm:pb-10 md:pb-20" style={{ backgroundColor: bgColor }}>
          {/* Header with Help Icon */}
          <div className="flex items-center justify-between mb-4 sm:mb-5 md:mb-6">
            <h2 className="text-white text-lg sm:text-xl md:text-2xl font-semibold">Access My Account</h2>
            <button className="text-gray-400 hover:text-white transition-colors">
              <HelpCircle className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 md:space-y-5">
            {/* Phone/Email Field */}
            <div className="space-y-1.5 sm:space-y-2">
              <Label className="text-gray-400 text-xs sm:text-sm font-medium">
                Phone Number
              </Label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  className="w-full h-11 sm:h-12 md:h-14 rounded-lg sm:rounded-xl text-sm sm:text-base md:text-lg px-3 sm:px-4 pr-10 sm:pr-12 outline-none focus:ring-2 focus:ring-purple-500"
                  style={{ backgroundColor: '#1f1730', border: '1px solid #2a2040', color: 'white' }}
                  placeholder="Enter phone or email"
                  data-testid="input-username"
                />
                {formData.username && (
                  <div className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 bg-purple-500 rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5 sm:space-y-2">
              <Label className="text-gray-400 text-xs sm:text-sm font-medium">
                Password
              </Label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="w-full h-11 sm:h-12 md:h-14 rounded-lg sm:rounded-xl text-sm sm:text-base md:text-lg px-3 sm:px-4 outline-none focus:ring-2 focus:ring-purple-500"
                style={{ backgroundColor: '#1f1730', border: '1px solid #2a2040', color: 'white' }}
                placeholder="Enter your password"
                data-testid="input-password"
              />
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <Link href="/forgot-password">
                <span className="text-purple-400 text-xs sm:text-sm font-medium hover:text-purple-300 cursor-pointer">
                  Forgot Password?
                </span>
              </Link>
            </div>

            {/* Face ID Option */}
            <div className="flex items-center justify-center gap-2 sm:gap-3 py-2 sm:py-3">
              <Smartphone className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
              <span className="text-gray-300 text-xs sm:text-sm">Use your Face ID</span>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full h-11 sm:h-12 md:h-14 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-semibold rounded-lg sm:rounded-xl shadow-lg shadow-purple-500/30 text-sm sm:text-base md:text-lg transition-all duration-300"
              data-testid="button-login"
            >
              {loginMutation.isPending ? 'Signing In...' : 'Log In'}
            </Button>

            {/* Divider */}
            <div className="flex items-center justify-center py-1.5 sm:py-2">
              <div className="flex-1 h-px bg-[#2a2040]"></div>
              <span className="px-3 sm:px-4 text-gray-500 text-xs sm:text-sm">or</span>
              <div className="flex-1 h-px bg-[#2a2040]"></div>
            </div>

            {/* Google Login */}
            <Button
              type="button"
              onClick={() => window.location.href = '/api/auth/google'}
              className="w-full h-11 sm:h-12 md:h-14 bg-[#1f1730] hover:bg-[#2a2040] text-white font-medium rounded-lg sm:rounded-xl border border-[#2a2040] flex items-center justify-center gap-2 sm:gap-3 transition-all duration-300"
              data-testid="button-google-login"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-sm sm:text-base">Continue with Google</span>
            </Button>

            {/* Sign Up Link */}
            <div className="text-center pt-1 sm:pt-2">
              <p className="text-gray-500 text-xs sm:text-sm">
                Don't have an account?{' '}
                <Link href="/register">
                  <span className="text-purple-400 font-semibold hover:text-purple-300 cursor-pointer">
                    Create Account
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

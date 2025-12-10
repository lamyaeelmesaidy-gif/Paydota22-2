import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useLanguage } from '@/hooks/useLanguage';
import { HelpCircle, Check, Smartphone } from 'lucide-react';

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

  return (
    <div className="h-screen overflow-hidden flex flex-col" style={{ backgroundColor: '#0f0a19' }}>
      {/* Top Section with Logo and Illustration */}
      <div className="flex-shrink-0 pt-12 pb-6 px-4 text-center" style={{ backgroundColor: '#0f0a19' }}>
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">W</span>
          </div>
          <span className="text-white font-bold text-xl tracking-wide">WALLET<span className="text-purple-400">PAY</span></span>
        </div>

        {/* Illustration Area */}
        <div className="relative w-full max-w-xs mx-auto h-48 flex items-center justify-center">
          {/* Decorative Circle Background */}
          <div className="absolute w-40 h-40 bg-gradient-to-br from-purple-500/30 to-pink-500/20 rounded-full blur-2xl"></div>
          
          {/* Phone Illustration */}
          <div className="relative z-10 flex items-center justify-center">
            <div className="w-24 h-40 bg-gradient-to-b from-purple-600 to-purple-800 rounded-2xl border-4 border-purple-400/50 shadow-2xl shadow-purple-500/30 flex items-center justify-center">
              <div className="w-16 h-28 bg-[#1a1028] rounded-xl grid grid-cols-3 gap-1 p-2">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="bg-purple-500/30 rounded-sm"></div>
                ))}
              </div>
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute -left-8 top-4 w-8 h-8 bg-purple-400/20 rounded-full"></div>
            <div className="absolute -right-6 bottom-8 w-6 h-6 bg-pink-400/20 rounded-full"></div>
            <div className="absolute left-4 -bottom-2 w-4 h-4 bg-purple-300/30 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Form Section - Bottom Card */}
      <div className="flex-1 px-6 pt-8 pb-8" style={{ backgroundColor: '#0f0a19' }}>
        {/* Header with Help Icon */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white text-2xl font-semibold">Access My Account</h2>
          <button className="text-gray-400 hover:text-white transition-colors">
            <HelpCircle className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Phone/Email Field */}
          <div className="space-y-2">
            <Label className="text-gray-400 text-sm font-medium">
              Phone Number
            </Label>
            <div className="relative">
              <input
                type="text"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                className="w-full h-14 rounded-xl text-lg px-4 pr-12 outline-none focus:ring-2 focus:ring-purple-500"
                style={{ backgroundColor: '#1f1730', border: '1px solid #2a2040', color: 'white' }}
                placeholder="Enter phone or email"
                data-testid="input-username"
              />
              {formData.username && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label className="text-gray-400 text-sm font-medium">
              Password
            </Label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className="w-full h-14 rounded-xl text-lg px-4 outline-none focus:ring-2 focus:ring-purple-500"
              style={{ backgroundColor: '#1f1730', border: '1px solid #2a2040', color: 'white' }}
              placeholder="Enter your password"
              data-testid="input-password"
            />
          </div>

          {/* Forgot Password */}
          <div className="text-right">
            <Link href="/forgot-password">
              <span className="text-purple-400 text-sm font-medium hover:text-purple-300 cursor-pointer">
                Forgot Password?
              </span>
            </Link>
          </div>

          {/* Face ID Option */}
          <div className="flex items-center justify-center gap-3 py-3">
            <Smartphone className="w-6 h-6 text-purple-400" />
            <span className="text-gray-300 text-sm">Use your Face ID</span>
          </div>

          {/* Login Button */}
          <Button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full h-14 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/30 text-lg transition-all duration-300"
            data-testid="button-login"
          >
            {loginMutation.isPending ? 'Signing In...' : 'Log In'}
          </Button>

          {/* Divider */}
          <div className="flex items-center justify-center py-2">
            <div className="flex-1 h-px bg-[#2a2040]"></div>
            <span className="px-4 text-gray-500 text-sm">or</span>
            <div className="flex-1 h-px bg-[#2a2040]"></div>
          </div>

          {/* Google Login */}
          <Button
            type="button"
            onClick={() => window.location.href = '/api/auth/google'}
            className="w-full h-14 bg-[#1f1730] hover:bg-[#2a2040] text-white font-medium rounded-xl border border-[#2a2040] flex items-center justify-center gap-3 transition-all duration-300"
            data-testid="button-google-login"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Continue with Google</span>
          </Button>

          {/* Sign Up Link */}
          <div className="text-center pt-2">
            <p className="text-gray-500 text-sm">
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
  );
}

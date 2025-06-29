import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { Shield, Crown, Lock } from 'lucide-react';

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  // Check if admin setup is required
  const { data: setupStatus, isLoading: checkingStatus } = useQuery({
    queryKey: ['/api/admin/setup-status'],
    retry: false,
  });

  // Show loading while checking
  if (checkingStatus) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 flex items-center justify-center">
        <div className="text-white text-center">
          <Crown className="h-12 w-12 text-purple-400 mx-auto mb-4" />
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p>Checking admin status...</p>
        </div>
      </div>
    );
  }

  // Redirect to setup if needed
  if (setupStatus?.setupRequired) {
    setLocation('/admin-setup');
    return null;
  }

  const loginMutation = useMutation({
    mutationFn: async (data: { username: string; password: string }) => {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }
      return response.json();
    },
    onSuccess: async (data) => {
      // Check if user has admin role
      if (data.user?.role !== 'admin') {
        toast({
          title: "Access Denied",
          description: "Admin privileges required to access this area",
          variant: "destructive",
        });
        return;
      }
      
      toast({
        title: "Admin Login Successful",
        description: "Welcome to the admin panel",
      });
      
      // Update auth cache
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      
      // Redirect to admin panel
      setTimeout(() => {
        setLocation('/admin-panel');
      }, 200);
    },
    onError: (error: any) => {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials or insufficient privileges",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
      
      <div className="flex items-center justify-center min-h-screen p-4 relative z-10">
        <div className="w-full max-w-md">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl mb-6 shadow-2xl">
              <Crown className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Admin Portal
            </h1>
            <p className="text-purple-200">
              Secure administrative access to PayDota
            </p>
          </div>

          {/* Login Form Card */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl rounded-2xl">
            <div className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="h-6 w-6 text-purple-400" />
                <h2 className="text-xl font-semibold text-white">
                  Administrator Login
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Email/Username Field */}
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-purple-100 font-medium">
                    Email or Username
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    value={formData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    className="w-full h-12 rounded-xl border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder-purple-200 focus:border-purple-400 focus:ring-purple-400"
                    placeholder="Enter your admin credentials"
                    required
                  />
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-purple-100 font-medium">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="w-full h-12 rounded-xl border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder-purple-200 focus:border-purple-400 focus:ring-purple-400"
                    placeholder="Enter your password"
                    required
                  />
                </div>

                {/* Security Notice */}
                <div className="flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                  <Lock className="h-5 w-5 text-amber-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-amber-100 text-sm font-medium">
                      Secure Admin Access
                    </p>
                    <p className="text-amber-200/80 text-xs mt-1">
                      This area requires administrator privileges. All access is logged and monitored.
                    </p>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={loginMutation.isPending}
                  className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {loginMutation.isPending ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Authenticating...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Access Admin Panel
                    </div>
                  )}
                </Button>

                {/* Back to Regular Login */}
                <div className="text-center pt-4">
                  <p className="text-purple-200 text-sm">
                    Need regular access?{' '}
                    <Link href="/login">
                      <span className="text-purple-300 font-medium hover:underline cursor-pointer">
                        User Login
                      </span>
                    </Link>
                  </p>
                </div>

              </form>
            </div>
          </Card>

          {/* Back to Home */}
          <div className="text-center mt-6">
            <Link href="/">
              <Button 
                variant="outline" 
                className="border-white/20 text-white/80 font-medium rounded-xl bg-transparent hover:bg-white/10 shadow-md hover:shadow-lg transition-all duration-200"
              >
                Back to Home
              </Button>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
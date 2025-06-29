import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Shield, Crown, UserPlus, AlertTriangle } from 'lucide-react';

export default function AdminSetup() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  });

  // Check if admin setup is required
  const { data: setupStatus, isLoading: checkingStatus } = useQuery({
    queryKey: ['/api/admin/setup-status'],
    retry: false,
  });

  const setupMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { confirmPassword, ...submitData } = data;
      const response = await fetch('/api/admin/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Admin setup failed');
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Admin Setup Complete",
        description: "Administrator account created successfully. You can now log in.",
      });
      
      // Redirect to admin login
      setTimeout(() => {
        setLocation('/admin-login');
      }, 1500);
    },
    onError: (error: any) => {
      toast({
        title: "Setup Failed",
        description: error.message || "Failed to create administrator account",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.email || !formData.username || !formData.password || 
        !formData.firstName || !formData.lastName) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Weak Password",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    setupMutation.mutate(formData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // If checking status, show loading
  if (checkingStatus) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p>Checking admin status...</p>
        </div>
      </div>
    );
  }

  // If admin already exists, redirect to login
  if (setupStatus && !setupStatus.setupRequired) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 flex items-center justify-center">
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl rounded-2xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <Shield className="h-16 w-16 text-purple-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">
              Admin Already Configured
            </h2>
            <p className="text-purple-200 mb-6">
              The system administrator account has already been set up.
            </p>
            <Link href="/admin-login">
              <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                Go to Admin Login
              </Button>
            </Link>
            <div className="mt-4">
              <Link href="/">
                <Button variant="outline" className="w-full border-white/20 text-white/80 bg-transparent hover:bg-white/10">
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
      
      <div className="flex items-center justify-center min-h-screen p-4 relative z-10">
        <div className="w-full max-w-lg">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl mb-6 shadow-2xl">
              <Crown className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Admin Setup Required
            </h1>
            <p className="text-purple-200">
              Create the first administrator account for PayDota
            </p>
          </div>

          {/* Setup Warning */}
          <div className="mb-6">
            <div className="flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
              <AlertTriangle className="h-5 w-5 text-amber-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-amber-100 text-sm font-medium">
                  First-Time Setup
                </p>
                <p className="text-amber-200/80 text-xs mt-1">
                  This page is only accessible when no administrator account exists. 
                  The admin account will have full system access.
                </p>
              </div>
            </div>
          </div>

          {/* Setup Form Card */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl rounded-2xl">
            <div className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <UserPlus className="h-6 w-6 text-purple-400" />
                <h2 className="text-xl font-semibold text-white">
                  Create Administrator Account
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-purple-100 font-medium">
                      First Name *
                    </Label>
                    <Input
                      id="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className="w-full h-12 rounded-xl border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder-purple-200 focus:border-purple-400 focus:ring-purple-400"
                      placeholder="First name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-purple-100 font-medium">
                      Last Name *
                    </Label>
                    <Input
                      id="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className="w-full h-12 rounded-xl border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder-purple-200 focus:border-purple-400 focus:ring-purple-400"
                      placeholder="Last name"
                      required
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-purple-100 font-medium">
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full h-12 rounded-xl border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder-purple-200 focus:border-purple-400 focus:ring-purple-400"
                    placeholder="admin@paydota.com"
                    required
                  />
                </div>

                {/* Username Field */}
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-purple-100 font-medium">
                    Username *
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    value={formData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    className="w-full h-12 rounded-xl border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder-purple-200 focus:border-purple-400 focus:ring-purple-400"
                    placeholder="admin"
                    required
                  />
                </div>

                {/* Password Fields */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-purple-100 font-medium">
                    Password *
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="w-full h-12 rounded-xl border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder-purple-200 focus:border-purple-400 focus:ring-purple-400"
                    placeholder="Create a strong password"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-purple-100 font-medium">
                    Confirm Password *
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className="w-full h-12 rounded-xl border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder-purple-200 focus:border-purple-400 focus:ring-purple-400"
                    placeholder="Confirm your password"
                    required
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={setupMutation.isPending}
                  className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 mt-6"
                >
                  {setupMutation.isPending ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Setting Up...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Crown className="h-4 w-4" />
                      Create Admin Account
                    </div>
                  )}
                </Button>

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
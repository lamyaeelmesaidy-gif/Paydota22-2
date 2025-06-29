import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { MessageCircle, Settings, Send, CheckCircle, XCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface WhatsAppSettings {
  templateName: string;
  language: 'ar' | 'en';
  phoneNumberId: string;
  accessToken: string;
  verifyToken: string;
  businessAccountId: string;
}

interface WhatsAppStats {
  messagesSent: number;
  messagesDelivered: number;
  messagesFailed: number;
  templatesUsed: number;
}

export default function WhatsAppSettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [testPhone, setTestPhone] = useState('');
  const [testOTP, setTestOTP] = useState('');

  // جلب الإعدادات الحالية
  const { data: settings, isLoading } = useQuery({
    queryKey: ['/api/admin/whatsapp/settings'],
  });

  // جلب الإحصائيات
  const { data: stats } = useQuery({
    queryKey: ['/api/admin/whatsapp/stats'],
  });

  const [formData, setFormData] = useState<WhatsAppSettings>({
    templateName: '',
    language: 'ar',
    phoneNumberId: '',
    accessToken: '',
    verifyToken: '',
    businessAccountId: ''
  });

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  // حفظ الإعدادات
  const saveSettings = useMutation({
    mutationFn: async (data: WhatsAppSettings) => {
      const response = await fetch('/api/admin/whatsapp/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('فشل في حفظ الإعدادات');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "نجح الحفظ",
        description: "تم حفظ إعدادات WhatsApp بنجاح",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/whatsapp/settings'] });
    },
    onError: () => {
      toast({
        title: "خطأ",
        description: "فشل في حفظ الإعدادات",
        variant: "destructive",
      });
    },
  });

  // اختبار إرسال OTP
  const testOTPSending = useMutation({
    mutationFn: async ({ phone, otp }: { phone: string; otp: string }) => {
      const response = await fetch('/api/admin/whatsapp/test-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp }),
      });
      if (!response.ok) throw new Error('فشل في إرسال رسالة الاختبار');
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "نجح الإرسال",
        description: `تم إرسال رسالة الاختبار بنجاح. معرف الرسالة: ${data.messageId}`,
      });
      setTestPhone('');
      setTestOTP('');
    },
    onError: (error: any) => {
      toast({
        title: "فشل الإرسال",
        description: error.message || "فشل في إرسال رسالة الاختبار",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveSettings.mutate(formData);
  };

  const handleTestOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testPhone || !testOTP) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال رقم الهاتف ورمز OTP",
        variant: "destructive",
      });
      return;
    }
    testOTPSending.mutate({ phone: testPhone, otp: testOTP });
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">جاري تحميل الإعدادات...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">إعدادات WhatsApp API</h1>
        <p className="text-gray-600">إدارة إعدادات WhatsApp Business API وقوالب الرسائل</p>
      </div>

      <Tabs defaultValue="settings" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="settings">الإعدادات</TabsTrigger>
          <TabsTrigger value="templates">القوالب</TabsTrigger>
          <TabsTrigger value="stats">الإحصائيات</TabsTrigger>
        </TabsList>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                إعدادات API
              </CardTitle>
              <CardDescription>
                قم بتكوين بيانات WhatsApp Business API
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phoneNumberId">معرف رقم الهاتف</Label>
                    <Input
                      id="phoneNumberId"
                      value={formData.phoneNumberId}
                      onChange={(e) => setFormData(prev => ({ ...prev, phoneNumberId: e.target.value }))}
                      placeholder="637387286132641"
                    />
                  </div>
                  <div>
                    <Label htmlFor="businessAccountId">معرف الحساب التجاري</Label>
                    <Input
                      id="businessAccountId"
                      value={formData.businessAccountId}
                      onChange={(e) => setFormData(prev => ({ ...prev, businessAccountId: e.target.value }))}
                      placeholder="576288461869738"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="accessToken">رمز الوصول</Label>
                  <Textarea
                    id="accessToken"
                    value={formData.accessToken}
                    onChange={(e) => setFormData(prev => ({ ...prev, accessToken: e.target.value }))}
                    placeholder="EAAQrRrLPFnMBOZC..."
                    className="font-mono text-sm"
                  />
                </div>

                <div>
                  <Label htmlFor="verifyToken">رمز التحقق</Label>
                  <Input
                    id="verifyToken"
                    value={formData.verifyToken}
                    onChange={(e) => setFormData(prev => ({ ...prev, verifyToken: e.target.value }))}
                    placeholder="paydota_webhook_verify_token_2025"
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={saveSettings.isPending}
                  className="w-full"
                >
                  {saveSettings.isPending ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  إعدادات القوالب
                </CardTitle>
                <CardDescription>
                  قم بتكوين أسماء القوالب المعتمدة لإرسال رسائل OTP
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="templateName">اسم القالب</Label>
                  <Input
                    id="templateName"
                    value={formData.templateName}
                    onChange={(e) => setFormData(prev => ({ ...prev, templateName: e.target.value }))}
                    placeholder="otp_verification"
                    className="mb-2"
                  />
                  <p className="text-sm text-gray-500">
                    أدخل اسم القالب الذي أنشأته في WhatsApp Business Manager
                  </p>
                </div>

                <div>
                  <Label htmlFor="language">لغة القالب</Label>
                  <Select
                    value={formData.language}
                    onValueChange={(value: 'ar' | 'en') => setFormData(prev => ({ ...prev, language: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ar">العربية</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={() => saveSettings.mutate(formData)} 
                  disabled={saveSettings.isPending}
                >
                  {saveSettings.isPending ? 'جاري الحفظ...' : 'حفظ إعدادات القالب'}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5" />
                  اختبار إرسال OTP
                </CardTitle>
                <CardDescription>
                  اختبر إرسال رسالة OTP باستخدام القالب المحدد
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleTestOTP} className="space-y-4">
                  <div>
                    <Label htmlFor="testPhone">رقم الهاتف للاختبار</Label>
                    <Input
                      id="testPhone"
                      value={testPhone}
                      onChange={(e) => setTestPhone(e.target.value)}
                      placeholder="+212123456789"
                      type="tel"
                    />
                  </div>
                  <div>
                    <Label htmlFor="testOTP">رمز OTP للاختبار</Label>
                    <Input
                      id="testOTP"
                      value={testOTP}
                      onChange={(e) => setTestOTP(e.target.value)}
                      placeholder="123456"
                      maxLength={6}
                    />
                  </div>
                  <Button 
                    type="submit" 
                    disabled={testOTPSending.isPending}
                    className="w-full"
                  >
                    {testOTPSending.isPending ? 'جاري الإرسال...' : 'إرسال رسالة اختبار'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="stats">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">الرسائل المرسلة</p>
                    <p className="text-2xl font-bold text-gray-900">{stats?.messagesSent || 0}</p>
                  </div>
                  <Send className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">تم التسليم</p>
                    <p className="text-2xl font-bold text-green-600">{stats?.messagesDelivered || 0}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">فشل الإرسال</p>
                    <p className="text-2xl font-bold text-red-600">{stats?.messagesFailed || 0}</p>
                  </div>
                  <XCircle className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">القوالب المستخدمة</p>
                    <p className="text-2xl font-bold text-purple-600">{stats?.templatesUsed || 0}</p>
                  </div>
                  <MessageCircle className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>حالة الاتصال</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Badge variant={settings?.phoneNumberId ? "default" : "destructive"}>
                  {settings?.phoneNumberId ? "متصل" : "غير متصل"}
                </Badge>
                <span className="text-sm text-gray-600">
                  {settings?.phoneNumberId ? "WhatsApp API جاهز للاستخدام" : "يرجى تكوين إعدادات API"}
                </span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
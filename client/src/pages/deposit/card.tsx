import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, CreditCard, Loader2, CheckCircle, XCircle } from "lucide-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

declare global {
  interface Window {
    FlutterwaveCheckout: any;
  }
}

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export default function CardDeposit() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [amount, setAmount] = useState("");
  const [isFlutterwaveLoaded, setIsFlutterwaveLoaded] = useState(false);
  const [flutterwavePublicKey, setFlutterwavePublicKey] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');

  const { data: user } = useQuery<User>({
    queryKey: ['/api/auth/me'],
  });

  useEffect(() => {
    fetch('/api/public/flutterwave-config')
      .then(res => res.json())
      .then(data => {
        if (data.publicKey) {
          setFlutterwavePublicKey(data.publicKey);
        }
      })
      .catch(err => console.error('Failed to fetch Flutterwave config:', err));
  }, []);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.flutterwave.com/v3.js';
    script.async = true;
    script.onload = () => setIsFlutterwaveLoaded(true);
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const quickAmounts = [10, 25, 50, 100, 250, 500];

  const handleDeposit = async () => {
    const depositAmount = parseFloat(amount);
    
    if (!depositAmount || depositAmount < 1) {
      toast({
        title: "خطأ",
        description: "الرجاء إدخال مبلغ صحيح (الحد الأدنى $1)",
        variant: "destructive",
      });
      return;
    }

    if (!isFlutterwaveLoaded || !flutterwavePublicKey) {
      toast({
        title: "خطأ",
        description: "جاري تحميل بوابة الدفع، الرجاء الانتظار...",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "خطأ",
        description: "يجب تسجيل الدخول أولاً",
        variant: "destructive",
      });
      return;
    }

    setPaymentStatus('processing');

    try {
      const initResponse = await fetch('/api/deposit/card/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: depositAmount }),
      });

      if (!initResponse.ok) {
        const errorData = await initResponse.json();
        throw new Error(errorData.message || 'Failed to initialize deposit');
      }

      const { txRef } = await initResponse.json();

      const modal = window.FlutterwaveCheckout({
        public_key: flutterwavePublicKey,
        tx_ref: txRef,
        amount: depositAmount,
        currency: 'USD',
        payment_options: 'card',
        customer: {
          email: user.email,
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email,
          phone_number: user.phone || '',
        },
        customizations: {
          title: 'إيداع رصيد',
          description: `إيداع $${depositAmount} في المحفظة`,
          logo: '',
        },
        callback: async function(data: any) {
          console.log('Payment callback:', data);
          modal.close();
          
          if (data.status === 'successful') {
            try {
              const verifyResponse = await fetch(`/api/deposit/card/verify/${data.transaction_id}`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  txRef: txRef,
                  amount: depositAmount,
                }),
              });

              if (verifyResponse.ok) {
                setPaymentStatus('success');
                toast({
                  title: "تم الإيداع بنجاح!",
                  description: `تم إضافة $${depositAmount} إلى رصيدك`,
                });
                setTimeout(() => {
                  setLocation('/wallet');
                }, 2000);
              } else {
                setPaymentStatus('failed');
                toast({
                  title: "خطأ في التحقق",
                  description: "حدث خطأ أثناء التحقق من الدفع",
                  variant: "destructive",
                });
              }
            } catch (error) {
              console.error('Verification error:', error);
              setPaymentStatus('failed');
            }
          } else {
            setPaymentStatus('failed');
            toast({
              title: "فشل الدفع",
              description: "لم تتم عملية الدفع بنجاح",
              variant: "destructive",
            });
          }
        },
        onclose: function() {
          if (paymentStatus === 'processing') {
            setPaymentStatus('idle');
          }
        },
      });
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentStatus('idle');
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء فتح بوابة الدفع",
        variant: "destructive",
      });
    }
  };

  if (paymentStatus === 'success') {
    return (
      <div className="min-h-screen bg-[#0f0f23] text-white flex items-center justify-center">
        <div className="text-center space-y-4 p-8">
          <div className="w-20 h-20 mx-auto bg-green-500/20 rounded-full flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-400" />
          </div>
          <h2 className="text-2xl font-bold">تم الإيداع بنجاح!</h2>
          <p className="text-gray-400">تم إضافة ${amount} إلى رصيدك</p>
          <Button
            onClick={() => setLocation('/wallet')}
            className="mt-4 bg-purple-600 hover:bg-purple-700"
            data-testid="button-go-to-wallet"
          >
            الذهاب للمحفظة
          </Button>
        </div>
      </div>
    );
  }

  if (paymentStatus === 'failed') {
    return (
      <div className="min-h-screen bg-[#0f0f23] text-white flex items-center justify-center">
        <div className="text-center space-y-4 p-8">
          <div className="w-20 h-20 mx-auto bg-red-500/20 rounded-full flex items-center justify-center">
            <XCircle className="w-12 h-12 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold">فشل الإيداع</h2>
          <p className="text-gray-400">لم تتم عملية الدفع بنجاح</p>
          <Button
            onClick={() => setPaymentStatus('idle')}
            className="mt-4 bg-purple-600 hover:bg-purple-700"
            data-testid="button-try-again"
          >
            حاول مرة أخرى
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f23] text-white pb-24">
      <div className="max-w-md mx-auto px-4 py-6">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/deposit")}
            className="p-2 hover:bg-purple-500/20 text-gray-400 hover:text-white"
            data-testid="button-back"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-bold text-white">الإيداع عبر البطاقة</h1>
        </div>

        <div className="bg-[#1a1a35] rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <CreditCard className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white">البطاقة الائتمانية</h3>
              <p className="text-sm text-gray-400">Visa, Mastercard</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">مبلغ الإيداع (USD)</label>
              <Input
                type="number"
                placeholder="أدخل المبلغ"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-[#0f0f23] border-[#2a2a45] text-white text-lg h-14 text-center"
                data-testid="input-amount"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              {quickAmounts.map((quickAmount) => (
                <Button
                  key={quickAmount}
                  variant="outline"
                  onClick={() => setAmount(quickAmount.toString())}
                  className={`border-[#2a2a45] hover:border-purple-500 hover:bg-purple-500/10 ${
                    amount === quickAmount.toString() 
                      ? 'border-purple-500 bg-purple-500/10 text-purple-400' 
                      : 'text-gray-300'
                  }`}
                  data-testid={`button-amount-${quickAmount}`}
                >
                  ${quickAmount}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-[#1a1a35]/60 rounded-xl p-4 mb-6">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400">رسوم المعالجة</span>
            <span className="text-gray-300">$0.00</span>
          </div>
          <div className="flex justify-between items-center text-sm mt-2">
            <span className="text-gray-400">المبلغ الإجمالي</span>
            <span className="text-white font-semibold">${amount || '0.00'}</span>
          </div>
        </div>

        <Button
          onClick={handleDeposit}
          disabled={!amount || paymentStatus === 'processing' || !isFlutterwaveLoaded || !flutterwavePublicKey}
          className="w-full py-6 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl text-lg"
          data-testid="button-deposit"
        >
          {paymentStatus === 'processing' ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              جاري المعالجة...
            </>
          ) : !isFlutterwaveLoaded || !flutterwavePublicKey ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              جاري التحميل...
            </>
          ) : (
            <>
              <CreditCard className="w-5 h-5 mr-2" />
              إيداع ${amount || '0'}
            </>
          )}
        </Button>

        <p className="text-center text-gray-500 text-sm mt-4">
          الدفع آمن ومشفر عبر Flutterwave
        </p>
      </div>
    </div>
  );
}

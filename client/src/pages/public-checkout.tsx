import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

declare global {
  interface Window {
    FlutterwaveCheckout: any;
  }
}

export default function PublicCheckoutPage() {
  const [, params] = useRoute("/pay/:txRef");
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
  const [isFlutterwaveLoaded, setIsFlutterwaveLoaded] = useState(false);

  const { data: paymentLink, isLoading, error } = useQuery({
    queryKey: [`/api/public/payment-link/${params?.txRef}`],
    enabled: !!params?.txRef,
  });

  // Load Flutterwave script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.flutterwave.com/v3.js';
    script.async = true;
    script.onload = () => setIsFlutterwaveLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = () => {
    if (!paymentLink || !isFlutterwaveLoaded) return;

    setPaymentStatus('processing');

    const modal = window.FlutterwaveCheckout({
      public_key: import.meta.env.VITE_FLW_PUBLIC_KEY || '',
      tx_ref: paymentLink.txRef,
      amount: parseFloat(paymentLink.amount),
      currency: paymentLink.currency || 'NGN',
      payment_options: paymentLink.paymentOptions || 'card',
      customer: {
        email: paymentLink.customerEmail,
        name: paymentLink.customerName || '',
        phone_number: paymentLink.customerPhone || '',
      },
      customizations: {
        title: paymentLink.title,
        description: paymentLink.description || '',
        logo: paymentLink.logo || '',
      },
      callback: function(data: any) {
        console.log('Payment callback:', data);
        if (data.status === 'successful') {
          setPaymentStatus('success');
          // Verify payment on backend
          fetch(`/api/public/payment-verify/${data.transaction_id}`, {
            method: 'POST',
          }).catch(console.error);
        } else {
          setPaymentStatus('failed');
        }
        modal.close();
      },
      onclose: function() {
        if (paymentStatus === 'processing') {
          setPaymentStatus('idle');
        }
      },
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !paymentLink) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-red-200 dark:border-red-800">
          <CardHeader>
            <div className="flex items-center gap-2">
              <XCircle className="w-6 h-6 text-red-600" />
              <CardTitle className="text-red-900 dark:text-red-100">Payment Link Not Found</CardTitle>
            </div>
            <CardDescription className="text-red-700 dark:text-red-300">
              This payment link is invalid or has expired.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (paymentLink.status !== 'active') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-orange-200 dark:border-orange-800">
          <CardHeader>
            <div className="flex items-center gap-2">
              <XCircle className="w-6 h-6 text-orange-600" />
              <CardTitle className="text-orange-900 dark:text-orange-100">Payment Link Inactive</CardTitle>
            </div>
            <CardDescription className="text-orange-700 dark:text-orange-300">
              This payment link has been disabled or expired.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-2">
          {paymentLink.logo && (
            <div className="flex justify-center mb-4">
              <img src={paymentLink.logo} alt="Logo" className="h-16 w-auto" />
            </div>
          )}
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            {paymentLink.title}
          </CardTitle>
          {paymentLink.description && (
            <CardDescription className="text-base text-gray-600 dark:text-gray-300">
              {paymentLink.description}
            </CardDescription>
          )}
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Amount Display */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Amount to Pay</p>
            <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
              {paymentLink.currency} {parseFloat(paymentLink.amount).toLocaleString()}
            </p>
          </div>

          {/* Customer Information */}
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400">Email:</span>
              <span className="font-medium text-gray-900 dark:text-white">{paymentLink.customerEmail}</span>
            </div>
            {paymentLink.customerName && (
              <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Name:</span>
                <span className="font-medium text-gray-900 dark:text-white">{paymentLink.customerName}</span>
              </div>
            )}
            {paymentLink.customerPhone && (
              <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Phone:</span>
                <span className="font-medium text-gray-900 dark:text-white">{paymentLink.customerPhone}</span>
              </div>
            )}
          </div>

          {/* Payment Status Messages */}
          {paymentStatus === 'success' && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <div className="flex items-center gap-2 text-green-800 dark:text-green-200">
                <CheckCircle2 className="w-5 h-5" />
                <p className="font-medium">Payment Successful!</p>
              </div>
              <p className="text-sm text-green-700 dark:text-green-300 mt-2">
                Thank you for your payment. You will receive a confirmation email shortly.
              </p>
            </div>
          )}

          {paymentStatus === 'failed' && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-center gap-2 text-red-800 dark:text-red-200">
                <XCircle className="w-5 h-5" />
                <p className="font-medium">Payment Failed</p>
              </div>
              <p className="text-sm text-red-700 dark:text-red-300 mt-2">
                Your payment was not successful. Please try again.
              </p>
            </div>
          )}

          {/* Payment Button */}
          {paymentStatus === 'idle' && (
            <Button
              onClick={handlePayment}
              disabled={!isFlutterwaveLoaded}
              className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
              data-testid="button-pay-now"
            >
              {!isFlutterwaveLoaded ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5 mr-2" />
                  Pay Now
                </>
              )}
            </Button>
          )}

          {paymentStatus === 'processing' && (
            <Button
              disabled
              className="w-full h-12 text-lg"
              data-testid="button-processing"
            >
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Processing Payment...
            </Button>
          )}

          {paymentStatus === 'success' && paymentLink.redirectUrl && (
            <Button
              onClick={() => window.location.href = paymentLink.redirectUrl!}
              className="w-full h-12 text-lg"
              data-testid="button-continue"
            >
              Continue
            </Button>
          )}

          {paymentStatus === 'failed' && (
            <Button
              onClick={() => setPaymentStatus('idle')}
              className="w-full h-12 text-lg"
              variant="outline"
              data-testid="button-try-again"
            >
              Try Again
            </Button>
          )}

          {/* Security Badge */}
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400 pt-4">
            <Badge variant="outline" className="text-xs">
              <CreditCard className="w-3 h-3 mr-1" />
              Secure Payment
            </Badge>
            <span>•</span>
            <span>Powered by Flutterwave</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

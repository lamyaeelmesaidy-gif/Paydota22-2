import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, Loader2, CheckCircle2, XCircle, Lock, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { PaymentLink } from "@shared/schema";

export default function PublicCheckoutPage() {
  const [, params] = useRoute("/pay/:txRef");
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'card_input' | 'processing' | 'pin_required' | 'otp_required' | 'redirect_required' | 'success' | 'failed'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  
  const [cardNumber, setCardNumber] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [cvv, setCvv] = useState('');
  const [pin, setPin] = useState('');
  const [otp, setOtp] = useState('');
  const [flwRef, setFlwRef] = useState('');
  const [redirectUrl, setRedirectUrl] = useState('');

  const { data: paymentLink, isLoading, error } = useQuery<PaymentLink>({
    queryKey: [`/api/public/payment-link/${params?.txRef}`],
    enabled: !!params?.txRef,
  });

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    if (formatted.replace(/\s/g, '').length <= 16) {
      setCardNumber(formatted);
    }
  };

  const getCardType = (number: string) => {
    const cleanNumber = number.replace(/\s/g, '');
    if (/^4/.test(cleanNumber)) return 'visa';
    if (/^5[1-5]/.test(cleanNumber)) return 'mastercard';
    if (/^3[47]/.test(cleanNumber)) return 'amex';
    if (/^6(?:011|5)/.test(cleanNumber)) return 'discover';
    return 'unknown';
  };

  const handlePayment = async () => {
    if (!paymentLink) return;
    
    setPaymentStatus('processing');
    setErrorMessage('');

    try {
      const response = await fetch('/api/public/charge-card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          txRef: paymentLink.txRef,
          cardNumber: cardNumber.replace(/\s/g, ''),
          cvv,
          expiryMonth,
          expiryYear,
          amount: paymentLink.amount,
          currency: paymentLink.currency || 'USD',
          customer: {
            email: paymentLink.customerEmail,
            name: paymentLink.customerName || '',
            phonenumber: paymentLink.customerPhone || '',
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Payment failed');
      }

      handleChargeResponse(data);
    } catch (err: any) {
      setPaymentStatus('failed');
      setErrorMessage(err.message || 'Payment failed. Please try again.');
    }
  };

  const handleChargeResponse = (data: any) => {
    if (data.status === 'success' && data.data?.status === 'successful') {
      setPaymentStatus('success');
      fetch(`/api/public/payment-verify/${data.data.id}`, { method: 'POST' }).catch(console.error);
      return;
    }

    if (data.data?.meta?.authorization) {
      const auth = data.data.meta.authorization;
      setFlwRef(data.data.flw_ref);

      if (auth.mode === 'pin') {
        setPaymentStatus('pin_required');
      } else if (auth.mode === 'redirect') {
        setRedirectUrl(auth.redirect);
        setPaymentStatus('redirect_required');
      } else if (auth.mode === 'otp') {
        setPaymentStatus('otp_required');
      } else if (auth.mode === 'avs_noauth') {
        setPaymentStatus('success');
        fetch(`/api/public/payment-verify/${data.data.id}`, { method: 'POST' }).catch(console.error);
      }
    } else if (data.status === 'pending' || data.data?.status === 'pending') {
      setPaymentStatus('otp_required');
      setFlwRef(data.data?.flw_ref || '');
    } else {
      setPaymentStatus('failed');
      setErrorMessage(data.message || data.data?.processor_response || 'Payment failed');
    }
  };

  const handlePinSubmit = async () => {
    if (!paymentLink) return;
    
    setPaymentStatus('processing');
    setErrorMessage('');

    try {
      const response = await fetch('/api/public/charge-card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          txRef: paymentLink.txRef,
          cardNumber: cardNumber.replace(/\s/g, ''),
          cvv,
          expiryMonth,
          expiryYear,
          amount: paymentLink.amount,
          currency: paymentLink.currency || 'USD',
          customer: {
            email: paymentLink.customerEmail,
            name: paymentLink.customerName || '',
            phonenumber: paymentLink.customerPhone || '',
          },
          authorization: {
            mode: 'pin',
            pin: pin,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Payment failed');
      }

      handleChargeResponse(data);
    } catch (err: any) {
      setPaymentStatus('failed');
      setErrorMessage(err.message || 'Payment failed. Please try again.');
    }
  };

  const handleOtpSubmit = async () => {
    setPaymentStatus('processing');
    setErrorMessage('');

    try {
      const response = await fetch('/api/public/validate-charge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          flwRef,
          otp,
          txRef: paymentLink?.txRef,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'OTP validation failed');
      }

      if (data.status === 'successful' || data.data?.status === 'successful') {
        setPaymentStatus('success');
      } else {
        setPaymentStatus('failed');
        setErrorMessage(data.message || 'Payment verification failed');
      }
    } catch (err: any) {
      setPaymentStatus('failed');
      setErrorMessage(err.message || 'OTP validation failed. Please try again.');
    }
  };

  const cardType = getCardType(cardNumber);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
          <CardContent className="pt-8 pb-8">
            <div className="flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !paymentLink) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/10 backdrop-blur-xl border-red-500/30 shadow-2xl">
          <CardHeader className="text-center space-y-3 pt-8">
            <div className="flex justify-center">
              <div className="p-3 bg-red-500/20 rounded-full">
                <XCircle className="w-8 h-8 text-red-400" />
              </div>
            </div>
            <CardTitle className="text-2xl text-white">Payment Link Not Found</CardTitle>
            <CardDescription className="text-gray-300">
              This payment link is invalid or has expired.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (paymentLink.status !== 'active') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/10 backdrop-blur-xl border-orange-500/30 shadow-2xl">
          <CardHeader className="text-center space-y-3 pt-8">
            <div className="flex justify-center">
              <div className="p-3 bg-orange-500/20 rounded-full">
                <XCircle className="w-8 h-8 text-orange-400" />
              </div>
            </div>
            <CardTitle className="text-2xl text-white">Payment Link Inactive</CardTitle>
            <CardDescription className="text-gray-300">
              This payment link has been disabled or expired.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-md space-y-6">
        {/* Amount Card */}
        <Card className="bg-gradient-to-r from-purple-600 to-pink-600 border-0 shadow-2xl overflow-hidden">
          <CardContent className="p-6 text-center">
            {paymentLink.logo && (
              <img src={paymentLink.logo} alt="Logo" className="h-12 w-auto mx-auto mb-4" />
            )}
            <h2 className="text-white/80 text-sm font-medium mb-1">{paymentLink.title}</h2>
            <p className="text-4xl font-bold text-white">
              {paymentLink.currency} {parseFloat(paymentLink.amount).toLocaleString()}
            </p>
            {paymentLink.description && (
              <p className="text-white/70 text-sm mt-2">{paymentLink.description}</p>
            )}
          </CardContent>
        </Card>

        {/* Main Payment Card */}
        <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Card Details
            </CardTitle>
            <CardDescription className="text-gray-300">
              Enter your card information securely
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Success State */}
            {paymentStatus === 'success' && (
              <div className="text-center py-8 space-y-4">
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10 text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">Payment Successful!</h3>
                <p className="text-gray-300">Thank you for your payment.</p>
                {paymentLink.redirectUrl && (
                  <Button
                    onClick={() => window.location.href = paymentLink.redirectUrl!}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                  >
                    Continue
                  </Button>
                )}
              </div>
            )}

            {/* Failed State */}
            {paymentStatus === 'failed' && (
              <div className="text-center py-8 space-y-4">
                <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
                  <XCircle className="w-10 h-10 text-red-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">Payment Failed</h3>
                <p className="text-red-300">{errorMessage || 'Your payment was not successful.'}</p>
                <Button
                  onClick={() => {
                    setPaymentStatus('idle');
                    setErrorMessage('');
                    setPin('');
                    setOtp('');
                  }}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                >
                  Try Again
                </Button>
              </div>
            )}

            {/* Redirect Required */}
            {paymentStatus === 'redirect_required' && (
              <div className="text-center py-8 space-y-4">
                <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto">
                  <Shield className="w-10 h-10 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-white">3D Secure Verification Required</h3>
                <p className="text-gray-300">You will be redirected to your bank for verification.</p>
                <Button
                  onClick={() => window.location.href = redirectUrl}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                >
                  Continue to Verification
                </Button>
              </div>
            )}

            {/* PIN Required */}
            {paymentStatus === 'pin_required' && (
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <Lock className="w-12 h-12 text-purple-400 mx-auto mb-2" />
                  <h3 className="text-lg font-semibold text-white">Enter Your Card PIN</h3>
                  <p className="text-gray-400 text-sm">Your card requires PIN verification</p>
                </div>
                <div>
                  <Label htmlFor="pin" className="text-gray-300">PIN</Label>
                  <Input
                    id="pin"
                    type="password"
                    maxLength={4}
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                    className="bg-white/10 border-white/20 text-white text-center text-2xl tracking-widest"
                    placeholder="••••"
                    data-testid="input-pin"
                  />
                </div>
                <Button
                  onClick={handlePinSubmit}
                  disabled={pin.length < 4}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white h-12"
                  data-testid="button-submit-pin"
                >
                  Verify PIN
                </Button>
              </div>
            )}

            {/* OTP Required */}
            {paymentStatus === 'otp_required' && (
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <Shield className="w-12 h-12 text-purple-400 mx-auto mb-2" />
                  <h3 className="text-lg font-semibold text-white">Enter OTP Code</h3>
                  <p className="text-gray-400 text-sm">A verification code was sent to your phone/email</p>
                </div>
                <div>
                  <Label htmlFor="otp" className="text-gray-300">OTP Code</Label>
                  <Input
                    id="otp"
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    className="bg-white/10 border-white/20 text-white text-center text-2xl tracking-widest"
                    placeholder="••••••"
                    data-testid="input-otp"
                  />
                </div>
                <Button
                  onClick={handleOtpSubmit}
                  disabled={otp.length < 4}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white h-12"
                  data-testid="button-submit-otp"
                >
                  Verify OTP
                </Button>
              </div>
            )}

            {/* Processing State */}
            {paymentStatus === 'processing' && (
              <div className="text-center py-8 space-y-4">
                <Loader2 className="w-12 h-12 animate-spin text-purple-400 mx-auto" />
                <h3 className="text-xl font-semibold text-white">Processing Payment...</h3>
                <p className="text-gray-400">Please wait while we process your payment</p>
              </div>
            )}

            {/* Card Input Form */}
            {paymentStatus === 'idle' && (
              <div className="space-y-4">
                {/* Card Number */}
                <div className="space-y-2">
                  <Label htmlFor="cardNumber" className="text-gray-300">Card Number</Label>
                  <div className="relative">
                    <Input
                      id="cardNumber"
                      type="text"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      className="bg-white/10 border-white/20 text-white pl-12 h-12 text-lg"
                      placeholder="1234 5678 9012 3456"
                      data-testid="input-card-number"
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                      {cardType === 'visa' && <span className="text-blue-400 font-bold text-sm">VISA</span>}
                      {cardType === 'mastercard' && <span className="text-orange-400 font-bold text-sm">MC</span>}
                      {cardType === 'amex' && <span className="text-blue-300 font-bold text-sm">AMEX</span>}
                      {cardType === 'discover' && <span className="text-orange-300 font-bold text-sm">DISC</span>}
                      {cardType === 'unknown' && <CreditCard className="w-5 h-5 text-gray-400" />}
                    </div>
                  </div>
                </div>

                {/* Expiry and CVV */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="expiryMonth" className="text-gray-300">Month</Label>
                    <Input
                      id="expiryMonth"
                      type="text"
                      maxLength={2}
                      value={expiryMonth}
                      onChange={(e) => setExpiryMonth(e.target.value.replace(/\D/g, ''))}
                      className="bg-white/10 border-white/20 text-white text-center h-12"
                      placeholder="MM"
                      data-testid="input-expiry-month"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expiryYear" className="text-gray-300">Year</Label>
                    <Input
                      id="expiryYear"
                      type="text"
                      maxLength={2}
                      value={expiryYear}
                      onChange={(e) => setExpiryYear(e.target.value.replace(/\D/g, ''))}
                      className="bg-white/10 border-white/20 text-white text-center h-12"
                      placeholder="YY"
                      data-testid="input-expiry-year"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv" className="text-gray-300">CVV</Label>
                    <Input
                      id="cvv"
                      type="password"
                      maxLength={4}
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                      className="bg-white/10 border-white/20 text-white text-center h-12"
                      placeholder="•••"
                      data-testid="input-cvv"
                    />
                  </div>
                </div>

                {/* Customer Info */}
                <div className="bg-white/5 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Email</span>
                    <span className="text-white">{paymentLink.customerEmail}</span>
                  </div>
                  {paymentLink.customerName && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Name</span>
                      <span className="text-white">{paymentLink.customerName}</span>
                    </div>
                  )}
                </div>

                {/* Pay Button */}
                <Button
                  onClick={handlePayment}
                  disabled={cardNumber.replace(/\s/g, '').length < 15 || !expiryMonth || !expiryYear || cvv.length < 3}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white h-14 text-lg font-semibold"
                  data-testid="button-pay"
                >
                  <Lock className="w-5 h-5 mr-2" />
                  Pay {paymentLink.currency} {parseFloat(paymentLink.amount).toLocaleString()}
                </Button>

                {/* Security Badge */}
                <div className="flex items-center justify-center gap-2 text-gray-400 text-sm pt-2">
                  <Shield className="w-4 h-4" />
                  <span>Secured by 256-bit SSL encryption</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-gray-400 text-xs">
          <p>Powered by Flutterwave</p>
        </div>
      </div>
    </div>
  );
}

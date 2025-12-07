import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle, 
  XCircle, 
  Loader2,
  ArrowRight,
  Home
} from "lucide-react";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";

interface VerificationResult {
  success: boolean;
  status: string;
  amount?: string;
  currency?: string;
  message?: string;
}

export default function PaymentVerify() {
  const [, setLocation] = useLocation();
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'failed' | 'pending'>('loading');
  const [verificationData, setVerificationData] = useState<VerificationResult | null>(null);

  const verifyMutation = useMutation({
    mutationFn: (params: { transaction_id?: string; tx_ref?: string; status?: string }) =>
      apiRequest("GET", `/api/payment/verify-deposit?${new URLSearchParams(params as any).toString()}`),
    onSuccess: (data: any) => {
      console.log('Verification response:', data);
      if (data.transaction?.status === 'successful' || data.verification?.status === 'successful') {
        setVerificationStatus('success');
        setVerificationData({
          success: true,
          status: 'successful',
          amount: data.transaction?.amount || data.verification?.data?.amount,
          currency: data.transaction?.currency || data.verification?.data?.currency,
        });
      } else if (data.transaction?.status === 'pending') {
        setVerificationStatus('pending');
        setVerificationData({
          success: false,
          status: 'pending',
          message: 'Payment is still being processed',
        });
      } else {
        setVerificationStatus('failed');
        setVerificationData({
          success: false,
          status: data.transaction?.status || 'failed',
          message: data.message || 'Payment verification failed',
        });
      }
    },
    onError: (error: any) => {
      console.error('Verification error:', error);
      setVerificationStatus('failed');
      setVerificationData({
        success: false,
        status: 'error',
        message: error.message || 'Failed to verify payment',
      });
    },
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const transactionId = urlParams.get('transaction_id');
    const txRef = urlParams.get('tx_ref');
    const status = urlParams.get('status');

    console.log('Payment verification params:', { transactionId, txRef, status });

    if (transactionId || txRef) {
      verifyMutation.mutate({
        transaction_id: transactionId || undefined,
        tx_ref: txRef || undefined,
        status: status || undefined,
      });
    } else {
      setVerificationStatus('failed');
      setVerificationData({
        success: false,
        status: 'error',
        message: 'No transaction information found',
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 text-center">
        {verificationStatus === 'loading' && (
          <>
            <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Loader2 className="h-10 w-10 text-blue-600 dark:text-blue-400 animate-spin" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Verifying Payment
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Please wait while we verify your payment...
            </p>
          </>
        )}

        {verificationStatus === 'success' && (
          <>
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Payment Successful!
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Your deposit has been processed successfully.
            </p>
            {verificationData?.amount && (
              <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 mb-6">
                <p className="text-sm text-gray-600 dark:text-gray-400">Amount Deposited</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {verificationData.currency} {parseFloat(verificationData.amount).toLocaleString()}
                </p>
              </div>
            )}
            <div className="space-y-3">
              <Button
                onClick={() => setLocation('/dashboard')}
                className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl"
                data-testid="button-go-dashboard"
              >
                <Home className="h-5 w-5 mr-2" />
                Go to Dashboard
              </Button>
              <Button
                onClick={() => setLocation('/wallet')}
                variant="outline"
                className="w-full h-12 border-gray-200 dark:border-gray-600 rounded-xl"
                data-testid="button-view-wallet"
              >
                View Wallet
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </>
        )}

        {verificationStatus === 'pending' && (
          <>
            <div className="w-20 h-20 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Loader2 className="h-10 w-10 text-yellow-600 dark:text-yellow-400 animate-spin" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Payment Processing
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Your payment is still being processed. This may take a few moments.
            </p>
            <div className="space-y-3">
              <Button
                onClick={() => window.location.reload()}
                className="w-full h-12 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-xl"
                data-testid="button-check-again"
              >
                Check Again
              </Button>
              <Button
                onClick={() => setLocation('/dashboard')}
                variant="outline"
                className="w-full h-12 border-gray-200 dark:border-gray-600 rounded-xl"
                data-testid="button-go-dashboard-pending"
              >
                <Home className="h-5 w-5 mr-2" />
                Go to Dashboard
              </Button>
            </div>
          </>
        )}

        {verificationStatus === 'failed' && (
          <>
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="h-10 w-10 text-red-600 dark:text-red-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Payment Failed
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {verificationData?.message || 'We could not verify your payment. Please try again.'}
            </p>
            <div className="space-y-3">
              <Button
                onClick={() => setLocation('/deposit/card')}
                className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl"
                data-testid="button-try-again"
              >
                Try Again
              </Button>
              <Button
                onClick={() => setLocation('/dashboard')}
                variant="outline"
                className="w-full h-12 border-gray-200 dark:border-gray-600 rounded-xl"
                data-testid="button-go-dashboard-failed"
              >
                <Home className="h-5 w-5 mr-2" />
                Go to Dashboard
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

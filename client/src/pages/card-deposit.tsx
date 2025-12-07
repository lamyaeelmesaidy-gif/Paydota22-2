import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  ArrowLeft, 
  CreditCard, 
  Lock,
  CheckCircle,
  Loader2,
  ExternalLink
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { SiVisa, SiMastercard } from "react-icons/si";

interface DepositResponse {
  success: boolean;
  paymentUrl: string;
  txRef: string;
  amount: string;
  currency: string;
}

export default function CardDeposit() {
  const [, setLocation] = useLocation();
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [paymentInitiated, setPaymentInitiated] = useState(false);
  const [paymentData, setPaymentData] = useState<DepositResponse | null>(null);
  const { toast } = useToast();

  const { data: user } = useQuery<any>({
    queryKey: ['/api/user'],
  });

  const createDepositMutation = useMutation({
    mutationFn: (data: { amount: number; currency: string }) =>
      apiRequest("POST", "/api/deposit/card", data),
    onSuccess: (data: DepositResponse) => {
      setPaymentData(data);
      setPaymentInitiated(true);
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      }
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to initiate payment",
        variant: "destructive",
      });
    },
  });

  const handleDeposit = () => {
    const amountNum = parseFloat(amount);
    if (!amountNum || amountNum <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount greater than 0",
        variant: "destructive",
      });
      return;
    }

    if (amountNum < 1) {
      toast({
        title: "Minimum Amount",
        description: "Minimum deposit amount is $1.00",
        variant: "destructive",
      });
      return;
    }

    createDepositMutation.mutate({ amount: amountNum, currency });
  };

  const quickAmounts = [10, 25, 50, 100, 250, 500];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mobile-safe-area">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 p-3 sm:p-4 z-50">
          <div className="flex items-center gap-3">
            <Link href="/deposit">
              <Button variant="ghost" size="sm" className="p-2 hover:bg-purple-500/10 rounded-full" data-testid="button-back">
                <ArrowLeft className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700 dark:text-gray-300" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <CreditCard className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                Card Deposit
              </h1>
            </div>
          </div>
        </div>

        <div className="px-3 sm:px-4 pb-20 space-y-4 sm:space-y-6 max-w-md mx-auto pt-4">
          {!paymentInitiated ? (
            <>
              <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-4 sm:p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                    <CreditCard className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Deposit with Card</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Visa, Mastercard accepted</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="amount" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Amount
                    </Label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-semibold text-gray-400">
                        $
                      </span>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="h-14 text-xl font-semibold text-center pl-8 border-gray-200 dark:border-gray-600 focus:border-purple-500/80 focus:ring-purple-500/20 rounded-xl dark:bg-gray-700 dark:text-white"
                        data-testid="input-amount"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {quickAmounts.map((quickAmount) => (
                      <Button
                        key={quickAmount}
                        variant="outline"
                        onClick={() => setAmount(quickAmount.toString())}
                        className={`h-10 rounded-xl border-gray-200 dark:border-gray-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:border-purple-300 transition-all ${
                          amount === quickAmount.toString() ? 'bg-purple-50 dark:bg-purple-900/30 border-purple-400' : ''
                        }`}
                        data-testid={`button-quick-amount-${quickAmount}`}
                      >
                        ${quickAmount}
                      </Button>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="currency" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Currency
                    </Label>
                    <select
                      id="currency"
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="w-full h-12 px-4 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-purple-500/80 focus:ring-2 focus:ring-purple-500/20 outline-none"
                      data-testid="select-currency"
                    >
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                      <option value="NGN">NGN - Nigerian Naira</option>
                      <option value="GHS">GHS - Ghanaian Cedi</option>
                      <option value="KES">KES - Kenyan Shilling</option>
                      <option value="ZAR">ZAR - South African Rand</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                    <Lock className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                    <p className="text-sm text-green-800 dark:text-green-300">
                      Your payment is secured with 256-bit SSL encryption
                    </p>
                  </div>

                  <Button
                    onClick={handleDeposit}
                    disabled={createDepositMutation.isPending || !amount}
                    className="w-full h-14 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-colors text-lg"
                    data-testid="button-deposit"
                  >
                    {createDepositMutation.isPending ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Processing...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        Pay with Card
                      </span>
                    )}
                  </Button>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-center gap-4">
                  <SiVisa className="h-8 w-12 text-blue-700" />
                  <SiMastercard className="h-8 w-12 text-red-500" />
                  <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                    <Lock className="h-4 w-4" />
                    <span className="text-xs">Secure</span>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-2xl p-4">
                <h3 className="font-semibold text-purple-900 dark:text-purple-300 mb-3">
                  How it works:
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-sm text-purple-800 dark:text-purple-400">
                  <li>Enter the amount you want to deposit</li>
                  <li>You'll be redirected to secure payment page</li>
                  <li>Enter your card details</li>
                  <li>Complete the payment</li>
                  <li>Funds will be added to your wallet instantly</li>
                </ol>
              </div>
            </>
          ) : (
            <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6 shadow-sm text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Loader2 className="h-8 w-8 text-blue-600 dark:text-blue-400 animate-spin" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Redirecting to Payment...
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                You'll be redirected to our secure payment partner to complete your deposit.
              </p>
              {paymentData?.paymentUrl && (
                <Button
                  onClick={() => window.location.href = paymentData.paymentUrl}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                  data-testid="button-open-payment"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open Payment Page
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

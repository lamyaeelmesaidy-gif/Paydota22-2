import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Bell, Menu, ChevronDown, ChevronRight, Building2, Wallet } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import NotificationCenter from "@/components/notification-center";

export default function Dashboard() {
  const { t } = useLanguage();
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);
  const [sendAmount, setSendAmount] = useState("0.00");
  const [sendCurrency, setSendCurrency] = useState("USD");
  const [receiveCurrency, setReceiveCurrency] = useState("EUR");
  
  const { data: userInfo } = useQuery<any>({
    queryKey: ["/api/auth/user"],
  });

  const { data: notificationsData } = useQuery<any>({
    queryKey: ["/api/notifications/unread-count"],
  });

  const { data: kycStatus } = useQuery<any>({
    queryKey: ["/api/user/kyc-status"],
  });

  const unreadCount = notificationsData?.count || 0;

  const getFirstName = () => {
    if (userInfo?.firstName) {
      return userInfo.firstName;
    }
    return "User";
  };

  const currencies = [
    { code: "USD", flag: "🇺🇸", symbol: "$", name: "US Dollar" },
    { code: "EUR", flag: "🇪🇺", symbol: "€", name: "Euro" },
    { code: "GBP", flag: "🇬🇧", symbol: "£", name: "British Pound" },
    { code: "MAD", flag: "🇲🇦", symbol: "د.م", name: "Moroccan Dirham" },
    { code: "AED", flag: "🇦🇪", symbol: "د.إ", name: "UAE Dirham" },
    { code: "SAR", flag: "🇸🇦", symbol: "﷼", name: "Saudi Riyal" },
  ];

  const getSendCurrencyData = () => currencies.find(c => c.code === sendCurrency) || currencies[0];
  const getReceiveCurrencyData = () => currencies.find(c => c.code === receiveCurrency) || currencies[1];

  const exchangeRate = 1.1213134;
  const fee = 0;
  const totalToPay = parseFloat(sendAmount) || 0;
  const receiverGets = (totalToPay * exchangeRate).toFixed(2);

  const bgColor = '#0f0a19';
  const cardBg = '#1a1230';
  const inputBg = '#1f1730';
  const borderColor = '#2a2040';

  return (
    <div 
      className="fixed inset-0 overflow-y-auto"
      style={{ backgroundColor: bgColor }}
    >
      <div className="min-h-full flex flex-col pb-24" style={{ backgroundColor: bgColor }}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5">
          <Button 
            variant="ghost" 
            size="icon"
            className="text-purple-400 hover:bg-purple-500/20 rounded-full w-10 h-10 sm:w-11 sm:h-11"
          >
            <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
          </Button>
          
          <h1 className="text-white font-semibold text-lg sm:text-xl">Send money</h1>
          
          <Button 
            variant="ghost" 
            size="icon"
            className="relative text-purple-400 hover:bg-purple-500/20 rounded-full w-10 h-10 sm:w-11 sm:h-11"
            onClick={() => setIsNotificationCenterOpen(true)}
          >
            <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Button>
        </div>

        {/* Transfer Limit Alert */}
        <div className="px-4 sm:px-6 mb-4 sm:mb-6">
          <div 
            className="rounded-xl sm:rounded-2xl p-3 sm:p-4 flex items-start gap-3 sm:gap-4"
            style={{ backgroundColor: '#2a1f4e', border: `1px solid ${borderColor}` }}
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm sm:text-base">
                {getFirstName().charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-semibold text-sm sm:text-base mb-1">Increase transfer limit</h3>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                You're currently on Tier 2. Submit required documents to access Tier 3 and send higher amounts.{' '}
                <span className="text-purple-400 underline cursor-pointer">Complete Verification.</span>
              </p>
            </div>
          </div>
        </div>

        {/* You Send Section */}
        <div className="px-4 sm:px-6 mb-3 sm:mb-4">
          <div 
            className="rounded-xl sm:rounded-2xl p-4 sm:p-5"
            style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}` }}
          >
            <p className="text-gray-400 text-xs sm:text-sm font-medium mb-2 sm:mb-3">You Send</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span className="text-purple-400 text-2xl sm:text-3xl font-light">{getSendCurrencyData().symbol}</span>
                <input
                  type="text"
                  value={sendAmount}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9.]/g, '');
                    setSendAmount(val);
                  }}
                  className="bg-transparent text-white text-2xl sm:text-3xl font-semibold w-32 sm:w-40 outline-none"
                  placeholder="0.00"
                  data-testid="input-send-amount"
                />
              </div>
              
              <div 
                className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                style={{ backgroundColor: inputBg, border: `1px solid ${borderColor}` }}
              >
                <span className="text-xl sm:text-2xl">{getSendCurrencyData().flag}</span>
                <span className="text-white font-medium text-sm sm:text-base">{sendCurrency}</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Fee Details Section */}
        <div className="px-4 sm:px-6 mb-3 sm:mb-4">
          <div 
            className="rounded-xl sm:rounded-2xl p-4 sm:p-5 space-y-3 sm:space-y-4"
            style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}` }}
          >
            {/* Fee */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs sm:text-sm">✓</span>
                </div>
                <span className="text-gray-300 text-sm sm:text-base">Fee</span>
              </div>
              <span className="text-green-400 font-semibold text-sm sm:text-base">FREE</span>
            </div>

            {/* Total to pay */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
                  <Wallet className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                </div>
                <span className="text-gray-300 text-sm sm:text-base">Total to pay</span>
              </div>
              <span className="text-white font-semibold text-sm sm:text-base">
                {getSendCurrencyData().symbol}{totalToPay.toFixed(2)}
              </span>
            </div>

            {/* Rate */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs sm:text-sm">≈</span>
                </div>
                <span className="text-gray-300 text-sm sm:text-base">Rate</span>
              </div>
              <span className="text-white font-medium text-xs sm:text-sm">
                {getSendCurrencyData().symbol} 1 = {getReceiveCurrencyData().symbol} {exchangeRate}
              </span>
            </div>
          </div>
        </div>

        {/* Receiver Gets Section */}
        <div className="px-4 sm:px-6 mb-3 sm:mb-4">
          <div 
            className="rounded-xl sm:rounded-2xl p-4 sm:p-5"
            style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}` }}
          >
            <p className="text-gray-400 text-xs sm:text-sm font-medium mb-2 sm:mb-3">Receiver Gets</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span className="text-purple-400 text-2xl sm:text-3xl font-light">{getReceiveCurrencyData().symbol}</span>
                <span className="text-white text-2xl sm:text-3xl font-semibold">{receiverGets}</span>
              </div>
              
              <div 
                className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                style={{ backgroundColor: inputBg, border: `1px solid ${borderColor}` }}
              >
                <span className="text-xl sm:text-2xl">{getReceiveCurrencyData().flag}</span>
                <span className="text-white font-medium text-sm sm:text-base">{receiveCurrency}</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Method Section */}
        <div className="px-4 sm:px-6 mb-6">
          <p className="text-gray-500 text-xs sm:text-sm font-medium mb-2 sm:mb-3 uppercase tracking-wider">Delivery Method</p>
          <div 
            className="rounded-xl sm:rounded-2xl p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:opacity-90 transition-opacity"
            style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}` }}
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center">
                <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm sm:text-base">Bank Account</h4>
                <p className="text-gray-400 text-xs sm:text-sm">Transfers within 2 days</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Continue Button */}
        <div className="px-4 sm:px-6 mt-auto">
          <Button
            className="w-full h-12 sm:h-14 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-semibold rounded-xl sm:rounded-2xl shadow-lg shadow-purple-500/30 text-base sm:text-lg transition-all duration-300"
            data-testid="button-continue"
            disabled={totalToPay <= 0}
          >
            Continue
          </Button>
        </div>
      </div>

      {/* Notification Center */}
      <NotificationCenter 
        isOpen={isNotificationCenterOpen}
        onClose={() => setIsNotificationCenterOpen(false)}
      />
    </div>
  );
}

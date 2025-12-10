import { Button } from "@/components/ui/button";
import { CreditCard, Phone, Smartphone, Shield, Info } from "lucide-react";
import { Link } from "wouter";
import { useLanguage } from "@/hooks/useLanguage";

export default function Welcome() {
  const { t } = useLanguage();
  const bgColor = '#0f0a19';

  return (
    <div 
      className="fixed inset-0 overflow-y-auto"
      style={{ backgroundColor: bgColor }}
    >
      <div className="min-h-full flex flex-col px-4" style={{ backgroundColor: bgColor }}>
        
        {/* Logo */}
        <div className="pt-12 text-center" style={{ backgroundColor: bgColor }}>
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">W</span>
            </div>
            <span className="text-white font-bold text-xl tracking-wide">WALLET<span className="text-purple-400">PAY</span></span>
          </div>
        </div>

        {/* Header Content */}
        <div className="text-center mb-6" style={{ backgroundColor: bgColor }}>
          <h1 className="text-gray-400 text-base mb-2 font-light tracking-wide">
            Wallet account
          </h1>
          <h2 className="text-white text-2xl font-bold mb-2 tracking-tight">
            fully <span className="text-purple-400">online</span>
          </h2>
          <p className="text-gray-500 text-sm">
            We support receiving payments via credit cards
          </p>
        </div>

        {/* Center Visual Content - Card */}
        <div className="flex-1 flex items-center justify-center py-4" style={{ backgroundColor: bgColor }}>
          <div className="relative mx-auto w-full max-w-[300px]">
            {/* Decorative glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/10 rounded-3xl blur-2xl"></div>
            
            {/* Credit Card */}
            <div className="relative bg-gradient-to-br from-purple-800 via-purple-900 to-indigo-900 rounded-2xl shadow-2xl shadow-purple-500/20 p-5 transform rotate-2 border border-purple-700/50 aspect-[1.6/1]">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 via-indigo-600/20 to-transparent rounded-2xl"></div>
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-white/10 to-transparent rounded-full blur-xl"></div>
              
              <div className="relative z-10 h-full flex flex-col justify-between">
                {/* Card header */}
                <div className="flex justify-between items-start">
                  <div className="font-bold text-sm tracking-wide">
                    <span className="text-purple-300">PROBRANDIFY</span>
                  </div>
                  <div className="relative w-12 h-8">
                    <div className="absolute left-0 top-0 w-7 h-7 bg-red-500 rounded-full"></div>
                    <div className="absolute left-4 top-0 w-7 h-7 bg-yellow-400 rounded-full"></div>
                  </div>
                </div>
                
                {/* Smart chip */}
                <div className="w-10 h-7 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-md shadow-inner"></div>
                
                {/* Card number */}
                <div className="text-white font-mono text-xl font-bold tracking-wider">
                  4532 1234 5678 9012
                </div>
                
                {/* Card details */}
                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-purple-200 text-[10px] uppercase tracking-wide mb-0.5">Valid Thru</div>
                    <div className="text-white font-bold text-xs">12/28</div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-bold text-xs">AIMAD</div>
                    <div className="text-purple-200 text-[9px]">Account Holder</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Status indicators */}
            <div className="flex justify-center mt-6 space-x-2">
              <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
              <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse delay-75 shadow-lg shadow-blue-500/50"></div>
              <div className="w-2.5 h-2.5 bg-purple-500 rounded-full animate-pulse delay-150 shadow-lg shadow-purple-500/50"></div>
            </div>
          </div>
        </div>

        {/* Buttons Section */}
        <div className="pb-8 px-2" style={{ backgroundColor: bgColor }}>
          <Link href="/login">
            <Button className="w-full h-14 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/30 text-base transition-all duration-300">
              LOG IN
            </Button>
          </Link>

          <div className="h-4"></div>

          <Link href="/register">
            <Button 
              variant="outline" 
              className="w-full h-14 border-2 border-purple-500 text-purple-400 hover:text-purple-300 font-semibold rounded-xl hover:bg-purple-500/10 transition-all duration-300"
              style={{ backgroundColor: 'transparent' }}
            >
              OPEN A DIGITAL ACCOUNT
            </Button>
          </Link>
          
          {/* Bottom indicator */}
          <div className="flex justify-center pt-5">
            <div className="w-14 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-full"></div>
          </div>

          {/* Legal Links */}
          <div className="flex items-center justify-center gap-4 text-sm text-purple-400 pt-4">
            <Link href="/about" className="hover:text-purple-300 transition-colors flex items-center gap-1">
              <Info className="w-3.5 h-3.5" />
              About
            </Link>
            <span className="text-purple-600">•</span>
            <Link href="/privacy-policy" className="hover:text-purple-300 transition-colors flex items-center gap-1">
              <Shield className="w-3.5 h-3.5" />
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

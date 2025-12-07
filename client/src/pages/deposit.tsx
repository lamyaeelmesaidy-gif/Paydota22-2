import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CreditCard, Building } from "lucide-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import binanceIcon from "@assets/pngwing.com.png";

export default function Deposit() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedMethod, setSelectedMethod] = useState("card");

  return (
    <div className="min-h-screen bg-[#0f0f23] text-white">
      <div className="max-w-4xl mx-auto px-4 lg:px-6 py-6 pb-20">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/dashboard")}
            className="p-2 hover:bg-purple-500/20 text-gray-400 hover:text-white"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-bold text-white">
            Deposit Money
          </h1>
        </div>

        {/* Payment Method Section */}
        <div className="mb-6 lg:bg-[#1a1a35] lg:rounded-xl lg:shadow-sm lg:p-6">
          <h2 className="text-lg lg:text-2xl font-bold text-white mb-4">
            Payment Method
          </h2>
          
          <div className="space-y-3 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
            {/* Credit Card Option */}
            <div 
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                selectedMethod === "card" 
                  ? "border-purple-500 bg-[#1a1a35] shadow-lg shadow-purple-500/20" 
                  : "border-[#2a2a45] bg-[#1a1a35]/80 hover:border-purple-400/50"
              }`}
              onClick={() => {
                setSelectedMethod("card");
                toast({
                  title: "Credit Card",
                  description: "Credit card payment will be available soon",
                });
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <p className="font-medium text-white">Credit Card</p>
                  <p className="text-sm text-gray-400">Visa, Mastercard</p>
                </div>
              </div>
            </div>

            {/* Bank Transfer Option */}
            <div 
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                selectedMethod === "bank" 
                  ? "border-purple-500 bg-[#1a1a35] shadow-lg shadow-purple-500/20" 
                  : "border-[#2a2a45] bg-[#1a1a35]/80 hover:border-purple-400/50"
              }`}
              onClick={() => setLocation("/bank-transfer")}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <Building className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <p className="font-medium text-white">Bank Transfer</p>
                  <p className="text-sm text-gray-400">ACH, Wire Transfer</p>
                </div>
              </div>
            </div>

            {/* Binance Pay Option */}
            <div 
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                selectedMethod === "binance" 
                  ? "border-purple-500 bg-[#1a1a35] shadow-lg shadow-purple-500/20" 
                  : "border-[#2a2a45] bg-[#1a1a35]/80 hover:border-purple-400/50"
              }`}
              onClick={() => setLocation("/binance-pay")}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                  <img 
                    src={binanceIcon} 
                    alt="Binance" 
                    className="h-6 w-6 object-contain"
                  />
                </div>
                <div>
                  <p className="font-medium text-white">Binance Pay</p>
                  <p className="text-sm text-gray-400">Crypto payments</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
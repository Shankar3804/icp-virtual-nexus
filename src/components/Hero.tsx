
import { Button } from "@/components/ui/button";
import { Zap, Shield, Globe } from "lucide-react";

export const Hero = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6 animate-fade-in">
            ICP Virtual Nexus
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 animate-fade-in animation-delay-500">
            Enter the future of decentralized virtual reality powered by the Internet Computer Protocol
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="group p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 animate-scale-in">
            <Zap className="w-12 h-12 text-cyan-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-semibold text-white mb-2">Lightning Fast</h3>
            <p className="text-gray-400 text-sm">Experience real-time VR interactions with sub-second blockchain transactions</p>
          </div>
          
          <div className="group p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 animate-scale-in animation-delay-200">
            <Shield className="w-12 h-12 text-purple-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-semibold text-white mb-2">Fully Secure</h3>
            <p className="text-gray-400 text-sm">Internet Identity provides passwordless authentication with cryptographic security</p>
          </div>
          
          <div className="group p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 animate-scale-in animation-delay-400">
            <Globe className="w-12 h-12 text-pink-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-semibold text-white mb-2">Truly Decentralized</h3>
            <p className="text-gray-400 text-sm">Every component runs on-chain with no traditional servers or infrastructure</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in animation-delay-700">
          <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold px-8 py-3 rounded-full transition-all duration-300 hover:scale-105">
            Launch VR Experience
          </Button>
          <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10 px-8 py-3 rounded-full">
            View Documentation
          </Button>
        </div>
      </div>
    </div>
  );
};

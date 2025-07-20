
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface LoginCardProps {
  onLogin: (user: any) => void;
}

export const LoginCard = ({ onLogin }: LoginCardProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleInternetIdentityLogin = async () => {
    setIsLoading(true);
    try {
      // Simulate Internet Identity login process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock user data - in real implementation this would come from II
      const userData = {
        principal: "rdmx6-jaaaa-aaaah-qcaiq-cai",
        identity: "Internet Identity User",
        avatar: null,
        joinedAt: new Date().toISOString()
      };
      
      toast.success("Successfully authenticated with Internet Identity!");
      onLogin(userData);
    } catch (error) {
      toast.error("Authentication failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md bg-white/10 backdrop-blur-sm border-white/20 animate-scale-in">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 p-3 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <CardTitle className="text-2xl font-bold text-white mb-2">
          Secure Login
        </CardTitle>
        <p className="text-gray-300 text-sm">
          Access the VR ecosystem with Internet Identity - no passwords required
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={handleInternetIdentityLogin}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold py-3 rounded-lg transition-all duration-300 hover:scale-105"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Connecting to Internet Identity...
            </>
          ) : (
            <>
              <Shield className="w-4 h-4 mr-2" />
              Login with Internet Identity
            </>
          )}
        </Button>
        
        <div className="text-center text-xs text-gray-400 mt-4">
          <p>Powered by Internet Computer Protocol</p>
          <p>Your identity is secured by cryptographic authentication</p>
        </div>
      </CardContent>
    </Card>
  );
};

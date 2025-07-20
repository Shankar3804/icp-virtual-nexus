
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, Ticket, VirtualReality, LogOut, User, Calendar } from "lucide-react";
import { toast } from "sonner";

interface DashboardProps {
  user: any;
  onEnterVR: () => void;
  onLogout: () => void;
}

export const Dashboard = ({ user, onEnterVR, onLogout }: DashboardProps) => {
  const [avatarName, setAvatarName] = useState("");
  const [eventName, setEventName] = useState("");
  const [tickets, setTickets] = useState<any[]>([]);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isMinting, setIsMinting] = useState(false);

  const handleAvatarRegistration = async () => {
    if (!avatarName.trim()) {
      toast.error("Please enter an avatar name");
      return;
    }
    
    setIsRegistering(true);
    try {
      // Simulate canister call
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success(`Avatar "${avatarName}" registered successfully!`);
      setAvatarName("");
    } catch (error) {
      toast.error("Avatar registration failed");
    } finally {
      setIsRegistering(false);
    }
  };

  const handleTicketMinting = async () => {
    if (!eventName.trim()) {
      toast.error("Please enter an event name");
      return;
    }
    
    setIsMinting(true);
    try {
      // Simulate canister call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newTicket = {
        id: Date.now(),
        event: eventName,
        mintedAt: new Date().toISOString(),
        tokenId: Math.random().toString(36).substr(2, 9).toUpperCase()
      };
      
      setTickets([...tickets, newTicket]);
      toast.success(`Event ticket for "${eventName}" minted successfully!`);
      setEventName("");
    } catch (error) {
      toast.error("Ticket minting failed");
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">VR Dashboard</h1>
            <p className="text-gray-300">Principal: {user.principal}</p>
          </div>
          <Button
            onClick={onLogout}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Main Action */}
        <Card className="mb-8 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-cyan-400/30 animate-scale-in">
          <CardContent className="p-8 text-center">
            <VirtualReality className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">Ready to Enter VR?</h2>
            <p className="text-gray-300 mb-6">
              Join the immersive 3D virtual world and interact with other users in real-time
            </p>
            <Button
              onClick={onEnterVR}
              size="lg"
              className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold px-8 py-3 rounded-full transition-all duration-300 hover:scale-105"
            >
              <VirtualReality className="w-5 h-5 mr-2" />
              Launch VR Experience
            </Button>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Avatar Registration */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Avatar className="w-5 h-5 mr-2 text-purple-400" />
                Avatar Registration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="avatar-name" className="text-gray-300">Avatar Name</Label>
                <Input
                  id="avatar-name"
                  value={avatarName}
                  onChange={(e) => setAvatarName(e.target.value)}
                  placeholder="Enter your avatar name"
                  className="bg-white/5 border-white/20 text-white placeholder:text-gray-500"
                />
              </div>
              <Button
                onClick={handleAvatarRegistration}
                disabled={isRegistering}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {isRegistering ? "Registering..." : "Register Avatar"}
              </Button>
            </CardContent>
          </Card>

          {/* Ticket Minting */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 animate-fade-in animation-delay-200">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Ticket className="w-5 h-5 mr-2 text-cyan-400" />
                Event Ticket Minting
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="event-name" className="text-gray-300">Event Name</Label>
                <Input
                  id="event-name"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  placeholder="Enter event name"
                  className="bg-white/5 border-white/20 text-white placeholder:text-gray-500"
                />
              </div>
              <Button
                onClick={handleTicketMinting}
                disabled={isMinting}
                className="w-full bg-cyan-600 hover:bg-cyan-700"
              >
                {isMinting ? "Minting..." : "Mint NFT Ticket"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Minted Tickets */}
        {tickets.length > 0 && (
          <Card className="mt-8 bg-white/10 backdrop-blur-sm border-white/20 animate-fade-in">
            <CardHeader>
              <CardTitle className="text-white">Your NFT Tickets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="p-4 rounded-lg bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-400/30"
                  >
                    <div className="flex items-center mb-2">
                      <Calendar className="w-4 h-4 text-cyan-400 mr-2" />
                      <span className="font-semibold text-white">{ticket.event}</span>
                    </div>
                    <p className="text-sm text-gray-400">Token ID: {ticket.tokenId}</p>
                    <p className="text-xs text-gray-500">
                      Minted: {new Date(ticket.mintedAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

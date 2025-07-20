
import { Card, CardContent } from "@/components/ui/card";
import { Box, Users, Ticket, UserCircle } from "lucide-react";

const features = [
  {
    icon: Box,
    title: "3D Virtual Worlds",
    description: "Explore immersive 3D environments built with Three.js and WebGL technology"
  },
  {
    icon: Users,
    title: "Multi-User Interactions",
    description: "Connect with other users in real-time within shared virtual spaces"
  },
  {
    icon: Ticket,
    title: "NFT Event Tickets",
    description: "Mint and manage event tickets as NFTs secured by blockchain smart contracts"
  },
  {
    icon: UserCircle,
    title: "Custom Avatars",
    description: "Create and customize your virtual identity with persistent avatar registration"
  }
];

export const Features = () => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Revolutionary Features
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Experience the next generation of virtual reality powered by blockchain technology
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105 animate-fade-in"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <CardContent className="p-6 text-center">
                <feature.icon className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

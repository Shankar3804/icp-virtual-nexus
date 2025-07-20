
import { useState, useEffect } from "react";
import { VRScene } from "@/components/VRScene";
import { LoginCard } from "@/components/LoginCard";
import { Dashboard } from "@/components/Dashboard";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [currentView, setCurrentView] = useState<'home' | 'vr' | 'dashboard'>('home');

  const handleLogin = (userData: any) => {
    setIsAuthenticated(true);
    setUser(userData);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setCurrentView('home');
  };

  if (currentView === 'vr' && isAuthenticated) {
    return <VRScene user={user} onBack={() => setCurrentView('dashboard')} />;
  }

  if (currentView === 'dashboard' && isAuthenticated) {
    return (
      <Dashboard 
        user={user} 
        onEnterVR={() => setCurrentView('vr')}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="relative">
        {/* Background Effects */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-repeat" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(156,146,172,0.15) 1px, transparent 0)',
            backgroundSize: '20px 20px'
          }}></div>
        </div>
        
        <Hero />
        <Features />
        
        {!isAuthenticated && (
          <div className="container mx-auto px-4 py-16">
            <div className="flex justify-center">
              <LoginCard onLogin={handleLogin} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;


import React, { useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import FeaturedAgents from '@/components/home/FeaturedAgents';
import HowItWorks from '@/components/home/HowItWorks';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAppAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const { isAuthenticated, signOut } = useAppAuth();
  const { toast } = useToast();
  
  const handleEmergencySignOut = async () => {
    try {
      // Clear all browser storage
      localStorage.clear();
      sessionStorage.clear();
      
      // Clear all cookies
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
      
      // Force Supabase to forget the current session
      await supabase.auth.signOut({ scope: 'global' });
      
      // Call standard sign out function
      await signOut();
      
      toast({
        title: "Emergency Sign Out",
        description: "All session data has been cleared.",
      });
      
      // Force reload to clear all state
      window.location.href = '/sign-in';
    } catch (error) {
      console.error("Emergency sign out error:", error);
      toast({
        title: "Emergency sign out failed",
        description: "Please try again or clear your browser cookies manually.",
        variant: "destructive",
      });
      
      // Even if there's an error, try to force a redirect and reload
      window.location.href = '/sign-in?forcedLogout=true';
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow page-transition">
        <Hero />
        <FeaturedAgents />
        <HowItWorks />
      </main>
      <Footer />
      {isAuthenticated && (
        <div className="container mx-auto px-4 py-6 flex justify-center">
          <Button 
            variant="destructive" 
            onClick={handleEmergencySignOut}
            className="text-sm"
          >
            Emergency Sign Out (Debug)
          </Button>
        </div>
      )}
    </div>
  );
};

export default Index;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Shield, LogOut, Users, AlertCircle, MessageCircle } from "lucide-react";
import EmergencyContacts from "@/components/EmergencyContacts";
import SOSButton from "@/components/SOSButton";
import AIChat from "@/components/AIChat";
import RecentAlerts from "@/components/RecentAlerts";

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        navigate("/auth");
      }
      setLoading(false);
    });

    // Listen to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          setUser(session.user);
        } else {
          navigate("/auth");
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to log out. Please try again.",
      });
    } else {
      toast({
        title: "Goodbye 👋",
        description: "You've been logged out safely.",
      });
      navigate("/");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Shield className="w-16 h-16 text-primary mx-auto animate-pulse" />
          <p className="text-muted-foreground">Loading your safe space...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10">
      {/* Header */}
      <header className="bg-card/50 backdrop-blur-sm border-b border-border/50 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-primary to-primary-glow rounded-xl">
              <Shield className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Mangai
              </h1>
              <p className="text-xs text-muted-foreground">Your Safety Companion</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-6">
        {/* Welcome Card */}
        <Card className="shadow-card border-border/50">
          <CardHeader>
            <CardTitle className="text-2xl">
              Welcome, {user.user_metadata?.name || "Friend"}! 🌸
            </CardTitle>
            <CardDescription>
              You're safe here. We're always ready to help when you need us.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* SOS Button */}
        <SOSButton userId={user.id} />

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Emergency Contacts */}
          <Card className="shadow-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Emergency Contacts
              </CardTitle>
              <CardDescription>
                Add up to 10 trusted people who will receive your SOS alerts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EmergencyContacts userId={user.id} />
            </CardContent>
          </Card>

          {/* Recent Alerts */}
          <Card className="shadow-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-emergency" />
                Recent Alerts
              </CardTitle>
              <CardDescription>
                Your SOS alert history
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RecentAlerts userId={user.id} />
            </CardContent>
          </Card>
        </div>

        {/* AI Chat */}
        <Card className="shadow-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-accent" />
              Mangai Buddy - Your AI Companion
            </CardTitle>
            <CardDescription>
              Chat with our AI for emotional support, safety tips, and guidance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AIChat userId={user.id} />
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
import { Button } from "@/components/ui/button";
import { Shield, Heart, MessageCircle, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-primary to-primary-glow rounded-xl shadow-soft">
            <Shield className="w-6 h-6 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Mangai
          </h1>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              Your Safety,
              <br />
              Our Priority 💙
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Mangai is your trusted companion for safety and emotional well-being.
              Get instant help, connect with trusted contacts, and chat with our AI
              support buddy.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate("/auth")}
              className="bg-gradient-to-r from-primary to-primary-glow hover:shadow-glow text-lg px-8 py-6"
            >
              Get Started
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/auth")}
              className="text-lg px-8 py-6 border-primary/30"
            >
              Sign In
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <div className="p-6 bg-card rounded-2xl shadow-card border border-border/50 space-y-3">
              <div className="w-12 h-12 bg-gradient-to-br from-emergency to-accent rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold">Instant SOS</h3>
              <p className="text-muted-foreground">
                One-tap emergency alerts sent to all your trusted contacts
                instantly.
              </p>
            </div>

            <div className="p-6 bg-card rounded-2xl shadow-card border border-border/50 space-y-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-glow rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold">Trusted Network</h3>
              <p className="text-muted-foreground">
                Add up to 10 emergency contacts who will be there when you need
                them.
              </p>
            </div>

            <div className="p-6 bg-card rounded-2xl shadow-card border border-border/50 space-y-3">
              <div className="w-12 h-12 bg-gradient-to-br from-accent to-secondary rounded-xl flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold">AI Companion</h3>
              <p className="text-muted-foreground">
                Chat with Mangai Buddy for emotional support and safety guidance
                24/7.
              </p>
            </div>
          </div>

          {/* Trust Statement */}
          <div className="mt-16 p-8 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl border border-primary/20">
            <Heart className="w-10 h-10 text-accent mx-auto mb-4" />
            <p className="text-lg font-medium text-foreground">
              Mangai is more than an app—it's your trusted companion, always ready
              to help you feel safe, supported, and empowered.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;

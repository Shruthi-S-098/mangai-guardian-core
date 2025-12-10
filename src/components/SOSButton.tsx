import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle } from "lucide-react";

const SOSButton = ({ userId }: { userId: string }) => {
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

  const sendSOS = async () => {
    setSending(true);

    try {
      // First check if user has contacts
      const { data: contacts } = await supabase
        .from("contacts")
        .select("*")
        .eq("user_id", userId);

      if (!contacts || contacts.length === 0) {
        toast({
          variant: "destructive",
          title: "No Contacts Added",
          description: "Please add emergency contacts before sending an SOS alert.",
        });
        setSending(false);
        return;
      }

      // Call the SOS edge function
      const { data, error } = await supabase.functions.invoke("send-sos", {
        body: { userId },
      });

      if (error) throw error;

      // Record the alert
      await supabase.from("alerts").insert({
        user_id: userId,
        alert_message: "Emergency SOS Alert Sent",
        status: "sent",
      });

      toast({
        title: "SOS Alert Sent! 🚨",
        description: `Your emergency alert has been sent to ${contacts.length} contact(s).`,
      });
    } catch (error: any) {
      console.error("SOS error:", error);
      toast({
        variant: "destructive",
        title: "Error Sending SOS",
        description: error.message || "Failed to send alert. Please try again.",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <Card className="shadow-card border-emergency/30 bg-gradient-to-br from-card to-emergency/5">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2 text-emergency">
          <AlertCircle className="w-6 h-6" />
          Emergency SOS
        </CardTitle>
        <CardDescription className="text-base">
          Send an instant alert to all your emergency contacts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          onClick={sendSOS}
          disabled={sending}
          size="lg"
          className="w-full bg-gradient-to-r from-emergency to-accent hover:shadow-glow text-lg font-semibold py-6 transition-all duration-300 transform hover:scale-105"
        >
          {sending ? "Sending Alert..." : "🚨 SEND SOS ALERT"}
        </Button>
        <p className="text-xs text-muted-foreground text-center mt-4">
          This will immediately notify all your emergency contacts with your alert message
        </p>
      </CardContent>
    </Card>
  );
};

export default SOSButton;
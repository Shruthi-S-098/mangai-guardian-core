import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Send, Sparkles } from "lucide-react";
import { z } from "zod";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const messageSchema = z.object({
  content: z.string().min(1).max(1000),
});

const AIChat = ({ userId }: { userId: string }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Load chat history
    fetchChatHistory();
  }, [userId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchChatHistory = async () => {
    const { data } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: true })
      .limit(50);

    if (data) {
      setMessages(data.map((msg) => ({ role: msg.role as "user" | "assistant", content: msg.content })));
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    try {
      const validated = messageSchema.parse({ content: input.trim() });

      const userMessage: Message = { role: "user", content: validated.content };
      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setLoading(true);

      // Save user message
      await supabase.from("chat_messages").insert({
        user_id: userId,
        role: "user",
        content: validated.content,
      });

      // Call AI chatbot edge function
      const { data, error } = await supabase.functions.invoke("ai-chat", {
        body: { message: validated.content, userId },
      });

      if (error) throw error;

      const assistantMessage: Message = {
        role: "assistant",
        content: data.response,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Save assistant message
      await supabase.from("chat_messages").insert({
        user_id: userId,
        role: "assistant",
        content: data.response,
      });
    } catch (error: any) {
      console.error("Chat error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to send message. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Chat Messages */}
      <div className="h-96 overflow-y-auto space-y-3 p-4 bg-muted/20 rounded-lg border border-border/50">
        {messages.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Sparkles className="w-12 h-12 mx-auto mb-3 text-accent" />
            <p className="font-medium">Hi there! I'm Mangai Buddy 💙</p>
            <p className="text-sm mt-2">
              I'm here to provide emotional support, safety tips, and guidance.
            </p>
            <p className="text-sm">Feel free to talk to me about anything!</p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  msg.role === "user"
                    ? "bg-gradient-to-r from-primary to-primary-glow text-primary-foreground"
                    : "bg-card border border-border/50"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && !loading && sendMessage()}
          placeholder="Type your message here..."
          disabled={loading}
          maxLength={1000}
          className="flex-1"
        />
        <Button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className="bg-gradient-to-r from-accent to-primary"
        >
          {loading ? (
            <Sparkles className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default AIChat;
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, User } from "lucide-react";
import { z } from "zod";

interface Contact {
  id: string;
  contact_name: string;
  contact_number: string;
}

const contactSchema = z.object({
  contact_name: z.string().min(2, "Name must be at least 2 characters").max(100),
  contact_number: z.string().min(10, "Phone must be at least 10 digits").max(15),
});

const EmergencyContacts = ({ userId }: { userId: string }) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [newContact, setNewContact] = useState({ name: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchContacts();
  }, [userId]);

  const fetchContacts = async () => {
    const { data, error } = await supabase
      .from("contacts")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching contacts:", error);
      return;
    }

    setContacts(data || []);
  };

  const addContact = async () => {
    if (!newContact.name.trim() || !newContact.phone.trim()) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please enter both name and phone number.",
      });
      return;
    }

    try {
      const validated = contactSchema.parse({
        contact_name: newContact.name.trim(),
        contact_number: newContact.phone.trim(),
      });

      setLoading(true);

      const { error } = await supabase.from("contacts").insert({
        user_id: userId,
        contact_name: validated.contact_name,
        contact_number: validated.contact_number,
      });

      if (error) {
        if (error.message.includes("Maximum of 10")) {
          throw new Error("You can only add up to 10 emergency contacts");
        }
        throw error;
      }

      toast({
        title: "Contact Added ✓",
        description: `${validated.contact_name} has been added to your emergency contacts.`,
      });

      setNewContact({ name: "", phone: "" });
      fetchContacts();
    } catch (error: any) {
      console.error("Error adding contact:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to add contact. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteContact = async (id: string, name: string) => {
    setLoading(true);
    const { error } = await supabase.from("contacts").delete().eq("id", id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete contact.",
      });
    } else {
      toast({
        title: "Contact Removed",
        description: `${name} has been removed from your contacts.`,
      });
      fetchContacts();
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Add New Contact */}
      <div className="space-y-4 p-4 bg-muted/30 rounded-lg border border-border/50">
        <div className="space-y-2">
          <Label htmlFor="contact-name">Contact Name</Label>
          <Input
            id="contact-name"
            placeholder="Enter name"
            value={newContact.name}
            onChange={(e) =>
              setNewContact({ ...newContact, name: e.target.value })
            }
            maxLength={100}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact-phone">Phone Number</Label>
          <Input
            id="contact-phone"
            type="tel"
            placeholder="Enter phone number"
            value={newContact.phone}
            onChange={(e) =>
              setNewContact({ ...newContact, phone: e.target.value })
            }
            maxLength={15}
          />
        </div>
        <Button
          onClick={addContact}
          disabled={loading || contacts.length >= 10}
          className="w-full bg-gradient-to-r from-primary to-primary-glow"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Contact ({contacts.length}/10)
        </Button>
      </div>

      {/* Contact List */}
      <div className="space-y-3">
        {contacts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <User className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No emergency contacts yet</p>
            <p className="text-sm">Add your first trusted contact above</p>
          </div>
        ) : (
          contacts.map((contact) => (
            <div
              key={contact.id}
              className="flex items-center justify-between p-3 bg-card rounded-lg border border-border/50 hover:shadow-sm transition-shadow"
            >
              <div>
                <p className="font-medium">{contact.contact_name}</p>
                <p className="text-sm text-muted-foreground">
                  {contact.contact_number}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteContact(contact.id, contact.contact_name)}
                disabled={loading}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EmergencyContacts;
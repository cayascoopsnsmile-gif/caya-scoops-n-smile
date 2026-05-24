import { useState } from "react";
import { toast } from "sonner";
import { MessageCircleHeart, Star } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.jsx";
import { Textarea } from "@/components/ui/textarea.jsx";
import { buildCustomerContactWhatsappUrl, submitCustomerFeedback } from "@/lib/customer-contact.js";

export function CustomerFeedbackContactCard({ profile, settings, user }) {
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackRating, setFeedbackRating] = useState("5");
  const [contactMessage, setContactMessage] = useState("");
  const [contactName, setContactName] = useState(profile.fullName || "");
  const [contactPhone, setContactPhone] = useState(profile.phoneNumber || "");
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  const handleFeedbackSubmit = () => {
    if (!feedbackMessage.trim()) {
      toast.error("Add your feedback message first.");
      return;
    }

    setSubmittingFeedback(true);
    submitCustomerFeedback({
      customerEmail: user?.email || "",
      message: feedbackMessage,
      rating: feedbackRating
    })
      .then(() => {
        setFeedbackMessage("");
        toast.success("Feedback sent. Thank you.");
      })
      .catch((error) => toast.error(error?.message || "Feedback could not be sent."))
      .finally(() => setSubmittingFeedback(false));
  };

  const handleContactWhatsapp = () => {
    if (!contactMessage.trim()) {
      toast.error("Enter your message first.");
      return;
    }
    const url = buildCustomerContactWhatsappUrl({
      businessPhone: settings.businessPhone,
      message: contactMessage,
      name: contactName,
      phone: contactPhone
    });
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Card className="glass-card">
        <CardHeader className="space-y-2">
          <div className="flex items-center gap-3">
            <Star className="h-5 w-5 text-primary" />
            <CardTitle className="font-display text-2xl">Review and feedback</CardTitle>
          </div>
          <CardDescription>Tell Caya about your product, service, delivery, or overall experience.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="customer-feedback-rating">Rating</Label>
            <Select onValueChange={setFeedbackRating} value={feedbackRating}>
              <SelectTrigger id="customer-feedback-rating">
                <SelectValue placeholder="Choose a rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 - Excellent</SelectItem>
                <SelectItem value="4">4 - Good</SelectItem>
                <SelectItem value="3">3 - Okay</SelectItem>
                <SelectItem value="2">2 - Needs improvement</SelectItem>
                <SelectItem value="1">1 - Poor</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="customer-feedback-message">Feedback</Label>
            <Textarea id="customer-feedback-message" onChange={(event) => setFeedbackMessage(event.target.value)} placeholder="Product, service, delivery, or overall feedback" value={feedbackMessage} />
          </div>
          <Button disabled={submittingFeedback} onClick={handleFeedbackSubmit} type="button">
            {submittingFeedback ? "Sending..." : "Submit feedback"}
          </Button>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader className="space-y-2">
          <div className="flex items-center gap-3">
            <MessageCircleHeart className="h-5 w-5 text-primary" />
            <CardTitle className="font-display text-2xl">Contact Caya</CardTitle>
          </div>
          <CardDescription>Send a WhatsApp message for order updates, account help, or anything else you need quickly.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="customer-contact-name">Your name</Label>
              <Input id="customer-contact-name" onChange={(event) => setContactName(event.target.value)} placeholder="Your name" value={contactName} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="customer-contact-phone">Your phone</Label>
              <Input id="customer-contact-phone" onChange={(event) => setContactPhone(event.target.value)} placeholder="Your phone" value={contactPhone} />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="customer-contact-message">Message</Label>
            <Textarea id="customer-contact-message" onChange={(event) => setContactMessage(event.target.value)} placeholder="Message" value={contactMessage} />
          </div>
          <Button onClick={handleContactWhatsapp} type="button" variant="secondary">
            Send message on WhatsApp
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

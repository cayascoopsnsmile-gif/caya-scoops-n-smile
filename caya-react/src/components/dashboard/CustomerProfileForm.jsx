import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Switch } from "@/components/ui/switch.jsx";
import { Textarea } from "@/components/ui/textarea.jsx";
import { isCustomerProfileComplete, getProfileCompletionPercent } from "@/lib/customer-experience.js";
import { runOptionalFirestoreAction, writeCustomerProfileDoc } from "@/lib/customer-profile.js";
import { syncUserToCustomerRewardRecord } from "@/lib/customer-rewards.js";

export function CustomerProfileForm({ profile, user, onProfileSaved }) {
  const [saving, setSaving] = useState(false);
  const form = useForm({
    defaultValues: {
      fullName: profile.fullName || "",
      phoneNumber: profile.phoneNumber || "",
      dateOfBirth: profile.dateOfBirth || "",
      address: profile.address || "",
      favoriteFlavors: profile.favoriteFlavors || "",
      allergyNotes: profile.allergyNotes || "",
      notifyEmail: profile.notifyEmail ?? true,
      notifyWhatsapp: profile.notifyWhatsapp ?? true
    }
  });

  useEffect(() => {
    form.reset({
      fullName: profile.fullName || "",
      phoneNumber: profile.phoneNumber || "",
      dateOfBirth: profile.dateOfBirth || "",
      address: profile.address || "",
      favoriteFlavors: profile.favoriteFlavors || "",
      allergyNotes: profile.allergyNotes || "",
      notifyEmail: profile.notifyEmail ?? true,
      notifyWhatsapp: profile.notifyWhatsapp ?? true
    });
  }, [form, profile]);

  const handleSubmit = form.handleSubmit((values) => {
    const nextProfile = {
      ...profile,
      ...values,
      email: user?.email || profile.email || "",
      profileComplete: isCustomerProfileComplete(values)
    };

    if (!nextProfile.profileComplete) {
      toast.error("Please complete full name, address, telephone number, and date of birth.");
      return Promise.resolve();
    }

    setSaving(true);

    return writeCustomerProfileDoc(user.uid, nextProfile, "customer profile update")
      .then((saved) => {
        if (!saved) {
          toast.error("Your profile could not be saved right now.");
          return false;
        }

        return runOptionalFirestoreAction("customer profile reward sync", () =>
          syncUserToCustomerRewardRecord(user.uid, {
            fullName: nextProfile.fullName,
            email: nextProfile.email,
            points: Number(profile.points || 10)
          })
        ).then(() => true);
      })
      .then((saved) => {
        if (!saved) return;
        onProfileSaved(nextProfile);
        toast.success("Profile updated.");
      })
      .finally(() => setSaving(false));
  });

  return (
    <Card className="bg-card/90">
      <CardHeader>
        <CardTitle className="font-display text-2xl">Profile details</CardTitle>
        <CardDescription>
          Profile {getProfileCompletionPercent(profile)}% complete. Add your details for smoother checkout and rewards.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="profile-full-name">Full name</Label>
            <Input id="profile-full-name" placeholder="Your full name" {...form.register("fullName")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="profile-phone-number">Telephone number</Label>
            <Input id="profile-phone-number" placeholder="Phone number" {...form.register("phoneNumber")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="profile-date-of-birth">Date of birth</Label>
            <Input id="profile-date-of-birth" type="date" {...form.register("dateOfBirth")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="profile-favorite-flavors">Favorite flavors</Label>
            <Input id="profile-favorite-flavors" placeholder="Taro, vanilla, strawberry" {...form.register("favoriteFlavors")} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="profile-address">Address</Label>
            <Textarea id="profile-address" placeholder="Delivery or pickup-friendly address" {...form.register("address")} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="profile-allergy-notes">Allergy notes</Label>
            <Textarea id="profile-allergy-notes" placeholder="Anything we should watch for?" {...form.register("allergyNotes")} />
          </div>
          <div className="glass-panel flex items-center justify-between rounded-[24px] px-4 py-4 md:col-span-2">
            <div className="space-y-1">
              <p className="font-medium">Email updates</p>
              <p className="text-sm text-muted-foreground">Receive order and reward updates by email.</p>
            </div>
            <Switch
              checked={Boolean(form.watch("notifyEmail"))}
              onCheckedChange={(checked) => form.setValue("notifyEmail", checked)}
            />
          </div>
          <div className="glass-panel flex items-center justify-between rounded-[24px] px-4 py-4 md:col-span-2">
            <div className="space-y-1">
              <p className="font-medium">WhatsApp updates</p>
              <p className="text-sm text-muted-foreground">Receive order and support updates by WhatsApp.</p>
            </div>
            <Switch
              checked={Boolean(form.watch("notifyWhatsapp"))}
              onCheckedChange={(checked) => form.setValue("notifyWhatsapp", checked)}
            />
          </div>
          <div className="md:col-span-2">
            <Button className="w-full sm:w-auto" disabled={saving} type="submit">
              {saving ? "Saving profile..." : "Save profile"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

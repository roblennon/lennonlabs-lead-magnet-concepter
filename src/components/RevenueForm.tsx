import { useState } from "react";
import { EmailField } from "./revenue-form/EmailField";
import { OfferField } from "./revenue-form/OfferField";
import { RevenueSourceField } from "./revenue-form/RevenueSourceField";
import { HelpRequestsField } from "./revenue-form/HelpRequestsField";
import { SubmitButton } from "./revenue-form/SubmitButton";

export type FormData = {
  email: string;
  offer: string;
  revenueSource: string;
  helpRequests: string;
};

interface RevenueFormProps {
  onSubmit: (data: FormData) => void;
  isLoading?: boolean;
}

export function RevenueForm({ onSubmit, isLoading }: RevenueFormProps) {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    offer: "",
    revenueSource: "services",
    helpRequests: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-8">
      <EmailField 
        value={formData.email}
        onChange={(value) => setFormData({ ...formData, email: value })}
      />
      
      <OfferField
        value={formData.offer}
        onChange={(value) => setFormData({ ...formData, offer: value })}
      />
      
      <RevenueSourceField
        value={formData.revenueSource}
        onChange={(value) => setFormData({ ...formData, revenueSource: value })}
      />
      
      <HelpRequestsField
        value={formData.helpRequests}
        onChange={(value) => setFormData({ ...formData, helpRequests: value })}
      />
      
      <SubmitButton isLoading={isLoading} />
    </form>
  );
}
import { useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";

export type FormData = {
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
    offer: "",
    revenueSource: "services",
    helpRequests: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6">
      <div className="space-y-2">
        <Label htmlFor="offer">Paste your website URL or main offer description</Label>
        <Input
          id="offer"
          placeholder="e.g. https://yourwebsite.com or describe your main offer"
          value={formData.offer}
          onChange={(e) => setFormData({ ...formData, offer: e.target.value })}
          className="bg-secondary"
          required
        />
      </div>

      <div className="space-y-2">
        <Label>What's currently making you the most money?</Label>
        <RadioGroup
          value={formData.revenueSource}
          onValueChange={(value) => setFormData({ ...formData, revenueSource: value })}
          className="space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="services" id="services" />
            <Label htmlFor="services">1:1 Services</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="products" id="products" />
            <Label htmlFor="products">Digital Products</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="programs" id="programs" />
            <Label htmlFor="programs">Group Programs</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="other" id="other" />
            <Label htmlFor="other">Other</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label htmlFor="helpRequests">What do people most often ask you for help with?</Label>
        <Textarea
          id="helpRequests"
          placeholder="Share the common questions or requests you receive..."
          value={formData.helpRequests}
          onChange={(e) => setFormData({ ...formData, helpRequests: e.target.value })}
          className="bg-secondary min-h-[100px]"
          required
        />
      </div>

      <Button 
        type="submit" 
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
        disabled={isLoading}
      >
        {isLoading ? "Analyzing..." : "Generate Revenue Opportunities"}
      </Button>
    </form>
  );
}
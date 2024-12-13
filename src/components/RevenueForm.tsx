import { useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";

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
    <form onSubmit={handleSubmit} className="space-y-8 p-6">
      <div className="space-y-3">
        <Label htmlFor="email" className="text-sm font-medium text-muted-foreground">
          Your email address
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email to receive the analysis"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="bg-secondary/50 border-border/50 h-11 text-foreground placeholder:text-muted-foreground/60"
          required
        />
      </div>

      <div className="space-y-3">
        <Label htmlFor="offer" className="text-sm font-medium text-muted-foreground">
          Paste your website URL or main offer description
        </Label>
        <Input
          id="offer"
          placeholder="e.g. https://yourwebsite.com or describe your main offer"
          value={formData.offer}
          onChange={(e) => setFormData({ ...formData, offer: e.target.value })}
          className="bg-secondary/50 border-border/50 h-11 text-foreground placeholder:text-muted-foreground/60"
          required
        />
      </div>

      <div className="space-y-4">
        <Label className="text-sm font-medium text-muted-foreground">
          What's currently making you the most money?
        </Label>
        <RadioGroup
          value={formData.revenueSource}
          onValueChange={(value) => setFormData({ ...formData, revenueSource: value })}
          className="space-y-1.5"
        >
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="services" id="services" className="border-primary/30 text-primary" />
            <Label htmlFor="services" className="text-sm font-normal">1:1 Services</Label>
          </div>
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="products" id="products" className="border-primary/30 text-primary" />
            <Label htmlFor="products" className="text-sm font-normal">Digital Products</Label>
          </div>
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="programs" id="programs" className="border-primary/30 text-primary" />
            <Label htmlFor="programs" className="text-sm font-normal">Group Programs</Label>
          </div>
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="other" id="other" className="border-primary/30 text-primary" />
            <Label htmlFor="other" className="text-sm font-normal">Other</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-3">
        <Label htmlFor="helpRequests" className="text-sm font-medium text-muted-foreground">
          What do people most often ask you for help with?
        </Label>
        <Textarea
          id="helpRequests"
          placeholder="Share the common questions or requests you receive..."
          value={formData.helpRequests}
          onChange={(e) => setFormData({ ...formData, helpRequests: e.target.value })}
          className="bg-secondary/50 border-border/50 min-h-[120px] text-foreground placeholder:text-muted-foreground/60"
          required
        />
      </div>

      <Button 
        type="submit" 
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-11 text-sm font-medium"
        disabled={isLoading}
      >
        {isLoading ? "Analyzing..." : "Generate Revenue Opportunities"}
      </Button>
    </form>
  );
}
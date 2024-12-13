import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

interface OfferFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export function OfferField({ value, onChange }: OfferFieldProps) {
  return (
    <div className="space-y-2.5">
      <Label htmlFor="offer" className="text-base font-medium text-foreground">
        Paste your website URL or main offer description
      </Label>
      <Textarea
        id="offer"
        placeholder="e.g. https://yourwebsite.com or describe your main offer"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[120px] bg-card border-border/50 text-foreground placeholder:text-muted/60"
        required
      />
    </div>
  );
}
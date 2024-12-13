import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { FormField } from "@/types/database";

interface OfferFieldProps {
  value: string;
  onChange: (value: string) => void;
  config: FormField;
}

export function OfferField({ value, onChange, config }: OfferFieldProps) {
  return (
    <div className="space-y-2.5">
      <Label htmlFor="offer" className="text-base font-medium text-foreground">
        {config.label}
      </Label>
      <Textarea
        id="offer"
        placeholder={config.placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[120px] resize-none bg-card border-border/50 text-foreground placeholder:text-muted/60"
        required={config.required}
      />
    </div>
  );
}
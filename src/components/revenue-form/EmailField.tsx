import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface EmailFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export function EmailField({ value, onChange }: EmailFieldProps) {
  return (
    <div className="space-y-2.5">
      <Label htmlFor="email" className="text-base font-medium text-foreground">
        Your email address
      </Label>
      <Input
        id="email"
        type="email"
        placeholder="Enter your email to receive the analysis"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 bg-card border-border/50 text-foreground placeholder:text-muted/60"
        required
      />
    </div>
  );
}
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { FormField } from "@/types/database";

interface EmailFieldProps {
  value: string;
  onChange: (value: string) => void;
  config: FormField;
}

export function EmailField({ value, onChange, config }: EmailFieldProps) {
  return (
    <div className="space-y-2.5">
      <Label htmlFor="email" className="text-base font-medium text-foreground">
        {config.label}
      </Label>
      <Input
        id="email"
        type="email"
        placeholder={config.placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 bg-transparent border-border/50 text-foreground placeholder:text-muted/60"
        required={config.required}
      />
    </div>
  );
}
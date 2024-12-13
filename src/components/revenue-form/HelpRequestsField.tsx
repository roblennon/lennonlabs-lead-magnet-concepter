import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { FormField } from "@/types/database";

interface HelpRequestsFieldProps {
  value: string;
  onChange: (value: string) => void;
  config: FormField;
}

export function HelpRequestsField({ value, onChange, config }: HelpRequestsFieldProps) {
  return (
    <div className="space-y-2.5">
      <Label htmlFor="helpRequests" className="text-base font-medium text-foreground">
        {config.label}
      </Label>
      <Textarea
        id="helpRequests"
        placeholder={config.placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[120px] bg-card border-border/50 text-foreground placeholder:text-muted/60"
        required={config.required}
      />
    </div>
  );
}
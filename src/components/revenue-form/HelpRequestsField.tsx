import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

interface HelpRequestsFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export function HelpRequestsField({ value, onChange }: HelpRequestsFieldProps) {
  return (
    <div className="space-y-2.5">
      <Label htmlFor="helpRequests" className="text-base font-medium text-foreground">
        What do people most often ask you for help with?
      </Label>
      <Textarea
        id="helpRequests"
        placeholder="Share the common questions or requests you receive..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[120px] bg-card border-border/50 text-foreground placeholder:text-muted/60"
        required
      />
    </div>
  );
}
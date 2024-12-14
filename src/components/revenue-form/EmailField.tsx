import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface EmailFieldProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

export function EmailField({ value, onChange, required }: EmailFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="email" className="block">
        Your email address<span className="text-red-500">*</span>
      </Label>
      <Input
        type="email"
        id="email"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
      />
    </div>
  );
}
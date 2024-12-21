import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface VariableNameInputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function VariableNameInput({ id, value, onChange, disabled }: VariableNameInputProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={`${id}-variable`}>
        Variable Name for AI Prompt
        <span className="text-sm text-muted-foreground ml-2">
          (Use {{variableName}} in your prompt)
        </span>
      </Label>
      <Input
        id={`${id}-variable`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g., businessDescription"
        disabled={disabled}
      />
    </div>
  );
}
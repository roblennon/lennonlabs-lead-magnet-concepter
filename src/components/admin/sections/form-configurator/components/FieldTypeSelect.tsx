import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface FieldTypeSelectProps {
  id: string;
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
}

export function FieldTypeSelect({ id, value, onValueChange, disabled }: FieldTypeSelectProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={`${id}-type`}>Field Type</Label>
      <Select
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
      >
        <SelectTrigger id={`${id}-type`}>
          <SelectValue placeholder="Select field type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="text">Short Text</SelectItem>
          <SelectItem value="textarea">Long Text</SelectItem>
          <SelectItem value="email">Email</SelectItem>
          <SelectItem value="radio">Radio Buttons</SelectItem>
          <SelectItem value="multi-select">Multi-Select</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
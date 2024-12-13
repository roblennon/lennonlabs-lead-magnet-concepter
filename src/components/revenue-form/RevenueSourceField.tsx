import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { FormField } from "@/types/database";

interface RevenueSourceFieldProps {
  value: string;
  onChange: (value: string) => void;
  config: FormField;
}

export function RevenueSourceField({ value, onChange, config }: RevenueSourceFieldProps) {
  return (
    <div className="space-y-3">
      <Label className="text-base font-medium text-foreground">
        {config.label}
      </Label>
      <RadioGroup
        value={value}
        onValueChange={onChange}
        className="space-y-0.75"
      >
        {config.options?.map((option) => (
          <div key={option.value} className="flex items-center space-x-3">
            <RadioGroupItem 
              value={option.value} 
              id={option.value} 
              className="border-primary/30 text-muted" 
            />
            <Label 
              htmlFor={option.value} 
              className="text-base font-normal text-muted"
            >
              {option.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

interface RevenueSourceFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export function RevenueSourceField({ value, onChange }: RevenueSourceFieldProps) {
  return (
    <div className="space-y-3">
      <Label className="text-base font-medium text-foreground">
        What's currently making you the most money?
      </Label>
      <RadioGroup
        value={value}
        onValueChange={onChange}
        className="space-y-0.75"
      >
        <div className="flex items-center space-x-3">
          <RadioGroupItem value="services" id="services" className="border-primary/30 text-muted" />
          <Label htmlFor="services" className="text-base font-normal text-muted">1:1 Services</Label>
        </div>
        <div className="flex items-center space-x-3">
          <RadioGroupItem value="products" id="products" className="border-primary/30 text-muted" />
          <Label htmlFor="products" className="text-base font-normal text-muted">Digital Products</Label>
        </div>
        <div className="flex items-center space-x-3">
          <RadioGroupItem value="programs" id="programs" className="border-primary/30 text-muted" />
          <Label htmlFor="programs" className="text-base font-normal text-muted">Group Programs</Label>
        </div>
        <div className="flex items-center space-x-3">
          <RadioGroupItem value="other" id="other" className="border-primary/30 text-muted" />
          <Label htmlFor="other" className="text-base font-normal text-muted">Other</Label>
        </div>
      </RadioGroup>
    </div>
  );
}
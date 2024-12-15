import { useState } from "react";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Input } from "../ui/input";

interface RevenueSourceFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export function RevenueSourceField({ value, onChange }: RevenueSourceFieldProps) {
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [otherValue, setOtherValue] = useState("");

  const handleRadioChange = (newValue: string) => {
    if (newValue === "other") {
      setShowOtherInput(true);
      onChange(otherValue || "other");
    } else {
      setShowOtherInput(false);
      onChange(newValue);
    }
  };

  const handleOtherInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setOtherValue(inputValue);
    onChange(inputValue);
  };

  return (
    <div className="space-y-3">
      <Label className="text-base font-medium text-foreground">
        What's currently making you the most money?
      </Label>
      <RadioGroup
        value={showOtherInput ? "other" : value}
        onValueChange={handleRadioChange}
        className="space-y-2"
      >
        <div className="flex items-center space-x-3">
          <RadioGroupItem value="services" id="services" className="border-primary/30 text-muted" />
          <Label htmlFor="services" className="text-base font-normal text-muted">1:1 Services</Label>
        </div>
        <div className="flex items-center space-x-3">
          <RadioGroupItem value="products" id="products" className="border-primary/30 text-muted" />
          <Label htmlFor="products" className="text-base font-normal text-muted">Infoproducts / Digital Products</Label>
        </div>
        <div className="flex items-center space-x-3">
          <RadioGroupItem value="programs" id="programs" className="border-primary/30 text-muted" />
          <Label htmlFor="programs" className="text-base font-normal text-muted">Group Programs</Label>
        </div>
        <div className="flex items-center space-x-3">
          <RadioGroupItem value="saas" id="saas" className="border-primary/30 text-muted" />
          <Label htmlFor="saas" className="text-base font-normal text-muted">Software / SaaS</Label>
        </div>
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="other" id="other" className="border-primary/30 text-muted" />
            <Label htmlFor="other" className="text-base font-normal text-muted">Other</Label>
          </div>
          {showOtherInput && (
            <div className="ml-7">
              <Input
                type="text"
                value={otherValue}
                onChange={handleOtherInputChange}
                placeholder="Please specify"
                className="max-w-[200px] bg-secondary text-foreground"
              />
            </div>
          )}
        </div>
      </RadioGroup>
    </div>
  );
}
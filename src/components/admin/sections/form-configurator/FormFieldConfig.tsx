import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Settings, Minus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface FormFieldConfigProps {
  field: {
    id: string;
    label: string;
    placeholder: string;
    type: string;
    required: boolean;
  };
  onUpdate: (updates: any) => void;
  onDelete: () => void;
}

export function FormFieldConfig({ field, onUpdate, onDelete }: FormFieldConfigProps) {
  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Settings className="h-4 w-4 text-muted-foreground" />
          <h4 className="font-medium">Field Configuration</h4>
        </div>
        <Button variant="ghost" size="icon" onClick={onDelete}>
          <Minus className="h-4 w-4 text-destructive" />
        </Button>
      </div>

      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor={`${field.id}-label`}>Label</Label>
          <Input
            id={`${field.id}-label`}
            value={field.label}
            onChange={(e) => onUpdate({ label: e.target.value })}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor={`${field.id}-placeholder`}>Placeholder</Label>
          <Input
            id={`${field.id}-placeholder`}
            value={field.placeholder}
            onChange={(e) => onUpdate({ placeholder: e.target.value })}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor={`${field.id}-type`}>Field Type</Label>
          <Select
            value={field.type}
            onValueChange={(value) => onUpdate({ type: value })}
          >
            <SelectTrigger id={`${field.id}-type`}>
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

        <div className="flex items-center space-x-2">
          <Switch
            id={`${field.id}-required`}
            checked={field.required}
            onCheckedChange={(checked) => onUpdate({ required: checked })}
          />
          <Label htmlFor={`${field.id}-required`}>Required Field</Label>
        </div>
      </div>
    </Card>
  );
}
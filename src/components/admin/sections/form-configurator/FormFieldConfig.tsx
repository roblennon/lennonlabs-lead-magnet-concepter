import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FieldHeader } from "./components/FieldHeader";
import { OptionsConfig } from "./components/OptionsConfig";

interface FormField {
  id: string;
  label: string;
  placeholder: string;
  type: string;
  required: boolean;
  isEmailField?: boolean;
  options?: Array<{ id: string; value: string }>;
  hasOtherOption?: boolean;
  otherOptionPlaceholder?: string;
  variableName: string;
}

interface FormFieldConfigProps {
  field: FormField;
  onUpdate: (updates: Partial<FormField>) => void;
  onDelete: () => void;
  dragHandleProps?: any;
}

export function FormFieldConfig({ field, onUpdate, onDelete, dragHandleProps }: FormFieldConfigProps) {
  const showOptionsConfig = field.type === 'radio' || field.type === 'multi-select';

  return (
    <Card className="p-4 space-y-4">
      <FieldHeader
        isEmailField={field.isEmailField}
        onDelete={onDelete}
        dragHandleProps={dragHandleProps}
      />

      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor={`${field.id}-label`}>Label</Label>
          <Input
            id={`${field.id}-label`}
            value={field.label}
            onChange={(e) => onUpdate({ label: e.target.value })}
            disabled={field.isEmailField}
          />
        </div>

        {(!showOptionsConfig || field.isEmailField) && (
          <div className="grid gap-2">
            <Label htmlFor={`${field.id}-placeholder`}>Placeholder</Label>
            <Input
              id={`${field.id}-placeholder`}
              value={field.placeholder}
              onChange={(e) => onUpdate({ placeholder: e.target.value })}
              disabled={field.isEmailField}
            />
          </div>
        )}

        <div className="grid gap-2">
          <Label htmlFor={`${field.id}-type`}>Field Type</Label>
          <Select
            value={field.type}
            onValueChange={(value) => {
              const updates: Partial<FormField> = { type: value };
              if (value === 'radio' || value === 'multi-select') {
                updates.options = field.options || [{ id: `option-${Date.now()}`, value: 'Option 1' }];
                updates.hasOtherOption = false;
              }
              onUpdate(updates);
            }}
            disabled={field.isEmailField}
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

        <div className="grid gap-2">
          <Label htmlFor={`${field.id}-variable`}>
            Variable Name for AI Prompt
            <span className="text-sm text-muted-foreground ml-2">
              (Use {{variableName}} in your prompt)
            </span>
          </Label>
          <Input
            id={`${field.id}-variable`}
            value={field.variableName}
            onChange={(e) => onUpdate({ variableName: e.target.value })}
            placeholder="e.g., businessDescription"
            disabled={field.isEmailField}
          />
        </div>

        {showOptionsConfig && !field.isEmailField && (
          <OptionsConfig
            options={field.options || []}
            hasOtherOption={field.hasOtherOption}
            otherOptionPlaceholder={field.otherOptionPlaceholder}
            onUpdate={onUpdate}
          />
        )}

        <div className="flex items-center space-x-2">
          <Switch
            id={`${field.id}-required`}
            checked={field.required}
            onCheckedChange={(checked) => onUpdate({ required: checked })}
            disabled={field.isEmailField}
          />
          <Label htmlFor={`${field.id}-required`}>Required Field</Label>
        </div>
      </div>
    </Card>
  );
}
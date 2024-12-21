import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Settings, Minus, GripVertical, Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useState } from "react";

interface FormFieldConfigProps {
  field: {
    id: string;
    label: string;
    placeholder: string;
    type: string;
    required: boolean;
    isEmailField?: boolean;
    options?: Array<{ id: string; value: string }>;
    hasOtherOption?: boolean;
    otherOptionPlaceholder?: string;
  };
  onUpdate: (updates: any) => void;
  onDelete: () => void;
  dragHandleProps?: any;
}

export function FormFieldConfig({ field, onUpdate, onDelete, dragHandleProps }: FormFieldConfigProps) {
  const [newOptionValue, setNewOptionValue] = useState("");

  const addOption = () => {
    if (!newOptionValue.trim()) return;
    
    const newOption = {
      id: `option-${Date.now()}`,
      value: newOptionValue
    };
    
    const currentOptions = field.options || [];
    onUpdate({ options: [...currentOptions, newOption] });
    setNewOptionValue("");
  };

  const removeOption = (optionId: string) => {
    const updatedOptions = (field.options || []).filter(opt => opt.id !== optionId);
    onUpdate({ options: updatedOptions });
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(field.options || []);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onUpdate({ options: items });
  };

  const showOptionsConfig = field.type === 'radio' || field.type === 'multi-select';

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {dragHandleProps && !field.isEmailField && (
            <div {...dragHandleProps} className="cursor-grab">
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </div>
          )}
          <Settings className="h-4 w-4 text-muted-foreground" />
          <h4 className="font-medium">Field Configuration</h4>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onDelete}
          disabled={field.isEmailField}
        >
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
              const updates: any = { type: value };
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

        {showOptionsConfig && !field.isEmailField && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id={`${field.id}-other-option`}
                checked={field.hasOtherOption}
                onCheckedChange={(checked) => onUpdate({ hasOtherOption: checked })}
              />
              <Label htmlFor={`${field.id}-other-option`}>Enable "Other" option</Label>
            </div>

            {field.hasOtherOption && (
              <div className="grid gap-2">
                <Label htmlFor={`${field.id}-other-placeholder`}>Other Option Placeholder</Label>
                <Input
                  id={`${field.id}-other-placeholder`}
                  value={field.otherOptionPlaceholder || ""}
                  onChange={(e) => onUpdate({ otherOptionPlaceholder: e.target.value })}
                  placeholder="e.g., Please specify"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label>Options</Label>
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId={`${field.id}-options`}>
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-2"
                    >
                      {(field.options || []).map((option, index) => (
                        <Draggable
                          key={option.id}
                          draggableId={option.id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className="flex items-center space-x-2"
                            >
                              <div {...provided.dragHandleProps}>
                                <GripVertical className="h-4 w-4 text-muted-foreground" />
                              </div>
                              <Input
                                value={option.value}
                                onChange={(e) => {
                                  const updatedOptions = [...(field.options || [])];
                                  updatedOptions[index].value = e.target.value;
                                  onUpdate({ options: updatedOptions });
                                }}
                              />
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeOption(option.id)}
                              >
                                <Minus className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>

              <div className="flex items-center space-x-2">
                <Input
                  value={newOptionValue}
                  onChange={(e) => setNewOptionValue(e.target.value)}
                  placeholder="New option"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addOption();
                    }
                  }}
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={addOption}
                  type="button"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
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
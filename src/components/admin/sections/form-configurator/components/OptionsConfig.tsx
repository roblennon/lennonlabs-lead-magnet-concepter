import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { GripVertical, Minus, Plus } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useState } from "react";

interface Option {
  id: string;
  value: string;
}

interface OptionsConfigProps {
  options: Option[];
  hasOtherOption?: boolean;
  otherOptionPlaceholder?: string;
  onUpdate: (updates: any) => void;
}

export function OptionsConfig({ 
  options = [], 
  hasOtherOption, 
  otherOptionPlaceholder,
  onUpdate 
}: OptionsConfigProps) {
  const [newOptionValue, setNewOptionValue] = useState("");

  const addOption = () => {
    if (!newOptionValue.trim()) return;
    
    const newOption = {
      id: `option-${Date.now()}`,
      value: newOptionValue
    };
    
    onUpdate({ options: [...options, newOption] });
    setNewOptionValue("");
  };

  const removeOption = (optionId: string) => {
    const updatedOptions = options.filter(opt => opt.id !== optionId);
    onUpdate({ options: updatedOptions });
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(options);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onUpdate({ options: items });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Switch
          id="other-option"
          checked={hasOtherOption}
          onCheckedChange={(checked) => onUpdate({ hasOtherOption: checked })}
        />
        <Label htmlFor="other-option">Enable "Other" option</Label>
      </div>

      {hasOtherOption && (
        <div className="grid gap-2">
          <Label htmlFor="other-placeholder">Other Option Placeholder</Label>
          <Input
            id="other-placeholder"
            value={otherOptionPlaceholder || ""}
            onChange={(e) => onUpdate({ otherOptionPlaceholder: e.target.value })}
            placeholder="e.g., Please specify"
          />
        </div>
      )}

      <div className="space-y-2">
        <Label>Options</Label>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="options">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-2"
              >
                {options.map((option, index) => (
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
                            const updatedOptions = [...options];
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
  );
}
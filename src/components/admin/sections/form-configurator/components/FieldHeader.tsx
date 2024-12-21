import { Settings, Minus, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FieldHeaderProps {
  isEmailField: boolean;
  onDelete: () => void;
  dragHandleProps?: any;
}

export function FieldHeader({ isEmailField, onDelete, dragHandleProps }: FieldHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        {dragHandleProps && !isEmailField && (
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
        disabled={isEmailField}
      >
        <Minus className="h-4 w-4 text-destructive" />
      </Button>
    </div>
  );
}
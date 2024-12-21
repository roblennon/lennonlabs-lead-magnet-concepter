import { UseFormReturn } from "react-hook-form";
import { PageConfig } from "@/types/page-config";
import { Button } from "@/components/ui/button";
import { Plus, Settings } from "lucide-react";
import { FormFieldConfig } from "./form-configurator/FormFieldConfig";
import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

type FormConfiguratorSectionProps = {
  form: UseFormReturn<PageConfig>;
};

export const FormConfiguratorSection = ({ form }: FormConfiguratorSectionProps) => {
  const [fields, setFields] = useState([
    {
      id: "1",
      label: "Your website URL or business description",
      placeholder: "e.g. website.com or tell us about your business, target audience, and what you currently offer",
      type: "textarea",
      required: true,
    },
    {
      id: "2",
      label: "Your email address",
      placeholder: "Enter your email",
      type: "email",
      required: true,
      isEmailField: true,
    }
  ]);

  const addField = () => {
    const newField = {
      id: `field-${Date.now()}`,
      label: "New Field",
      placeholder: "Enter value",
      type: "text",
      required: false,
      options: [],
      hasOtherOption: false,
      otherOptionPlaceholder: "",
    };
    // Insert new field before the email field
    const emailFieldIndex = fields.findIndex(f => f.type === 'email');
    const newFields = [...fields];
    newFields.splice(emailFieldIndex, 0, newField);
    setFields(newFields);
  };

  const updateField = (id: string, updates: any) => {
    setFields(fields.map(field => 
      field.id === id ? { ...field, ...updates } : field
    ));
  };

  const deleteField = (id: string) => {
    // Prevent deletion of email field
    const field = fields.find(f => f.id === id);
    if (field?.isEmailField) return;
    setFields(fields.filter(field => field.id !== id));
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const emailFieldIndex = fields.findIndex(f => f.type === 'email');
    
    // Prevent dropping after the email field
    if (result.destination.index >= emailFieldIndex) return;
    
    // Prevent dragging the email field
    if (fields[result.source.index].type === 'email') return;

    const reorderedFields = Array.from(fields);
    const [removed] = reorderedFields.splice(result.source.index, 1);
    reorderedFields.splice(result.destination.index, 0, removed);
    
    setFields(reorderedFields);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Form Configuration</h3>
          <p className="text-sm text-muted-foreground">
            Configure your form fields and their properties. Drag to reorder fields.
          </p>
        </div>
        <Button onClick={addField} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Field
        </Button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="form-fields">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-4"
            >
              {fields.map((field, index) => (
                <Draggable
                  key={field.id}
                  draggableId={field.id}
                  index={index}
                  isDragDisabled={field.type === 'email'}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`${snapshot.isDragging ? 'opacity-50' : ''}`}
                    >
                      <FormFieldConfig
                        field={field}
                        onUpdate={(updates) => updateField(field.id, updates)}
                        onDelete={() => deleteField(field.id)}
                        dragHandleProps={provided.dragHandleProps}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};
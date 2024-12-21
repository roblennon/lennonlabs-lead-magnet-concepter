import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { FormFieldConfig } from "./FormFieldConfig";

type FormField = {
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
};

interface FormFieldListProps {
  fields: FormField[];
  onFieldUpdate: (id: string, updates: Partial<FormField>) => void;
  onFieldDelete: (id: string) => void;
  onFieldsReorder: (fields: FormField[]) => void;
}

export const FormFieldList = ({ 
  fields, 
  onFieldUpdate, 
  onFieldDelete,
  onFieldsReorder 
}: FormFieldListProps) => {
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const emailFieldIndex = fields.findIndex(f => f.type === 'email');
    
    if (result.destination.index >= emailFieldIndex) return;
    if (fields[result.source.index].type === 'email') return;

    const reorderedFields = Array.from(fields);
    const [removed] = reorderedFields.splice(result.source.index, 1);
    reorderedFields.splice(result.destination.index, 0, removed);
    
    onFieldsReorder(reorderedFields);
  };

  return (
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
                      onUpdate={(updates) => onFieldUpdate(field.id, updates)}
                      onDelete={() => onFieldDelete(field.id)}
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
  );
};
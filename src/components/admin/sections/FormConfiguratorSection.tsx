import { UseFormReturn } from "react-hook-form";
import { PageConfig } from "@/types/page-config";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useFormFields } from "./form-configurator/hooks/useFormFields";
import { FormFieldList } from "./form-configurator/components/FormFieldList";

type FormConfiguratorSectionProps = {
  form: UseFormReturn<PageConfig>;
};

export const FormConfiguratorSection = ({ form }: FormConfiguratorSectionProps) => {
  const { fields, addField, updateField, deleteField } = useFormFields(form);

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

      <FormFieldList
        fields={fields}
        onFieldUpdate={updateField}
        onFieldDelete={deleteField}
        onFieldsReorder={(newFields) => form.setValue('form_fields', newFields)}
      />
    </div>
  );
};
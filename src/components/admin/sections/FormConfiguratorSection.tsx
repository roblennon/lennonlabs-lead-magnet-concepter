import { UseFormReturn } from "react-hook-form";
import { PageConfig } from "@/types/page-config";
import { Button } from "@/components/ui/button";
import { Plus, Settings } from "lucide-react";
import { FormFieldConfig } from "./form-configurator/FormFieldConfig";
import { useState } from "react";

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
    }
  ]);

  const addField = () => {
    const newField = {
      id: `field-${Date.now()}`,
      label: "New Field",
      placeholder: "Enter value",
      type: "text",
      required: false,
    };
    setFields([...fields, newField]);
  };

  const updateField = (id: string, updates: any) => {
    setFields(fields.map(field => 
      field.id === id ? { ...field, ...updates } : field
    ));
  };

  const deleteField = (id: string) => {
    setFields(fields.filter(field => field.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Form Configuration</h3>
          <p className="text-sm text-muted-foreground">
            Configure your form fields and their properties
          </p>
        </div>
        <Button onClick={addField} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Field
        </Button>
      </div>

      <div className="space-y-4">
        {fields.map((field) => (
          <FormFieldConfig
            key={field.id}
            field={field}
            onUpdate={(updates) => updateField(field.id, updates)}
            onDelete={() => deleteField(field.id)}
          />
        ))}
      </div>
    </div>
  );
};
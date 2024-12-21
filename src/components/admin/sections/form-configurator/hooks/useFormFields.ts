import { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { PageConfig } from "@/types/page-config";

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

export const useFormFields = (form: UseFormReturn<PageConfig>) => {
  const [fields, setFields] = useState<FormField[]>([
    {
      id: "1",
      label: "Your website URL or business description",
      placeholder: "e.g. website.com or tell us about your business, target audience, and what you currently offer",
      type: "textarea",
      required: true,
      variableName: "businessDescription"
    },
    {
      id: "2",
      label: "Your email address",
      placeholder: "Enter your email",
      type: "email",
      required: true,
      isEmailField: true,
      variableName: "email"
    }
  ]);

  useEffect(() => {
    form.setValue('form_fields', fields);
  }, [fields, form]);

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
      variableName: `field_${Date.now()}`,
      isEmailField: false
    };
    const emailFieldIndex = fields.findIndex(f => f.type === 'email');
    const newFields = [...fields];
    newFields.splice(emailFieldIndex, 0, newField);
    setFields(newFields);
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    setFields(fields.map(field => 
      field.id === id ? { ...field, ...updates } : field
    ));
  };

  const deleteField = (id: string) => {
    const field = fields.find(f => f.id === id);
    if (field?.isEmailField) return;
    setFields(fields.filter(field => field.id !== id));
  };

  return {
    fields,
    addField,
    updateField,
    deleteField,
  };
};
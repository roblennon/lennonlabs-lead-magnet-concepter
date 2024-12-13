import { useState, useEffect } from "react";
import { RevenueForm } from "@/components/RevenueForm";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { FormConfig, FormFields, ButtonConfig } from "@/types/database";
import { Json } from "@/integrations/supabase/types";

const RevenueFinder = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formConfig, setFormConfig] = useState<FormConfig>();
  const [analysis, setAnalysis] = useState<string>();
  const { toast } = useToast();

  useEffect(() => {
    const fetchFormConfig = async () => {
      try {
        const { data, error } = await supabase
          .from('form_configs')
          .select('*')
          .eq('slug', 'revenue')
          .eq('is_active', true)
          .single();

        if (error) {
          throw error;
        }

        if (!data) {
          throw new Error('No active form configuration found');
        }

        // Type assertions with validation
        const jsonFields = data.fields as Record<string, unknown>;
        const jsonButtonConfig = data.button_config as Record<string, unknown>;
        
        // Validate fields structure
        const fields = validateFields(jsonFields);
        const buttonConfig = validateButtonConfig(jsonButtonConfig);
        
        setFormConfig({
          id: data.id,
          slug: data.slug,
          title: data.title,
          description: data.description,
          fields,
          buttonConfig,
          promptId: data.prompt_id,
        });
      } catch (error) {
        console.error('Error fetching form config:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load form configuration. Please try again later.",
        });
      }
    };

    fetchFormConfig();
  }, [toast]);

  // Validation helper functions
  const validateFields = (json: Record<string, unknown>): FormFields => {
    const fields: FormFields = {};
    
    for (const [key, value] of Object.entries(json)) {
      if (typeof value === 'object' && value !== null) {
        const field = value as Record<string, unknown>;
        
        if (
          typeof field.type === 'string' &&
          typeof field.label === 'string' &&
          typeof field.required === 'boolean' &&
          typeof field.order === 'number' &&
          (field.placeholder === undefined || typeof field.placeholder === 'string') &&
          (field.options === undefined || Array.isArray(field.options))
        ) {
          fields[key] = {
            type: field.type as 'email' | 'textarea' | 'radio',
            label: field.label,
            placeholder: field.placeholder as string | undefined,
            required: field.required,
            order: field.order,
            options: field.options as Array<{ value: string; label: string }> | undefined,
          };
        } else {
          throw new Error(`Invalid field configuration for ${key}`);
        }
      }
    }
    
    return fields;
  };

  const validateButtonConfig = (json: Record<string, unknown>): ButtonConfig => {
    if (
      typeof json.text === 'string' &&
      typeof json.icon === 'string' &&
      typeof json.loadingText === 'string'
    ) {
      return {
        text: json.text,
        icon: json.icon,
        loadingText: json.loadingText,
      };
    }
    throw new Error('Invalid button configuration');
  };

  const handleSubmit = async (data: FormData) => {
    setIsLoading(true);
    setAnalysis(undefined);

    try {
      const response = await fetch('/api/analyze-revenue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.get('email'),
          offer: data.get('offer'),
          revenue_source: data.get('revenue_source'),
          help_requests: data.get('help_requests'),
          promptId: formConfig?.promptId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze revenue opportunities');
      }

      const result = await response.json();
      setAnalysis(result.analysis);
    } catch (error) {
      console.error('Error analyzing revenue:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to analyze revenue opportunities. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!formConfig) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-gray-400">Loading form...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold text-center mb-8">{formConfig.title}</h1>
      <p className="text-gray-600 text-center mb-8">{formConfig.description}</p>
      
      <RevenueForm
        config={formConfig}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        analysis={analysis}
      />
    </div>
  );
};

export default RevenueFinder;
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PageConfig } from "@/types/page-config";

export const useAdminConfig = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const form = useForm<PageConfig>();

  const fetchConfig = async () => {
    const { data, error } = await supabase
      .from("page_configs")
      .select("*")
      .eq("page_slug", "revenue-analyzer")
      .single();

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load page configuration",
        variant: "destructive",
      });
      return;
    }

    if (data) {
      const benefits = Array.isArray(data.sales_benefits) 
        ? data.sales_benefits.map(benefit => String(benefit))
        : [];

      const configData: PageConfig = {
        id: data.id,
        title: data.title,
        subtitle: data.subtitle,
        header_image_url: data.header_image_url,
        cta_text: data.cta_text,
        deliverable_empty_state: data.deliverable_empty_state,
        sales_heading: data.sales_heading,
        sales_intro: data.sales_intro,
        sales_benefits: benefits,
        sales_closing: data.sales_closing,
        sales_image_url: data.sales_image_url,
        cta_heading: data.cta_heading,
        cta_body: data.cta_body,
        cta_button_text: data.cta_button_text,
        cta_url: data.cta_url,
        convertkit_form_id: data.convertkit_form_id || "",
        convertkit_fields: typeof data.convertkit_fields === 'object' 
          ? data.convertkit_fields as Record<string, string>
          : {},
      };
      form.reset(configData);
    }
  };

  const handleSubmit = async (values: PageConfig) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("page_configs")
        .update({
          title: values.title,
          subtitle: values.subtitle,
          header_image_url: values.header_image_url,
          cta_text: values.cta_text,
          deliverable_empty_state: values.deliverable_empty_state,
          sales_heading: values.sales_heading,
          sales_intro: values.sales_intro,
          sales_benefits: values.sales_benefits,
          sales_closing: values.sales_closing,
          sales_image_url: values.sales_image_url,
          cta_heading: values.cta_heading,
          cta_body: values.cta_body,
          cta_button_text: values.cta_button_text,
          cta_url: values.cta_url,
          convertkit_form_id: values.convertkit_form_id,
          convertkit_fields: values.convertkit_fields,
        })
        .eq("page_slug", "revenue-analyzer");

      if (error) throw error;

      toast({
        title: "Success",
        description: "Page configuration updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update page configuration",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    isLoading,
    fetchConfig,
    handleSubmit,
  };
};
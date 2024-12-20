import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { PageConfig } from "@/types/page-config";
import { HeaderSection } from "@/components/admin/sections/HeaderSection";
import { FormSection } from "@/components/admin/sections/FormSection";
import { SalesSection } from "@/components/admin/sections/SalesSection";
import { CTASection } from "@/components/admin/sections/CTASection";

const AdminR = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const form = useForm<PageConfig>();

  useEffect(() => {
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
        };
        form.reset(configData);
      }
    };

    fetchConfig();
  }, [form, toast]);

  const onSubmit = async (values: PageConfig) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("page_configs")
        .update({
          title: values.title,
          subtitle: values.subtitle,
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Revenue Analyzer Configuration</h1>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-8">
              <HeaderSection form={form} />
              <FormSection form={form} />
            </div>
            <div className="space-y-8">
              <SalesSection form={form} />
              <CTASection form={form} />
            </div>
          </div>
          
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AdminR;
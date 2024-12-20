import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { AdminFormFields } from "@/components/admin/AdminFormFields";
import { PageConfig } from "@/types/page-config";

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
        // Ensure sales_benefits is properly converted to string array
        const benefits = Array.isArray(data.sales_benefits) 
          ? data.sales_benefits.map(benefit => String(benefit))
          : [];

        const configData: PageConfig = {
          id: data.id,
          sales_heading: data.sales_heading,
          sales_intro: data.sales_intro,
          sales_benefits: benefits,
          sales_closing: data.sales_closing,
          sales_image_url: data.sales_image_url,
          cta_heading: data.cta_heading,
          cta_body: data.cta_body,
          cta_button_text: data.cta_button_text,
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
          sales_heading: values.sales_heading,
          sales_intro: values.sales_intro,
          sales_benefits: values.sales_benefits,
          sales_closing: values.sales_closing,
          sales_image_url: values.sales_image_url,
          cta_heading: values.cta_heading,
          cta_body: values.cta_body,
          cta_button_text: values.cta_button_text,
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-2xl">
          <AdminFormFields form={form} />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AdminR;
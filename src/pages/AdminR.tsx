import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

type PageConfig = {
  id: string;
  sales_heading: string;
  sales_intro: string;
  sales_benefits: string[];
  sales_closing: string;
  sales_image_url: string;
  cta_heading: string;
  cta_body: string;
  cta_button_text: string;
};

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
        form.reset(data);
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
      <h1 className="text-2xl font-bold mb-8">Admin Configuration</h1>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="sales_heading"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sales Heading</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sales_intro"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sales Intro</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sales_benefits"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sales Benefits (comma-separated)</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    value={field.value?.join(", ")} 
                    onChange={(e) => field.onChange(e.target.value.split(", "))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sales_closing"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sales Closing</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sales_image_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sales Image URL</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cta_heading"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CTA Heading</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cta_body"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CTA Body</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cta_button_text"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CTA Button Text</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AdminR;
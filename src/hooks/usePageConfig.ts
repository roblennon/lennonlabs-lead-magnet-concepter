import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageConfig } from "@/types/page-config";
import { useToast } from "@/hooks/use-toast";

export const usePageConfig = (pageSlug: string) => {
  const [config, setConfig] = useState<PageConfig | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const { data, error } = await supabase
          .from("page_configs")
          .select("*")
          .eq("page_slug", pageSlug)
          .single();

        if (error) {
          console.error("Error fetching config:", error);
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

          const configWithParsedBenefits: PageConfig = {
            sales_heading: data.sales_heading,
            sales_intro: data.sales_intro,
            sales_benefits: benefits,
            sales_closing: data.sales_closing,
            sales_image_url: data.sales_image_url,
            cta_heading: data.cta_heading,
            cta_body: data.cta_body,
            cta_button_text: data.cta_button_text,
            title: data.title,
            subtitle: data.subtitle,
            cta_text: data.cta_text,
            deliverable_empty_state: data.deliverable_empty_state,
          };
          setConfig(configWithParsedBenefits);
        }
      } catch (error) {
        console.error("Failed to fetch config:", error);
        toast({
          title: "Error",
          description: "Failed to load page configuration",
          variant: "destructive",
        });
      }
    };

    fetchConfig();

    const channel = supabase
      .channel('page_configs_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'page_configs',
          filter: `page_slug=eq.${pageSlug}`
        },
        (payload) => {
          console.log('Received real-time update:', payload);
          fetchConfig();
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
      });

    return () => {
      channel.unsubscribe();
    };
  }, [pageSlug, toast]);

  return config;
};
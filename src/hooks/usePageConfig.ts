import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageConfig } from "@/types/page-config";

export const usePageConfig = () => {
  const [config, setConfig] = useState<PageConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const { data, error } = await supabase
          .from("page_configs")
          .select("*")
          .eq("page_slug", "revenue-analyzer")
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          const benefits = Array.isArray(data.sales_benefits)
            ? data.sales_benefits.map((benefit) => String(benefit))
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
            cta_url: data.cta_url,
            title: data.title,
            subtitle: data.subtitle,
            cta_text: data.cta_text,
            deliverable_empty_state: data.deliverable_empty_state,
            header_image_url: data.header_image_url,
            convertkit_form_id: data.convertkit_form_id || "",
            convertkit_fields: typeof data.convertkit_fields === 'object' 
              ? data.convertkit_fields as Record<string, string>
              : {},
          };
          setConfig(configWithParsedBenefits);
        }
      } catch (error) {
        console.error("Error fetching page config:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConfig();
  }, []);

  return { config, isLoading };
};
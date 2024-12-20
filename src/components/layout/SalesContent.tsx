import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PageConfig } from "@/types/page-config";

const SalesContent = () => {
  const [config, setConfig] = useState<PageConfig | null>(null);

  useEffect(() => {
    // Initial fetch of config
    const fetchConfig = async () => {
      const { data } = await supabase
        .from("page_configs")
        .select("*")
        .eq("page_slug", "revenue-analyzer")
        .single();

      if (data) {
        // Ensure sales_benefits is properly converted to string array
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
    };

    fetchConfig();

    // Set up real-time subscription
    const subscription = supabase
      .channel('page_configs_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'page_configs',
          filter: `page_slug=eq.revenue-analyzer`
        },
        async (payload) => {
          // Refetch the config when changes occur
          await fetchConfig();
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (!config) return null;

  return (
    <>
      <section className="container mx-auto px-4 sm:px-8 py-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 p-8 bg-card/30 rounded-xl min-h-[600px] flex flex-col justify-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary">
              {config.sales_heading}
            </h2>
            
            <p className="text-lg text-muted-foreground">
              {config.sales_intro}
            </p>
            
            <ul className="space-y-4">
              {config.sales_benefits.map((benefit, index) => (
                <li key={index} className="flex items-start space-x-3 text-muted-foreground">
                  <svg className="h-6 w-6 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
            
            <p className="text-muted-foreground">
              {config.sales_closing}
            </p>
          </div>
          
          <div className="relative h-[600px]">
            <div className="absolute -inset-4 bg-primary/5 rounded-xl -z-10" />
            <img
              src={config.sales_image_url}
              alt="Example lead magnet analysis"
              className="rounded-lg shadow-xl w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 sm:px-8 py-16 sm:py-24 text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold">
            {config.cta_heading}
          </h2>
          <p className="text-lg text-muted-foreground">
            {config.cta_body}
          </p>
          <Button size="lg" className="mt-4">
            {config.cta_button_text} <ArrowRight className="ml-2" />
          </Button>
        </div>
      </section>
    </>
  );
};

export default SalesContent;
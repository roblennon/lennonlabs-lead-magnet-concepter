import { usePageConfig } from "@/hooks/usePageConfig";
import { BenefitsList } from "./BenefitsList";
import { CTASection } from "./CTASection";

const SalesContent = () => {
  const config = usePageConfig("revenue-analyzer");

  if (!config) return null;

  return (
    <>
      <section className="container mx-auto px-4 sm:px-8 py-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-8 p-8 bg-card/30 rounded-xl min-h-[600px] flex flex-col justify-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary">
              {config.sales_heading}
            </h2>
            
            <p className="text-lg text-muted-foreground">
              {config.sales_intro}
            </p>
            
            <BenefitsList benefits={config.sales_benefits} />
            
            <p className="text-muted-foreground">
              {config.sales_closing}
            </p>
          </div>
          
          <div className="lg:col-span-5 relative h-[600px]">
            <div className="absolute -inset-4 bg-primary/5 rounded-xl -z-10" />
            <img
              src={config.sales_image_url}
              alt="Example lead magnet analysis"
              className="rounded-lg shadow-xl w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      <CTASection 
        heading={config.cta_heading}
        body={config.cta_body}
        buttonText={config.cta_button_text}
        url={config.cta_url}
      />
    </>
  );
};

export default SalesContent;
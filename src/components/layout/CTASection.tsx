import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface CTASectionProps {
  heading: string;
  body: string;
  buttonText: string;
}

export const CTASection = ({ heading, body, buttonText }: CTASectionProps) => {
  return (
    <section className="container mx-auto px-4 sm:px-8 py-16 sm:py-24 text-center">
      <div className="max-w-2xl mx-auto space-y-6">
        <h2 className="text-3xl sm:text-4xl font-bold">
          {heading}
        </h2>
        <p className="text-lg text-muted-foreground">
          {body}
        </p>
        <Button size="lg" className="mt-4">
          {buttonText} <ArrowRight className="ml-2" />
        </Button>
      </div>
    </section>
  );
};
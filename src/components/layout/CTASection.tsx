import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface CTASectionProps {
  heading: string;
  body: string;
  buttonText: string;
  url: string;
}

export const CTASection = ({ heading, body, buttonText, url }: CTASectionProps) => {
  const renderWithLineBreaks = (text: string) => {
    return text.split('\n').map((line, index) => (
      <span key={index}>
        {line}
        {index < text.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  return (
    <section className="container mx-auto px-4 sm:px-8 py-16 sm:py-24 text-center">
      <div className="max-w-2xl mx-auto space-y-6">
        <h2 className="text-3xl sm:text-4xl font-bold">
          {renderWithLineBreaks(heading)}
        </h2>
        <p className="text-lg text-muted-foreground">
          {renderWithLineBreaks(body)}
        </p>
        <Button size="lg" className="mt-4" asChild>
          <a href={url} target="_blank" rel="noopener noreferrer">
            {buttonText} <ArrowRight className="ml-2" />
          </a>
        </Button>
      </div>
    </section>
  );
};
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const SalesContent = () => {
  return (
    <>
      <section className="container mx-auto px-4 sm:px-8 py-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 p-8 bg-card/30 rounded-xl min-h-[600px] flex flex-col justify-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary">
              Transform Your Website Into a Lead Generation Machine
            </h2>
            
            <p className="text-lg text-muted-foreground">
              Stop guessing what content will attract your ideal customers. Our AI-powered lead magnet generator analyzes your business and creates targeted content ideas that will grow your email list.
            </p>
            
            <ul className="space-y-4">
              <li className="flex items-start space-x-3 text-muted-foreground">
                <svg className="h-6 w-6 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                <span>Get instant, personalized lead magnet ideas based on your specific business and audience</span>
              </li>
              <li className="flex items-start space-x-3 text-muted-foreground">
                <svg className="h-6 w-6 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                <span>Save hours of brainstorming time with AI-powered content suggestions</span>
              </li>
              <li className="flex items-start space-x-3 text-muted-foreground">
                <svg className="h-6 w-6 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                <span>Convert more visitors into subscribers with targeted lead magnets</span>
              </li>
            </ul>
            
            <p className="text-muted-foreground">
              Join thousands of businesses who have already transformed their lead generation strategy with our AI-powered tool.
            </p>
          </div>
          
          <div className="relative h-[600px]">
            <div className="absolute -inset-4 bg-primary/5 rounded-xl -z-10" />
            <img
              src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
              alt="Example lead magnet analysis"
              className="rounded-lg shadow-xl w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 sm:px-8 py-16 sm:py-24 text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold">
            Get more AI-powered resources like this
          </h2>
          <p className="text-lg text-muted-foreground">
            Join Lennon Labs free today for more free AI tools, exclusive content, and membership perks.
          </p>
          <Button size="lg" className="mt-4">
            Join free <ArrowRight className="ml-2" />
          </Button>
        </div>
      </section>
    </>
  );
};

export default SalesContent;
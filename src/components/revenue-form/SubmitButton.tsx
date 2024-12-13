import { Button } from "../ui/button";
import { Lightning } from "lucide-react";

interface SubmitButtonProps {
  isLoading?: boolean;
}

export function SubmitButton({ isLoading }: SubmitButtonProps) {
  return (
    <Button 
      type="submit" 
      className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 text-base font-medium"
      disabled={isLoading}
    >
      {isLoading ? "Analyzing..." : "Generate Revenue Opportunities"}
      {!isLoading && <Lightning className="ml-2" />}
    </Button>
  );
}
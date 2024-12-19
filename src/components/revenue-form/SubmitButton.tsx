import { Button } from "../ui/button";

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
      {isLoading ? "Generating Ideas..." : "Generate Lead Magnet Ideas"}
    </Button>
  );
}
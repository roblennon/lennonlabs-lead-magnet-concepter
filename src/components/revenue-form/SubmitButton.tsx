import { Button } from "../ui/button";
import { ButtonConfig } from "@/types/database";
import { LucideIcon } from "lucide-react";
import * as Icons from "lucide-react";

interface SubmitButtonProps {
  isLoading?: boolean;
  config: ButtonConfig;
}

export function SubmitButton({ isLoading, config }: SubmitButtonProps) {
  // Dynamically get the icon component from lucide-react
  const IconComponent = Icons[config.icon as keyof typeof Icons] as LucideIcon;

  return (
    <Button 
      type="submit" 
      className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 text-base font-medium"
      disabled={isLoading}
    >
      {isLoading ? config.loadingText : config.text}
      {!isLoading && IconComponent && <IconComponent className="ml-2" />}
    </Button>
  );
}
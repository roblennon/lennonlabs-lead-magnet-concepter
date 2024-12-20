import { Loader2 } from "lucide-react";

export function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <div className="relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <div className="h-16 w-16 rounded-full border-4 border-muted animate-pulse" />
      </div>
      <p className="text-base text-muted-foreground animate-pulse font-inter">
        Analyzing your business opportunities...
      </p>
    </div>
  );
}
import { Card } from "./ui/card";

interface AnalysisPanelProps {
  isLoading?: boolean;
  analysis?: string;
}

export function AnalysisPanel({ isLoading, analysis }: AnalysisPanelProps) {
  if (!analysis && !isLoading) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground p-8">
        <p className="text-center text-sm">
          Fill out the form on the left to receive your personalized revenue opportunity analysis.
        </p>
      </div>
    );
  }

  return (
    <Card className="h-full overflow-auto bg-secondary/50 p-8 border-border/50">
      {isLoading ? (
        <div className="h-full flex items-center justify-center">
          <div className="space-y-4 w-full max-w-md">
            <div className="h-4 bg-muted/50 rounded animate-pulse" />
            <div className="h-4 bg-muted/50 rounded animate-pulse w-5/6" />
            <div className="h-4 bg-muted/50 rounded animate-pulse w-4/6" />
          </div>
        </div>
      ) : (
        <div className="prose prose-invert max-w-none">
          <h2 className="text-xl font-semibold mb-6 text-primary">Revenue Opportunity Analysis</h2>
          <div className="whitespace-pre-wrap text-sm leading-relaxed">{analysis}</div>
        </div>
      )}
    </Card>
  );
}
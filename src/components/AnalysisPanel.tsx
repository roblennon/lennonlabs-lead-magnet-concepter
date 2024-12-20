import { Card } from "./ui/card";
import { AnalysisContent } from "./AnalysisContent";
import { LoadingState } from "./analysis/LoadingState";
import { PlaceholderState } from "./analysis/PlaceholderState";
import { ActionButtons } from "./analysis/ActionButtons";

interface AnalysisPanelProps {
  isLoading?: boolean;
  analysis?: string;
}

export function AnalysisPanel({ isLoading, analysis }: AnalysisPanelProps) {
  if (!analysis && !isLoading) {
    return <PlaceholderState />;
  }

  return (
    <Card className="bg-white p-4 sm:p-8 border-border/50 h-full overflow-auto">
      {isLoading ? (
        <LoadingState />
      ) : (
        <div className="space-y-6">
          <ActionButtons analysis={analysis || ''} />
          <AnalysisContent content={analysis || ''} />
        </div>
      )}
    </Card>
  );
}
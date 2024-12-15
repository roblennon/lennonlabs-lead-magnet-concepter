import ReactMarkdown from 'react-markdown';

interface AnalysisContentProps {
  content: string;
}

export function AnalysisContent({ content }: AnalysisContentProps) {
  return (
    <div id="analysis-content" className="prose prose-slate max-w-none font-inter [&>h3]:mt-8">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
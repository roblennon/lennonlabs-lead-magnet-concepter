import ReactMarkdown from 'react-markdown';

interface AnalysisContentProps {
  content: string;
}

export function AnalysisContent({ content }: AnalysisContentProps) {
  return (
    <div id="analysis-content" className="prose max-w-none font-inter text-gray-700 [&>h3]:mt-6">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
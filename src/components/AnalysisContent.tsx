import ReactMarkdown from 'react-markdown';

interface AnalysisContentProps {
  content: string;
}

export function AnalysisContent({ content }: AnalysisContentProps) {
  return (
    <div id="analysis-content" className="prose prose-slate max-w-none font-inter [&>h2]:mt-8 [&>h3]:mt-6 [&>p]:text-gray-700 [&>ul]:text-gray-700 [&>ol]:text-gray-700">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
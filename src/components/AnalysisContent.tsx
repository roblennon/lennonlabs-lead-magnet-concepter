import ReactMarkdown from 'react-markdown';

interface AnalysisContentProps {
  content: string;
}

export function AnalysisContent({ content }: AnalysisContentProps) {
  return (
    <div 
      id="analysis-content" 
      className="
        prose 
        prose-slate 
        max-w-[180mm] 
        mx-auto 
        p-8 
        font-inter 
        prose-headings:text-[#333333] 
        prose-headings:font-semibold 
        prose-p:text-[#333333] 
        prose-p:leading-relaxed 
        prose-p:mb-4
        prose-ul:list-disc 
        prose-ul:ml-4 
        prose-li:text-[#333333]
        prose-li:mb-2
        prose-h1:text-4xl
        prose-h1:mb-8
        prose-h2:text-3xl
        prose-h2:mb-6
        prose-h3:text-2xl
        prose-h3:mb-4
        prose-strong:text-[#333333]
        prose-strong:font-semibold
        prose-a:text-[#F1C40F]
        prose-a:no-underline
        prose-a:font-medium
        [&>h3]:mt-8
        [&>p:first-of-type]:text-lg
        [&>p:first-of-type]:font-medium
        [&>ul]:my-6
        [&>ol]:my-6
        [&>*:last-child]:mb-0
      "
    >
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
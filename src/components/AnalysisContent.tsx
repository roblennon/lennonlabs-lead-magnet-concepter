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
        bg-white 
        text-black
        p-8 
        font-inter 
        prose-headings:text-black 
        prose-headings:font-semibold 
        prose-p:text-black
        prose-p:leading-relaxed 
        prose-p:mb-4
        prose-ul:list-disc 
        prose-ul:ml-4 
        prose-li:text-black
        prose-li:mb-2
        prose-h1:text-4xl
        prose-h1:mb-8
        prose-h2:text-3xl
        prose-h2:mb-6
        prose-h3:text-2xl
        prose-h3:mb-4
        prose-strong:text-black
        prose-strong:font-semibold
        [&>h3]:mt-8
        [&>p:first-of-type]:text-lg
        [&>p:first-of-type]:font-medium
        [&>ul]:my-6
        [&>ol]:my-6
        [&>*:last-child]:mb-0
      "
    >
      <ReactMarkdown>{content}</ReactMarkdown>
      <div className="mt-16 pt-8 border-t border-gray-200 flex items-center justify-center space-x-3">
        <a 
          href="https://lennonlabs.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center space-x-2 no-underline"
        >
          <img 
            src="/lovable-uploads/03da23fe-9a53-4fbe-b9d9-1ee4f1589282.png" 
            alt="Lennon Labs Logo" 
            className="h-10 w-10"
          />
          <span className="text-black hover:text-[#F1C40F] transition-colors font-medium">
            Lennon Labs
          </span>
        </a>
      </div>
    </div>
  );
}
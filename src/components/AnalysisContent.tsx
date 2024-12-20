import React from "react";
import { cn } from "@/lib/utils";

interface AnalysisContentProps {
  content: string;
  className?: string;
}

export function AnalysisContent({ content, className }: AnalysisContentProps) {
  return (
    <div
      id="analysis-content"
      className={cn(
        "prose max-w-none",
        "prose-headings:text-[#333333]",
        "prose-headings:font-inter",
        "prose-p:text-[#333333]",
        "prose-p:leading-relaxed",
        "prose-p:mb-4",
        "prose-ul:text-[#333333]",
        "prose-ul:mb-6",
        "prose-li:text-[#333333]",
        "prose-li:mb-2",
        "prose-h1:text-4xl",
        "prose-h1:mb-2",
        "prose-h2:text-3xl",
        "prose-h2:mb-6",
        "prose-h2:mt-16",
        "prose-h3:text-2xl",
        "prose-h3:mb-4",
        "prose-strong:text-[#333333]",
        "prose-strong:font-semibold",
        "prose-a:text-[#333333]",
        "prose-a:no-underline",
        "prose-a:font-semibold",
        "hover:prose-a:text-[#F1C40F]",
        "prose-a:transition-colors",
        "[&>h3]:mt-8",
        "[&>p:first-of-type]:text-lg",
        "[&>p:first-of-type]:font-medium",
        className
      )}
    >
      <div dangerouslySetInnerHTML={{ __html: content }} />
      
      <div className="mt-16 pt-8 border-t border-gray-200">
        <a
          href="https://lennonlabs.com"
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-3"
        >
          <img
            src="/lovable-uploads/0f88646c-7d27-4ae0-a256-d2be2b7d6098.png"
            alt="Lennon Labs Logo" 
            className="h-10 w-10"
          />
          <span className="text-[rgb(61,59,69)] font-medium group-hover:text-[#F1C40F] transition-colors">
            Lennon Labs
          </span>
        </a>
      </div>
    </div>
  );
}
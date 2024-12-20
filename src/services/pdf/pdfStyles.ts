export const pdfStyles = {
  container: {
    padding: '15mm',
    maxWidth: '180mm',
    margin: '0 auto',
    fontFamily: 'Inter, sans-serif',
    fontSize: '12pt',
    lineHeight: '1.6',
    color: '#333333',
  },
  content: {
    prose: `
      prose 
      prose-slate 
      max-w-[180mm] 
      mx-auto 
      p-4 
      sm:p-8 
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
      prose-h1:mb-2
      prose-h2:text-3xl
      prose-h2:mb-6
      prose-h2:mt-16
      prose-h3:text-2xl
      prose-h3:mb-4
      prose-strong:text-[#333333]
      prose-strong:font-semibold
      prose-a:text-[#333333]
      prose-a:no-underline
      prose-a:font-semibold
      [&>h3]:mt-8
      [&>p:first-of-type]:text-lg
      [&>p:first-of-type]:font-medium
      [&>ul]:my-6
      [&>ol]:my-6
      [&>*:last-child]:mb-0
    `,
  },
  footer: {
    marginTop: '16px',
    paddingTop: '8px',
    borderTop: '1px solid #e5e7eb',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
  },
};

export const getPdfOptions = (filename: string) => ({
  margin: [15, 15, 15, 15],
  filename: `${filename}.pdf`,
  image: { type: 'jpeg', quality: 0.98 },
  html2canvas: {
    scale: 2,
    useCORS: true,
    letterRendering: true,
    logging: false,
    windowWidth: undefined,
    scrollY: -window.scrollY,
  },
  jsPDF: {
    unit: 'mm',
    format: 'a4',
    orientation: 'portrait',
    compress: true,
    hotfixes: ['px_scaling'],
  },
});
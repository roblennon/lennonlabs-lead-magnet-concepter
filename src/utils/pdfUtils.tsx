import { supabase } from "@/integrations/supabase/client";
import jsPDF from 'jspdf';
import ReactMarkdown from 'react-markdown';
import { renderToString } from 'react-dom/server';

// Configure PDF fonts and styling
const configurePDF = (pdf: jsPDF) => {
  pdf.setFont("helvetica");
  pdf.setFontSize(11);
  pdf.setLineHeightFactor(1.5);
};

const addTextWithWrapping = (pdf: jsPDF, text: string, x: number, y: number, maxWidth: number): number => {
  const lines = pdf.splitTextToSize(text, maxWidth);
  pdf.text(lines, x, y);
  return y + (lines.length * pdf.getLineHeight());
};

const processMarkdownNode = (node: any): string => {
  if (typeof node === 'string') return node;
  
  if (Array.isArray(node)) {
    return node.map(n => processMarkdownNode(n)).join('\n');
  }

  if (node.type === 'heading') {
    return `${'\n'.repeat(2)}${node.children.map(processMarkdownNode).join('')}${'\n'}`;
  }

  if (node.type === 'paragraph') {
    return `${node.children.map(processMarkdownNode).join('')}\n\n`;
  }

  if (node.type === 'list') {
    return node.children.map((item: any, i: number) => 
      `${i + 1}. ${processMarkdownNode(item)}\n`
    ).join('');
  }

  if (node.type === 'listItem') {
    return node.children.map(processMarkdownNode).join('');
  }

  if (node.type === 'strong') {
    return node.children.map(processMarkdownNode).join('');
  }

  return node.children ? node.children.map(processMarkdownNode).join('') : '';
};

export const generatePDF = async (element: HTMLElement, filename: string): Promise<string> => {
  try {
    // Initialize PDF with A4 format
    const pdf = new jsPDF({
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait'
    });

    configurePDF(pdf);

    // Get page dimensions
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    const maxWidth = pageWidth - (margin * 2);

    // Parse markdown content
    const markdownContent = element.innerText;
    const parsedContent = require('react-markdown').unified().parse(markdownContent);
    const processedText = processMarkdownNode(parsedContent);

    // Split content into sections
    const sections = processedText.split('\n\n').filter(Boolean);

    let currentY = margin;
    let currentPage = 1;

    // Process each section
    sections.forEach((section: string) => {
      // Check if we need a new page
      if (currentY > pageHeight - margin) {
        pdf.addPage();
        currentPage++;
        currentY = margin;
      }

      // Add section text with proper wrapping
      if (section.trim()) {
        currentY = addTextWithWrapping(pdf, section.trim(), margin, currentY, maxWidth);
        currentY += 5; // Add some spacing between sections
      }
    });

    // Generate PDF blob
    const pdfBlob = pdf.output('blob');
    const timestamp = new Date().getTime();
    const storageFilename = `${filename}-${timestamp}.pdf`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('analysis-pdfs')
      .upload(storageFilename, pdfBlob, {
        contentType: 'application/pdf',
        cacheControl: '15780000'
      });

    if (error) throw error;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('analysis-pdfs')
      .getPublicUrl(storageFilename);

    return publicUrl;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};
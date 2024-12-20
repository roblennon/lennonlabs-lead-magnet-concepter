export const pdfStyles = {
  container: {
    padding: '15mm',
    maxWidth: '180mm',
    margin: '0 auto',
    fontFamily: 'Arial, sans-serif',
    fontSize: '12pt',
    lineHeight: '1.6',
    color: '#000',
  },
  headings: {
    h1: {
      fontSize: '24pt',
      fontWeight: 'bold',
      marginBottom: '20px',
      color: '#000',
      pageBreakAfter: 'avoid',
    },
    h2: {
      fontSize: '18pt',
      fontWeight: 'bold',
      marginTop: '25px',
      marginBottom: '15px',
      color: '#000',
      pageBreakAfter: 'avoid',
    },
    h3: {
      fontSize: '16pt',
      fontWeight: 'bold',
      marginTop: '20px',
      marginBottom: '10px',
      color: '#000',
      pageBreakAfter: 'avoid',
    },
  },
  text: {
    paragraph: {
      marginBottom: '12px',
      fontSize: '12pt',
      color: '#000',
      pageBreakInside: 'avoid',
    },
    list: {
      marginLeft: '20px',
      marginBottom: '15px',
      listStyleType: 'disc',
      pageBreakInside: 'avoid',
    },
    listItem: {
      marginBottom: '8px',
      fontSize: '12pt',
      color: '#000',
    },
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
    putTotalPages: true,
  },
});
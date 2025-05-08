// import { OutputFormat } from '@/integrations/supabase/client';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';

export const outputFormatter = {
  // Download task result in various formats
  downloadTaskResult(result: string, taskTitle: string, format: OutputFormat): void {
    switch (format) {
      case 'pdf':
        this.downloadAsPDF(result, taskTitle);
        break;
      case 'json':
        this.downloadAsJSON(result, taskTitle);
        break;
      case 'csv':
        this.downloadAsCSV(result, taskTitle);
        break;
      case 'text':
      default:
        this.downloadAsText(result, taskTitle);
        break;
    }
  },
  
  // Convert task result to text file and download
  downloadAsText(text: string, filename: string): void {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, `${filename}.txt`);
  },
  
  // Convert task result to PDF and download
  downloadAsPDF(text: string, filename: string): void {
    const doc = new jsPDF();
    
    // Split text into lines that fit on the PDF page
    const splitText = doc.splitTextToSize(text, 190);
    
    // Add text to PDF
    doc.text(splitText, 10, 10);
    
    // Save PDF
    doc.save(`${filename}.pdf`);
  },
  
  // Convert task result to JSON and download
  downloadAsJSON(text: string, filename: string): void {
    // Try to parse the text as JSON, if it fails, wrap it in a JSON object
    let jsonContent;
    try {
      // If the text is already valid JSON, parse it
      JSON.parse(text);
      jsonContent = text;
    } catch (error) {
      // If it's not valid JSON, wrap it in a JSON object
      jsonContent = JSON.stringify({ result: text }, null, 2);
    }
    
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8' });
    saveAs(blob, `${filename}.json`);
  },
  
  // Convert task result to CSV and download
  downloadAsCSV(text: string, filename: string): void {
    // Simple conversion - split text by lines and commas
    // In a real app, you would want a more robust CSV parser/formatter
    const lines = text.split('\n');
    let csvContent = '';
    
    // Process each line
    lines.forEach(line => {
      // Replace commas with actual CSV commas
      const processedLine = line.replace(/,/g, ',');
      csvContent += processedLine + '\n';
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, `${filename}.csv`);
  }
};

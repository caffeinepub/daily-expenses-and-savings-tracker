/**
 * Simple PDF generator utility
 * Creates valid PDF documents without external dependencies
 */

export class SimplePDF {
  private objects: string[] = [];
  private objectOffsets: number[] = [];
  private currentY = 750;
  private pageHeight = 792;
  private pageWidth = 612;
  private margin = 50;
  private fontSize = 12;
  private lineHeight = 14;

  constructor() {
    // PDF Header
    this.objects.push('%PDF-1.4');
  }

  addText(text: string, x: number, y: number, size: number = this.fontSize, bold: boolean = false): void {
    // Store for later rendering
    if (!this.currentPage) {
      this.currentPage = [];
    }
    this.currentPage.push({ type: 'text', text, x, y, size, bold });
  }

  addLine(x1: number, y1: number, x2: number, y2: number): void {
    if (!this.currentPage) {
      this.currentPage = [];
    }
    this.currentPage.push({ type: 'line', x1, y1, x2, y2 });
  }

  private currentPage: any[] = [];

  private flushPage(): string {
    let content = '';
    
    for (const item of this.currentPage) {
      if (item.type === 'text') {
        const font = item.bold ? 'F2' : 'F1';
        content += `BT\n/${font} ${item.size} Tf\n${item.x} ${item.y} Td\n(${this.escapeString(item.text)}) Tj\nET\n`;
      } else if (item.type === 'line') {
        content += `${item.x1} ${item.y1} m\n${item.x2} ${item.y2} l\nS\n`;
      }
    }
    
    this.currentPage = [];
    return content;
  }

  private escapeString(str: string): string {
    return str
      .replace(/\\/g, '\\\\')
      .replace(/\(/g, '\\(')
      .replace(/\)/g, '\\)')
      .replace(/\n/g, ' ')
      .replace(/\r/g, ' ');
  }

  generate(): Blob {
    // Flush current page
    const pageContent = this.flushPage();
    
    // Build PDF structure
    let pdf = '%PDF-1.4\n';
    const objects: string[] = [];
    const offsets: number[] = [];
    
    // Object 1: Catalog
    offsets.push(pdf.length);
    objects.push('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n');
    pdf += objects[objects.length - 1];
    
    // Object 2: Pages
    offsets.push(pdf.length);
    objects.push('2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n');
    pdf += objects[objects.length - 1];
    
    // Object 3: Page
    offsets.push(pdf.length);
    objects.push(`3 0 obj\n<< /Type /Page /Parent 2 0 R /Resources 4 0 R /MediaBox [0 0 ${this.pageWidth} ${this.pageHeight}] /Contents 5 0 R >>\nendobj\n`);
    pdf += objects[objects.length - 1];
    
    // Object 4: Resources
    offsets.push(pdf.length);
    objects.push('4 0 obj\n<< /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> /F2 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >> >> >>\nendobj\n');
    pdf += objects[objects.length - 1];
    
    // Object 5: Content stream
    const streamContent = pageContent;
    offsets.push(pdf.length);
    objects.push(`5 0 obj\n<< /Length ${streamContent.length} >>\nstream\n${streamContent}endstream\nendobj\n`);
    pdf += objects[objects.length - 1];
    
    // Cross-reference table
    const xrefOffset = pdf.length;
    pdf += 'xref\n';
    pdf += `0 ${offsets.length + 1}\n`;
    pdf += '0000000000 65535 f \n';
    for (const offset of offsets) {
      pdf += String(offset).padStart(10, '0') + ' 00000 n \n';
    }
    
    // Trailer
    pdf += 'trailer\n';
    pdf += `<< /Size ${offsets.length + 1} /Root 1 0 R >>\n`;
    pdf += 'startxref\n';
    pdf += `${xrefOffset}\n`;
    pdf += '%%EOF\n';
    
    return new Blob([pdf], { type: 'application/pdf' });
  }
}

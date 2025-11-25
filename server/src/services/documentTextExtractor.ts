import fs from 'fs';
import path from 'path';
// NOTE: pdf-parse pulls in pdfjs-dist which expects browser DOM APIs (DOMMatrix, ImageData, Path2D)
// and can crash the Node process at import time on some environments. We do a runtime check and
// lazy import pdf-parse only when the environment supports the necessary globals. If not present
// we skip PDF parsing (return empty string) so the backend can start reliably in pure Node.
import mammoth from 'mammoth';

export async function extractTextFromFile(filePath: string, mimeType?: string, originalFilename?: string): Promise<string> {
  try {
    if (mimeType === 'application/pdf' || filePath.endsWith('.pdf')) {
      return await extractPdfText(filePath);
    }
    if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || filePath.endsWith('.docx')) {
      return await extractDocxText(filePath);
    }
    if (mimeType === 'text/plain' || filePath.endsWith('.txt')) {
      return await extractTxtText(filePath);
    }
    // Fallback: treat as binary, no text
    return '';
  } catch (err) {
    console.error('Text extraction failed:', err);
    return '';
  }
}

async function extractPdfText(filePath: string): Promise<string> {
  // Avoid importing pdf-parse if the Node environment lacks DOM APIs used by pdfjs-dist
  if (typeof (global as any).DOMMatrix === 'undefined' || typeof (global as any).ImageData === 'undefined' || typeof (global as any).Path2D === 'undefined') {
    console.warn('Skipping PDF parsing: missing DOM APIs (DOMMatrix/ImageData/Path2D). Install a canvas polyfill to enable PDF parsing.');
    return '';
  }

  try {
    const pdfParse = (await import('pdf-parse')).default;
    const data = fs.readFileSync(filePath);
    const result = await pdfParse(data);
    return result.text;
  } catch (err) {
    console.error('PDF parse failed:', err);
    return '';
  }
}

async function extractDocxText(filePath: string): Promise<string> {
  const result = await mammoth.extractRawText({ path: filePath });
  return result.value;
}

async function extractTxtText(filePath: string): Promise<string> {
  return fs.readFileSync(filePath, 'utf8');
}

import fs from 'fs';
import path from 'path';
import pdfParse from 'pdf-parse';
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
  const data = fs.readFileSync(filePath);
  const result = await pdfParse(data);
  return result.text;
}

async function extractDocxText(filePath: string): Promise<string> {
  const result = await mammoth.extractRawText({ path: filePath });
  return result.value;
}

async function extractTxtText(filePath: string): Promise<string> {
  return fs.readFileSync(filePath, 'utf8');
}

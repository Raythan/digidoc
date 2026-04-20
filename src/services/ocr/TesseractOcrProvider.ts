import Tesseract from 'tesseract.js';
import type { OcrProvider, OcrResult } from './types';

function extractInvoiceNumber(text: string): string {
  const patterns = [
    /n[uú]mero\s*(?:da\s+)?(?:nota|nf)[:\s]*(\d[\d./-]*)/i,
    /nota\s*(?:fiscal)?\s*(?:n[°ºo.]?\s*)?[:\s]*(\d[\d./-]*)/i,
    /nf[- ]?e?\s*(?:n[°ºo.]?\s*)?[:\s]*(\d[\d./-]*)/i,
    /n[°ºo.]\s*[:\s]*(\d[\d./-]*)/i,
    /serie\s*[:\s]*\d+\s*[/\-]\s*(\d[\d./-]*)/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1]) {
      return match[1].replace(/[.\-/\s]/g, '').trim();
    }
  }

  const numbers = text.match(/\d{4,}/g);
  if (numbers?.length) {
    return numbers.reduce((a, b) => (a.length >= b.length ? a : b));
  }

  return '';
}

export class TesseractOcrProvider implements OcrProvider {
  readonly name = 'tesseract' as const;

  isAvailable(): boolean {
    return true;
  }

  async extract(imageDataUrl: string): Promise<OcrResult> {
    try {
      const result = await Tesseract.recognize(imageDataUrl, 'por', {
        logger: () => {},
      });

      const fullText = result.data.text;
      const invoiceNumber = extractInvoiceNumber(fullText);

      return {
        source: 'tesseract',
        value: invoiceNumber,
        confidence: result.data.confidence / 100,
      };
    } catch (err) {
      return {
        source: 'tesseract',
        value: '',
        confidence: 0,
        error: err instanceof Error ? err.message : 'Erro desconhecido no Tesseract',
      };
    }
  }
}

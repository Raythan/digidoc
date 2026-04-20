import type { OcrResult } from '../ocr/types';

export interface InvoiceRecord {
  invoiceNumber: string;
  imageDataUrl: string;
  ocrCandidates: OcrResult[];
  selectedSource: 'gemini' | 'tesseract' | 'manual';
  updatedAt: string;
}

const STORAGE_KEY = 'digidoc:invoices';

function readAll(): InvoiceRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeAll(records: InvoiceRecord[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export const InvoiceStorage = {
  getAll(): InvoiceRecord[] {
    return readAll();
  },

  findByNumber(invoiceNumber: string): InvoiceRecord | undefined {
    return readAll().find(
      (r) => r.invoiceNumber.trim() === invoiceNumber.trim(),
    );
  },

  search(query: string): InvoiceRecord[] {
    if (!query.trim()) return readAll();
    const q = query.trim().toLowerCase();
    return readAll().filter((r) =>
      r.invoiceNumber.toLowerCase().includes(q),
    );
  },

  exists(invoiceNumber: string): boolean {
    return !!this.findByNumber(invoiceNumber);
  },

  save(record: InvoiceRecord): void {
    const records = readAll();
    const idx = records.findIndex(
      (r) => r.invoiceNumber.trim() === record.invoiceNumber.trim(),
    );
    if (idx >= 0) {
      records[idx] = { ...record, updatedAt: new Date().toISOString() };
    } else {
      records.push({ ...record, updatedAt: new Date().toISOString() });
    }
    writeAll(records);
  },

  delete(invoiceNumber: string): boolean {
    const records = readAll();
    const filtered = records.filter(
      (r) => r.invoiceNumber.trim() !== invoiceNumber.trim(),
    );
    if (filtered.length === records.length) return false;
    writeAll(filtered);
    return true;
  },
};

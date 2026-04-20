export interface OcrResult {
  source: 'gemini' | 'tesseract';
  value: string;
  confidence?: number;
  error?: string;
}

export interface OcrProvider {
  readonly name: 'gemini' | 'tesseract';
  extract(imageDataUrl: string): Promise<OcrResult>;
  isAvailable(): boolean;
}

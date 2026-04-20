import type { OcrProvider, OcrResult } from './types';
import { GeminiOcrProvider } from './GeminiOcrProvider';
import { TesseractOcrProvider } from './TesseractOcrProvider';

export class OcrOrchestrator {
  private providers: OcrProvider[];

  constructor() {
    this.providers = [new GeminiOcrProvider(), new TesseractOcrProvider()];
  }

  async extractAll(imageDataUrl: string): Promise<OcrResult[]> {
    const tasks = this.providers
      .filter((p) => p.isAvailable())
      .map((p) => p.extract(imageDataUrl));

    const results = await Promise.allSettled(tasks);

    return results
      .map((r) =>
        r.status === 'fulfilled'
          ? r.value
          : {
              source: 'tesseract' as const,
              value: '',
              error: 'Provider falhou inesperadamente',
            },
      )
      .filter((r): r is OcrResult => !!r);
  }
}

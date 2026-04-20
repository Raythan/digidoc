import { GoogleGenerativeAI } from '@google/generative-ai';
import type { OcrProvider, OcrResult } from './types';

const API_KEY_STORAGE = 'digidoc:gemini-api-key';

export function getGeminiApiKey(): string {
  return localStorage.getItem(API_KEY_STORAGE) ?? '';
}

export function setGeminiApiKey(key: string): void {
  localStorage.setItem(API_KEY_STORAGE, key.trim());
}

export class GeminiOcrProvider implements OcrProvider {
  readonly name = 'gemini' as const;

  isAvailable(): boolean {
    return !!getGeminiApiKey();
  }

  async extract(imageDataUrl: string): Promise<OcrResult> {
    const apiKey = getGeminiApiKey();
    if (!apiKey) {
      return {
        source: 'gemini',
        value: '',
        error: 'Chave da API Gemini não configurada',
      };
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

      const base64 = imageDataUrl.split(',')[1];
      const mimeType = imageDataUrl.split(';')[0].split(':')[1] || 'image/png';

      const result = await model.generateContent([
        {
          inlineData: {
            mimeType,
            data: base64,
          },
        },
        {
          text: `Analise esta imagem de um canhoto de nota fiscal brasileira.
Extraia APENAS o número da nota fiscal.
Responda SOMENTE com o número, sem texto adicional, sem explicações.
Se não conseguir identificar o número, responda apenas "NAO_ENCONTRADO".`,
        },
      ]);

      const text = result.response.text().trim();

      if (text === 'NAO_ENCONTRADO' || !text) {
        return {
          source: 'gemini',
          value: '',
          confidence: 0,
        };
      }

      const cleaned = text.replace(/[^0-9]/g, '');

      return {
        source: 'gemini',
        value: cleaned || text,
        confidence: 0.9,
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido';
      return {
        source: 'gemini',
        value: '',
        error: message.includes('API_KEY_INVALID')
          ? 'Chave da API Gemini inválida'
          : message.includes('RATE_LIMIT')
            ? 'Limite de uso da API Gemini atingido'
            : `Erro Gemini: ${message}`,
      };
    }
  }
}

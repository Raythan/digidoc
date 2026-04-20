import { useState, useCallback } from 'react';
import { ImageCapture } from '../components/ImageCapture';
import { OcrResultSelector } from '../components/OcrResultSelector';
import { DuplicateConfirmDialog } from '../components/DuplicateConfirmDialog';
import { GeminiKeyBanner } from '../components/GeminiKeyBanner';
import { OcrOrchestrator } from '../services/ocr/OcrOrchestrator';
import { InvoiceStorage } from '../services/storage/InvoiceStorage';
import type { OcrResult } from '../services/ocr/types';

type Step = 'capture' | 'processing' | 'review' | 'saved';

const orchestrator = new OcrOrchestrator();

export function CaptureSavePage() {
  const [step, setStep] = useState<Step>('capture');
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [ocrResults, setOcrResults] = useState<OcrResult[]>([]);
  const [selectedSource, setSelectedSource] = useState<'gemini' | 'tesseract' | 'manual'>('manual');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleCapture = useCallback(async (dataUrl: string) => {
    setImageDataUrl(dataUrl);
    setStep('processing');
    setOcrResults([]);

    const results = await orchestrator.extractAll(dataUrl);
    setOcrResults(results);

    const best = results.find((r) => r.value && !r.error && r.source === 'gemini')
      || results.find((r) => r.value && !r.error);

    if (best) {
      setInvoiceNumber(best.value);
      setSelectedSource(best.source);
    } else {
      setInvoiceNumber('');
      setSelectedSource('manual');
    }
    setStep('review');
  }, []);

  const handleSelectOcr = (source: 'gemini' | 'tesseract') => {
    const result = ocrResults.find((r) => r.source === source);
    if (result?.value) {
      setInvoiceNumber(result.value);
      setSelectedSource(source);
    }
  };

  const handleSave = () => {
    const trimmed = invoiceNumber.trim();
    if (!trimmed) {
      showToast('Informe o número da nota');
      return;
    }

    if (InvoiceStorage.exists(trimmed)) {
      setShowDuplicateDialog(true);
      return;
    }

    doSave(trimmed);
  };

  const doSave = (number: string) => {
    InvoiceStorage.save({
      invoiceNumber: number,
      imageDataUrl: imageDataUrl!,
      ocrCandidates: ocrResults,
      selectedSource,
      updatedAt: new Date().toISOString(),
    });

    setShowDuplicateDialog(false);
    setStep('saved');
    showToast(`Nota #${number} salva com sucesso!`);
  };

  const reset = () => {
    setStep('capture');
    setImageDataUrl(null);
    setOcrResults([]);
    setInvoiceNumber('');
    setSelectedSource('manual');
  };

  const stepIndex = { capture: 0, processing: 1, review: 2, saved: 3 };
  const currentStep = stepIndex[step];

  return (
    <div>
      {toast && <div className="toast">{toast}</div>}

      <div className="page-header">
        <h1>Capturar canhoto</h1>
        <p>Tire uma foto ou envie um arquivo do canhoto da nota fiscal</p>
      </div>

      <GeminiKeyBanner />

      <div className="steps">
        {['capture', 'processing', 'review', 'saved'].map((s, i) => (
          <div
            key={s}
            className={`step ${i === currentStep ? 'active' : ''} ${i < currentStep ? 'done' : ''}`}
          />
        ))}
      </div>

      {step === 'capture' && (
        <ImageCapture
          onCapture={handleCapture}
          preview={null}
          onClear={() => {}}
        />
      )}

      {step === 'processing' && (
        <div className="card" style={{ textAlign: 'center' }}>
          {imageDataUrl && (
            <img src={imageDataUrl} alt="Processando" className="image-preview" style={{ marginBottom: 16 }} />
          )}
          <div className="spinner" />
          <p className="loading-text">Analisando imagem com OCR...</p>
        </div>
      )}

      {step === 'review' && (
        <div>
          <ImageCapture
            onCapture={handleCapture}
            preview={imageDataUrl}
            onClear={reset}
          />

          <div style={{ marginTop: 16 }}>
            <OcrResultSelector
              results={ocrResults}
              selected={selectedSource === 'manual' ? null : selectedSource}
              onSelect={handleSelectOcr}
            />
          </div>

          <div className="form-group" style={{ marginTop: 16 }}>
            <label className="form-label">Número da nota (edite se necessário)</label>
            <input
              className="form-input"
              type="text"
              inputMode="numeric"
              placeholder="Ex: 123456"
              value={invoiceNumber}
              onChange={(e) => {
                setInvoiceNumber(e.target.value);
                setSelectedSource('manual');
              }}
              autoFocus
            />
          </div>

          <div className="btn-row">
            <button className="btn btn-outline" onClick={reset}>
              Cancelar
            </button>
            <button
              className="btn btn-primary"
              onClick={handleSave}
              disabled={!invoiceNumber.trim()}
            >
              Salvar
            </button>
          </div>
        </div>
      )}

      {step === 'saved' && (
        <div className="card" style={{ textAlign: 'center' }}>
          <svg
            width="64" height="64" viewBox="0 0 24 24" fill="none"
            stroke="var(--success)" strokeWidth="2"
            style={{ margin: '0 auto 16px' }}
          >
            <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
            <polyline points="22,4 12,14.01 9,11.01" />
          </svg>
          <h3 style={{ marginBottom: 8 }}>Nota salva!</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 20 }}>
            Nota <strong>#{invoiceNumber}</strong> foi armazenada com sucesso.
          </p>
          <button className="btn btn-primary" onClick={reset}>
            Capturar outra nota
          </button>
        </div>
      )}

      {showDuplicateDialog && (
        <DuplicateConfirmDialog
          invoiceNumber={invoiceNumber.trim()}
          onConfirm={() => doSave(invoiceNumber.trim())}
          onCancel={() => setShowDuplicateDialog(false)}
        />
      )}
    </div>
  );
}

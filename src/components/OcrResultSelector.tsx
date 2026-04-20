import type { OcrResult } from '../services/ocr/types';

interface Props {
  results: OcrResult[];
  selected: 'gemini' | 'tesseract' | 'manual' | null;
  onSelect: (source: 'gemini' | 'tesseract') => void;
}

export function OcrResultSelector({ results, selected, onSelect }: Props) {
  if (results.length === 0) {
    return (
      <div className="card" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
        <p>Nenhum resultado de OCR disponível</p>
      </div>
    );
  }

  return (
    <div>
      <label className="form-label">Resultados do OCR (toque para selecionar)</label>
      {results.map((r) => (
        <div
          key={r.source}
          className={`ocr-option ${selected === r.source ? 'selected' : ''}`}
          onClick={() => !r.error && r.value && onSelect(r.source)}
          style={r.error || !r.value ? { opacity: 0.6, cursor: 'default' } : {}}
        >
          <span className={`source-badge ${r.source}`}>{r.source}</span>
          {r.error ? (
            <div className="ocr-error">{r.error}</div>
          ) : r.value ? (
            <>
              <div className="ocr-value">{r.value}</div>
              {r.confidence != null && (
                <div className="ocr-confidence">
                  Confiança: {(r.confidence * 100).toFixed(0)}%
                </div>
              )}
            </>
          ) : (
            <div className="ocr-error">Número não detectado</div>
          )}
        </div>
      ))}
    </div>
  );
}

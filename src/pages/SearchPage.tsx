import { useState, useEffect, useCallback } from 'react';
import { InvoiceStorage, type InvoiceRecord } from '../services/storage/InvoiceStorage';

export function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<InvoiceRecord[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const doSearch = useCallback(() => {
    setResults(InvoiceStorage.search(query));
  }, [query]);

  useEffect(() => {
    doSearch();
  }, [doSearch]);

  const formatDate = (iso: string) => {
    try {
      return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date(iso));
    } catch {
      return iso;
    }
  };

  const sourceLabel = (s: string) => {
    switch (s) {
      case 'gemini': return 'Gemini';
      case 'tesseract': return 'Tesseract';
      default: return 'Manual';
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Pesquisar notas</h1>
        <p>Busque pelo número da nota para visualizar o canhoto</p>
      </div>

      <div className="form-group">
        <input
          className="form-input"
          type="search"
          inputMode="numeric"
          placeholder="Digite o número da nota..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {results.length === 0 ? (
        <div className="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <h3>{query ? 'Nenhuma nota encontrada' : 'Nenhuma nota salva'}</h3>
          <p>
            {query
              ? `Não há registros para "${query}"`
              : 'Capture um canhoto para começar'}
          </p>
        </div>
      ) : (
        <div>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12 }}>
            {results.length} registro{results.length !== 1 ? 's' : ''} encontrado{results.length !== 1 ? 's' : ''}
          </p>
          {results.map((r) => (
            <div
              key={r.invoiceNumber}
              className="result-card"
              onClick={() => setSelectedImage(r.imageDataUrl)}
              style={{ cursor: 'pointer' }}
            >
              <img src={r.imageDataUrl} alt={`Nota ${r.invoiceNumber}`} />
              <div className="result-info">
                <div className="invoice-number">#{r.invoiceNumber}</div>
                <div className="result-date">{formatDate(r.updatedAt)}</div>
                <div className="result-source">
                  Fonte: {sourceLabel(r.selectedSource)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedImage && (
        <div className="dialog-overlay" onClick={() => setSelectedImage(null)}>
          <div style={{ maxWidth: '90vw', maxHeight: '90vh' }} onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedImage}
              alt="Canhoto ampliado"
              style={{
                width: '100%',
                maxHeight: '80vh',
                objectFit: 'contain',
                borderRadius: 'var(--radius)',
              }}
            />
            <button
              className="btn btn-outline"
              style={{ marginTop: 12, background: 'white' }}
              onClick={() => setSelectedImage(null)}
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

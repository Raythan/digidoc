import { useState } from 'react';
import { getGeminiApiKey, setGeminiApiKey } from '../services/ocr/GeminiOcrProvider';

export function GeminiKeyBanner() {
  const [key, setKey] = useState(getGeminiApiKey());
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(key);

  const hasKey = !!key;

  const save = () => {
    setGeminiApiKey(draft);
    setKey(draft);
    setEditing(false);
  };

  if (!editing && hasKey) {
    return (
      <div className="settings-bar">
        <span style={{ color: 'var(--success)', fontWeight: 600 }}>Gemini ativo</span>
        <span style={{ flex: 1, color: 'var(--text-secondary)' }}>
          ...{key.slice(-6)}
        </span>
        <button className="btn-outline" style={{ border: '1px solid var(--border)' }} onClick={() => { setDraft(key); setEditing(true); }}>
          Alterar
        </button>
      </div>
    );
  }

  return (
    <div className="settings-bar">
      <input
        type="password"
        placeholder="Cole a chave da API Gemini (opcional)"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && save()}
      />
      <button
        className="btn-primary"
        style={{ padding: '8px 14px', borderRadius: '6px' }}
        onClick={save}
      >
        {hasKey ? 'Salvar' : 'Ativar'}
      </button>
      {editing && (
        <button
          className="btn-outline"
          style={{ padding: '8px 14px', borderRadius: '6px', border: '1px solid var(--border)' }}
          onClick={() => setEditing(false)}
        >
          Cancelar
        </button>
      )}
    </div>
  );
}

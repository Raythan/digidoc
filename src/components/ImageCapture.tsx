import { useRef } from 'react';

interface Props {
  onCapture: (dataUrl: string) => void;
  preview: string | null;
  onClear: () => void;
}

function resizeImage(dataUrl: string, maxWidth = 1200): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxWidth / img.width);
      const canvas = document.createElement('canvas');
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', 0.85));
    };
    img.src = dataUrl;
  });
}

export function ImageCapture({ onCapture, preview, onClear }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const resized = await resizeImage(reader.result as string);
      onCapture(resized);
    };
    reader.readAsDataURL(file);
  };

  if (preview) {
    return (
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <img src={preview} alt="Preview do canhoto" className="image-preview" />
        <div style={{ padding: '12px' }}>
          <button className="btn btn-outline" onClick={onClear}>
            Trocar imagem
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        style={{ display: 'none' }}
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />

      <div
        className="capture-area"
        onClick={() => cameraRef.current?.click()}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
          <circle cx="12" cy="13" r="4" />
        </svg>
        <p><strong>Toque para tirar foto</strong></p>
        <p style={{ fontSize: '12px', marginTop: '4px' }}>Câmera traseira</p>
      </div>

      <div style={{ marginTop: '12px' }}>
        <button
          className="btn btn-outline"
          onClick={() => fileRef.current?.click()}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
            <polyline points="17,8 12,3 7,8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          Enviar arquivo
        </button>
      </div>
    </div>
  );
}

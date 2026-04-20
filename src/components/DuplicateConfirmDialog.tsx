interface Props {
  invoiceNumber: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DuplicateConfirmDialog({ invoiceNumber, onConfirm, onCancel }: Props) {
  return (
    <div className="dialog-overlay" onClick={onCancel}>
      <div className="dialog" onClick={(e) => e.stopPropagation()}>
        <h3>Nota já cadastrada</h3>
        <p>
          Já existe um registro para a nota <strong>#{invoiceNumber}</strong>.
          Deseja substituir a imagem existente?
        </p>
        <div className="dialog-actions">
          <button className="btn btn-outline" onClick={onCancel}>
            Cancelar
          </button>
          <button className="btn btn-danger" onClick={onConfirm}>
            Substituir
          </button>
        </div>
      </div>
    </div>
  );
}

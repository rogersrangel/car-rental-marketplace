import { useState } from 'react';
import { X, Download, Eye } from 'lucide-react';

export function ContractModal({ bookingData, onClose, onSave }) {
  const [signed, setSigned] = useState(false);
  const [pdfDataUrl, setPdfDataUrl] = useState(null);

  const handleSign = () => {
    setSigned(true);
    // Importa o gerador de PDF dinamicamente para evitar carregamento pesado
    import('../utils/pdfGenerator').then(({ generateContractPDF }) => {
      const pdfUrl = generateContractPDF(bookingData);
      setPdfDataUrl(pdfUrl);
    });
  };

  const handleSave = () => {
    if (signed && pdfDataUrl) {
      onSave(pdfDataUrl);
      onClose();
    }
  };

  const handleDownload = () => {
    if (pdfDataUrl) {
      const link = document.createElement('a');
      link.href = pdfDataUrl;
      link.download = `contrato_${bookingData.vehicle_title.replace(/\s/g, '_')}.pdf`;
      link.click();
    }
  };

  const handleView = () => {
    if (pdfDataUrl) {
      window.open(pdfDataUrl, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white">
          <h2 className="text-xl font-bold">Contrato de Locação</h2>
          <button onClick={onClose}><X className="w-5 h-5" /></button>
        </div>

        <div className="p-6 space-y-4">
          {/* Pré‑visualização do PDF (se assinado) */}
          {pdfDataUrl && (
            <div className="border rounded-lg overflow-hidden bg-slate-50">
              <iframe
                src={pdfDataUrl}
                title="Pré-visualização do contrato"
                className="w-full h-96"
                type="application/pdf"
              />
            </div>
          )}

          {/* Dados resumidos */}
          <div className="border p-4 rounded-lg bg-slate-50">
            <p><strong>Locador:</strong> {bookingData.host_name}</p>
            <p><strong>Locatário:</strong> {bookingData.guest_name}</p>
            <p><strong>Veículo:</strong> {bookingData.vehicle_title}</p>
            <p><strong>Período:</strong> {new Date(bookingData.start_date).toLocaleString()} até {new Date(bookingData.end_date).toLocaleString()}</p>
            <p><strong>Valor total:</strong> R$ {bookingData.total_price.toFixed(2)}</p>
          </div>

          {!signed ? (
            <button
              onClick={handleSign}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              Assinar Contrato
            </button>
          ) : (
            <div className="space-y-3">
              <p className="text-green-600 flex items-center gap-2">✓ Contrato assinado digitalmente</p>
              <div className="flex gap-3">
                <button onClick={handleView} className="flex-1 flex items-center justify-center gap-2 bg-blue-100 text-blue-700 py-2 rounded-lg">
                  <Eye className="w-4 h-4" /> Visualizar PDF
                </button>
                <button onClick={handleDownload} className="flex-1 flex items-center justify-center gap-2 bg-green-100 text-green-700 py-2 rounded-lg">
                  <Download className="w-4 h-4" /> Baixar PDF
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t flex justify-end gap-3 sticky bottom-0 bg-white">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg">Cancelar</button>
          <button
            onClick={handleSave}
            disabled={!signed}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
          >
            Salvar Contrato
          </button>
        </div>
      </div>
    </div>
  );
}
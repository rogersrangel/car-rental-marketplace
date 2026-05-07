import { useState } from 'react';
import { X, FileText, Download } from 'lucide-react';
import { generateContractPDF } from '../utils/pdfGenerator';

export function ContractModal({ bookingData, onClose, onSave }) {
  const [signed, setSigned] = useState(false);
  const [pdfDataUrl, setPdfDataUrl] = useState(null);

  const handleSign = () => {
    setSigned(true);
    const pdfUrl = generateContractPDF(bookingData);
    setPdfDataUrl(pdfUrl);
  };

  const handleSave = () => {
    if (signed && pdfDataUrl) {
      onSave(pdfDataUrl);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">Contrato de Locação</h2>
          <button onClick={onClose}><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div className="border p-4 rounded-lg bg-slate-50">
            <p><strong>Locador:</strong> {bookingData.host_name}</p>
            <p><strong>Locatário:</strong> {bookingData.guest_name}</p>
            <p><strong>Veículo:</strong> {bookingData.vehicle_title}</p>
            <p><strong>Período:</strong> {new Date(bookingData.start_date).toLocaleDateString()} até {new Date(bookingData.end_date).toLocaleDateString()}</p>
            <p><strong>Valor total:</strong> R$ {bookingData.total_price.toFixed(2)}</p>
          </div>
          {!signed ? (
            <button onClick={handleSign} className="w-full bg-blue-600 text-white py-2 rounded-lg">Assinar Contrato</button>
          ) : (
            <div className="space-y-3">
              <p className="text-green-600">✓ Contrato assinado digitalmente</p>
              <button onClick={() => window.open(pdfDataUrl)} className="flex items-center gap-2 text-blue-600"><Download className="w-4 h-4" /> Visualizar PDF</button>
            </div>
          )}
        </div>
        <div className="p-4 border-t flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg">Cancelar</button>
          <button onClick={handleSave} disabled={!signed} className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50">Salvar Contrato</button>
        </div>
      </div>
    </div>
  );
}
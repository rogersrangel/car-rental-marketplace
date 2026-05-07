import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export function generateContractPDF(bookingData) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  let y = 20;

  // Título
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('CONTRATO DE LOCAÇÃO DE VEÍCULO', pageWidth / 2, y, { align: 'center' });
  y += 15;

  // Data
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, margin, y);
  y += 15;

  // Cláusulas
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('LOCADOR (PROPRIETÁRIO):', margin, y);
  y += 8;
  doc.setFont('helvetica', 'normal');
  doc.text(bookingData.host_name || '_________________________', margin, y);
  y += 12;

  doc.setFont('helvetica', 'bold');
  doc.text('LOCATÁRIO (HÓSPEDE):', margin, y);
  y += 8;
  doc.setFont('helvetica', 'normal');
  doc.text(bookingData.guest_name || '_________________________', margin, y);
  y += 12;

  doc.setFont('helvetica', 'bold');
  doc.text('VEÍCULO:', margin, y);
  y += 8;
  doc.setFont('helvetica', 'normal');
  doc.text(bookingData.vehicle_title || '_________________________', margin, y);
  y += 12;

  doc.setFont('helvetica', 'bold');
  doc.text('PERÍODO DA LOCAÇÃO:', margin, y);
  y += 8;
  doc.setFont('helvetica', 'normal');
  const start = new Date(bookingData.start_date).toLocaleString('pt-BR');
  const end = new Date(bookingData.end_date).toLocaleString('pt-BR');
  doc.text(`De ${start} até ${end}`, margin, y);
  y += 12;

  doc.setFont('helvetica', 'bold');
  doc.text('VALOR TOTAL:', margin, y);
  y += 8;
  doc.setFont('helvetica', 'normal');
  doc.text(`R$ ${bookingData.total_price.toFixed(2)}`, margin, y);
  y += 20;

  // Assinaturas
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('ASSINATURAS:', margin, y);
  y += 15;
  doc.setFont('helvetica', 'normal');
  doc.text('_________________________', margin, y);
  doc.text('_________________________', pageWidth - margin - 50, y);
  y += 6;
  doc.text('Locador', margin, y);
  doc.text('Locatário', pageWidth - margin - 50, y);
  y += 20;

  // Rodapé
  doc.setFontSize(8);
  doc.text('Documento gerado eletronicamente – válido como prova de aceitação.', pageWidth / 2, y, { align: 'center' });

  // Retorna a URL de dados do PDF
  return doc.output('datauristring');
}
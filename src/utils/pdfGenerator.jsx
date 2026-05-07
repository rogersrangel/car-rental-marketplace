import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export const generateContractPDF = (bookingData) => {
  const doc = new jsPDF();
  
  doc.setFontSize(20);
  doc.text('CONTRATO DE LOCAÇÃO DE VEÍCULO', 105, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, 20, 40);
  
  doc.text('LOCADOR (PROPRIETÁRIO):', 20, 60);
  doc.text(bookingData.host_name || '_________________________', 30, 70);
  
  doc.text('LOCATÁRIO (HÓSPEDE):', 20, 90);
  doc.text(bookingData.guest_name || '_________________________', 30, 100);
  
  doc.text('VEÍCULO:', 20, 120);
  doc.text(`${bookingData.vehicle_title}`, 30, 130);
  
  doc.text('PERÍODO:', 20, 150);
  doc.text(`De ${new Date(bookingData.start_date).toLocaleDateString('pt-BR')} até ${new Date(bookingData.end_date).toLocaleDateString('pt-BR')}`, 30, 160);
  
  doc.text('VALOR TOTAL:', 20, 180);
  doc.text(`R$ ${bookingData.total_price.toFixed(2)}`, 30, 190);
  
  doc.text('ASSINATURAS:', 20, 220);
  doc.text('_________________________', 30, 230);
  doc.text('Locador', 40, 240);
  doc.text('_________________________', 120, 230);
  doc.text('Locatário', 130, 240);
  
  return doc.output('datauristring');
};
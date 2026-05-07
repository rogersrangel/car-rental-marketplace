import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { useBookings } from '../hooks/useBookings';
import { ContractModal } from '../components/ContractModal';
import { ChecklistUpload } from '../components/ChecklistUpload';
import { PaymentProofUpload } from '../components/PaymentProofUpload';
import { ArrowLeft, Car, Bike, MapPin, Fuel, Gauge } from 'lucide-react';
import toast from 'react-hot-toast';

export function VehicleDetail() {
  const { id } = useParams();
  const { user, getUserRole } = useAuth();
  const { createBooking, uploadContract } = useBookings();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startDateTime, setStartDateTime] = useState('');
  const [endDateTime, setEndDateTime] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [showContract, setShowContract] = useState(false);
  const [checklistUrls, setChecklistUrls] = useState([]);
  const [proofUrl, setProofUrl] = useState('');

  useEffect(() => {
    const fetchVehicle = async () => {
      const { data, error } = await supabase.from('vehicles').select('*').eq('id', id).single();
      if (!error) setVehicle(data);
      setLoading(false);
    };
    fetchVehicle();
  }, [id]);

  const calculateTotal = () => {
    if (startDateTime && endDateTime) {
      const start = new Date(startDateTime);
      const end = new Date(endDateTime);
      if (end > start) {
        const diffMs = end - start;
        const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
        if (diffDays > 0) {
          setTotalPrice(diffDays * vehicle.price_per_day);
        } else {
          setTotalPrice(0);
        }
      } else {
        setTotalPrice(0);
      }
    }
  };

  useEffect(() => {
    if (vehicle) calculateTotal();
  }, [startDateTime, endDateTime, vehicle]);

  const handleBooking = async () => {
    if (!user) {
      toast.error('Faça login para reservar');
      return;
    }
    if (!startDateTime || !endDateTime) {
      toast.error('Selecione data e hora de retirada e devolução');
      return;
    }
    if (totalPrice <= 0) {
      toast.error('Período inválido');
      return;
    }
    if (!proofUrl) {
      toast.error('Envie o comprovante de pagamento');
      return;
    }

    const bookingData = {
      vehicle_id: vehicle.id,
      guest_id: user.id,
      host_id: vehicle.owner_id,
      start_date: startDateTime,
      end_date: endDateTime,
      total_price: totalPrice,
      status: 'pending',
      checklist_pre_urls: checklistUrls,
      payment_proof_url: proofUrl,
    };

    const booking = await createBooking(bookingData);
    if (booking) {
      setShowContract(true);
      window.tempBookingId = booking.id;
    }
  };

  const handleContractSave = async (pdfDataUrl) => {
    const fileName = `contract-${Date.now()}.pdf`;
    const { error } = await supabase.storage.from('vehicles').upload(fileName, pdfDataUrl);
    if (error) {
      toast.error('Erro ao salvar contrato');
      return;
    }
    const { data } = supabase.storage.from('vehicles').getPublicUrl(fileName);
    await uploadContract(window.tempBookingId, data.publicUrl);
    toast.success('Reserva concluída!');
  };

  if (loading) return <div className="p-8 text-center">Carregando...</div>;
  if (!vehicle) return <div className="p-8 text-center">Veículo não encontrado.</div>;

  const getFuelText = (fuel) => ({
    gasoline: 'Gasolina', ethanol: 'Etanol', diesel: 'Diesel', electric: 'Elétrico'
  }[fuel] || fuel);

  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <div className="max-w-6xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-600 mb-4"><ArrowLeft className="w-4 h-4" /> Voltar</Link>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Imagem e detalhes */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {vehicle.images?.[0] && <img src={vehicle.images[0]} alt={vehicle.title} className="w-full h-96 object-cover" />}
            <div className="p-6">
              <h1 className="text-2xl font-bold">{vehicle.title}</h1>
              <p className="text-slate-600 mt-2">{vehicle.description}</p>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="flex gap-2"><Car className="w-5 h-5" /> {vehicle.category === 'car' ? 'Carro' : 'Moto'}</div>
                <div className="flex gap-2"><Fuel className="w-5 h-5" /> {getFuelText(vehicle.fuel_type)}</div>
                <div className="flex gap-2"><Gauge className="w-5 h-5" /> {vehicle.transmission === 'automatic' ? 'Automático' : 'Manual'}</div>
                <div className="flex gap-2"><MapPin className="w-5 h-5" /> {vehicle.location_city}/{vehicle.location_state}</div>
              </div>
            </div>
          </div>

          {/* Formulário de reserva */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Reservar veículo</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Data/hora de retirada</label>
                <input type="datetime-local" value={startDateTime} onChange={e => setStartDateTime(e.target.value)} className="w-full border rounded-lg p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium">Data/hora de devolução</label>
                <input type="datetime-local" value={endDateTime} onChange={e => setEndDateTime(e.target.value)} className="w-full border rounded-lg p-2" />
              </div>
              {totalPrice > 0 && (
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="font-bold">Total: R$ {totalPrice.toFixed(2)}</p>
                  <p className="text-sm">Diária: R$ {vehicle.price_per_day}</p>
                </div>
              )}
              <ChecklistUpload onUploadComplete={setChecklistUrls} label="Fotos do estado atual do veículo (opcional)" />
              <PaymentProofUpload onUpload={setProofUrl} />
              <button onClick={handleBooking} className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold">Solicitar Reserva</button>
            </div>
          </div>
        </div>
      </div>

      {showContract && (
        <ContractModal
          bookingData={{
            host_name: 'Proprietário do veículo',
            guest_name: user?.user_metadata?.full_name || user?.email,
            vehicle_title: vehicle.title,
            start_date: startDateTime,
            end_date: endDateTime,
            total_price: totalPrice,
          }}
          onClose={() => setShowContract(false)}
          onSave={handleContractSave}
        />
      )}
    </div>
  );
}
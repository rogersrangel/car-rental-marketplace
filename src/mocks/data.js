export const mockUsers = [
  { id: '1', email: 'guest@example.com', role: 'guest', full_name: 'Convidado', pix_key: '' },
  { id: '2', email: 'host@example.com', role: 'host', full_name: 'Anfitrião', pix_key: 'host@example.com' },
  { id: '3', email: 'admin@example.com', role: 'admin', full_name: 'Admin', pix_key: '' },
];

const updatePixKey = async (newPixKey) => {
  setProfile(prev => ({ ...prev, pix_key: newPixKey }));
  toast.success('Chave Pix simulada atualizada!');
  return true;
};

export const mockVehicles = [
  {
    id: 'v1',
    owner_id: '2',
    title: 'Honda Civic 2022',
    description: 'Carro completo, ar condicionado, câmbio automático, vidros elétricos.',
    category: 'car',
    subcategory: 'Sedan',
    seats: 5,
    fuel_type: 'gasoline',
    transmission: 'automatic',
    price_per_day: 150,
    location_city: 'São Paulo',
    location_state: 'SP',
    images: ['https://placehold.co/600x400/e2e8f0/64748b?text=Honda+Civic'],
    status: 'active',
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'v2',
    owner_id: '2',
    title: 'Yamaha MT-07',
    description: 'Moto 700cc, ágil e econômica, perfeita para a cidade.',
    category: 'motorcycle',
    subcategory: 'Naked',
    seats: 2,
    fuel_type: 'gasoline',
    transmission: 'manual',
    price_per_day: 90,
    location_city: 'Rio de Janeiro',
    location_state: 'RJ',
    images: ['https://placehold.co/600x400/e2e8f0/64748b?text=Yamaha+MT-07'],
    status: 'active',
    created_at: '2026-01-15T00:00:00Z',
  },
  {
    id: 'v3',
    owner_id: '2',
    title: 'Jeep Compass 2023',
    description: 'SUV robusto, ideal para estradas e terrenos irregulares.',
    category: 'car',
    subcategory: 'SUV',
    seats: 5,
    fuel_type: 'diesel',
    transmission: 'automatic',
    price_per_day: 220,
    location_city: 'Belo Horizonte',
    location_state: 'MG',
    images: ['https://placehold.co/600x400/e2e8f0/64748b?text=Jeep+Compass'],
    status: 'active',
    created_at: '2026-02-10T00:00:00Z',
  },
];

export const mockBookings = [
  {
    id: 'b1',
    vehicle_id: 'v1',
    guest_id: '1',
    host_id: '2',
    start_date: '2026-05-10T10:00:00Z',
    end_date: '2026-05-12T10:00:00Z',
    total_price: 300,
    status: 'approved',
    payment_confirmed: false,
    contract_pdf_url: null,
    payment_proof_url: null,
    vehicles: mockVehicles[0],
    host_pix_key: 'host@example.com',
  },
  {
    id: 'b2',
    vehicle_id: 'v2',
    guest_id: '1',
    host_id: '2',
    start_date: '2026-05-15T10:00:00Z',
    end_date: '2026-05-17T10:00:00Z',
    total_price: 180,
    status: 'completed',
    payment_confirmed: true,
    contract_pdf_url: '#',
    payment_proof_url: '#',
    vehicles: mockVehicles[1],
    host_pix_key: 'host@example.com',
  },
];

export const mockReviews = [
  {
    id: 'r1',
    booking_id: 'b2',
    reviewer_id: '1',
    reviewee_id: '2',
    rating: 5,
    comment: 'Excelente experiência, moto em perfeito estado!',
  },
];

// Para o dashboard do anfitrião (estatísticas)
export const mockEarnings = 480; // soma de b1 + b2
export const mockCompletedBookings = 1; // apenas b2
export const mockOccupancyRate = 45.5; // exemplo
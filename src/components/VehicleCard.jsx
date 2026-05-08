export function VehicleCard({ vehicle, onEdit, onDelete }) {
  const mainImage = vehicle.images?.[0] || 'https://placehold.co/400x300/e2e8f0/64748b?text=Sem+imagem';

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <img src={mainImage} alt={vehicle.title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="font-bold text-lg">{vehicle.title}</h3>
        <p className="text-blue-600 font-bold text-xl mt-1">R$ {vehicle.price_per_day}<span className="text-sm">/dia</span></p>
        <div className="flex gap-2 mt-4">
          <button onClick={() => onEdit(vehicle)} className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">Editar</button>
          <button onClick={() => onDelete(vehicle)} className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600">Excluir</button>
        </div>
      </div>
    </div>
  );
}
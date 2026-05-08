export function VehicleCard({ vehicle, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <img src={vehicle.images?.[0] || 'https://placehold.co/400x300'} alt={vehicle.title} className="w-full h-40 object-cover rounded" />
      <h3 className="font-bold mt-2">{vehicle.title}</h3>
      <p className="text-blue-600 font-bold">R$ {vehicle.price_per_day}/dia</p>
      <div className="flex gap-2 mt-3">
        <button onClick={() => onEdit(vehicle)} className="bg-blue-500 text-white px-3 py-1 rounded">Editar</button>
        <button onClick={() => onDelete(vehicle)} className="bg-red-500 text-white px-3 py-1 rounded">Excluir</button>
      </div>
    </div>
  );
}
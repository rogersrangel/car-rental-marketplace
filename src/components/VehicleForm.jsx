import { useState } from 'react';

export function VehicleForm({ initialData, onSubmit, onCancel }) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [price, setPrice] = useState(initialData?.price_per_day || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, price_per_day: parseFloat(price) });
  };

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-bold mb-4">{initialData ? 'Editar' : 'Novo'} Veículo</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="Título" value={title} onChange={e => setTitle(e.target.value)} className="w-full border rounded p-2" required />
        <input type="number" placeholder="Preço por dia" value={price} onChange={e => setPrice(e.target.value)} className="w-full border rounded p-2" required />
        <div className="flex gap-2">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Salvar</button>
          <button type="button" onClick={onCancel} className="border border-slate-300 px-4 py-2 rounded">Cancelar</button>
        </div>
      </form>
    </div>
  );
}
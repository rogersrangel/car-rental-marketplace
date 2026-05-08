import { useState } from 'react';

export function VehicleForm({ initialData, onSubmit, onCancel }) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [price, setPrice] = useState(initialData?.price_per_day || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      title,
      price_per_day: parseFloat(price),
      // outros campos podem ser adicionados depois
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4">{initialData ? 'Editar Veículo' : 'Novo Veículo'}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Título"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="w-full border rounded-lg p-2"
          required
        />
        <input
          type="number"
          placeholder="Preço por dia"
          value={price}
          onChange={e => setPrice(e.target.value)}
          className="w-full border rounded-lg p-2"
          required
        />
        <div className="flex gap-3 pt-4">
          <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-lg">Salvar</button>
          <button type="button" onClick={onCancel} className="flex-1 border border-slate-300 py-2 rounded-lg">Cancelar</button>
        </div>
      </form>
    </div>
  );
}
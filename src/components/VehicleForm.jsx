import { useState } from 'react';

export function VehicleForm({ initialData, onSubmit, onCancel }) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [price, setPrice] = useState(initialData?.price_per_day || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, price_per_day: parseFloat(price) });
  };

  return (
    <div className="bg-slate-800/90 backdrop-blur-md rounded-2xl shadow-2xl p-6 border border-white/10">
      <h2 className="text-2xl font-bold text-white mb-4">{initialData ? 'Editar Veículo' : 'Novo Veículo'}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Título"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="w-full bg-slate-800/50 border border-white/20 rounded-xl p-2 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="number"
          placeholder="Preço por dia"
          value={price}
          onChange={e => setPrice(e.target.value)}
          className="w-full bg-slate-800/50 border border-white/20 rounded-xl p-2 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500"
          required
        />
        <div className="flex gap-3 pt-4">
          <button type="submit" className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 rounded-xl hover:from-blue-700 hover:to-blue-800">Salvar</button>
          <button type="button" onClick={onCancel} className="flex-1 border border-white/20 bg-slate-800 text-white py-2 rounded-xl hover:bg-slate-700">Cancelar</button>
        </div>
      </form>
    </div>
  );
}
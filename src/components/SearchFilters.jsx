import { useState } from 'react';
import { X, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function SearchFilters({ filters, onApply }) {
  const [isOpen, setIsOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);

  const categories = [
    { value: 'all', label: 'Todos' },
    { value: 'car', label: 'Carros' },
    { value: 'motorcycle', label: 'Motos' },
  ];

  const fuelTypes = [
    { value: 'all', label: 'Todos' },
    { value: 'gasoline', label: 'Gasolina' },
    { value: 'ethanol', label: 'Etanol' },
    { value: 'diesel', label: 'Diesel' },
    { value: 'electric', label: 'Elétrico' },
  ];

  const transmissions = [
    { value: 'all', label: 'Todos' },
    { value: 'manual', label: 'Manual' },
    { value: 'automatic', label: 'Automático' },
  ];

  const handleChange = (key, value) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    onApply(localFilters);
    setIsOpen(false);
  };

  const handleReset = () => {
    const resetFilters = {
      search: '',
      category: 'all',
      city: '',
      fuel_type: 'all',
      transmission: 'all',
      min_price: '',
      max_price: '',
      seats: '',
      orderBy: 'created_at',
      orderDir: 'desc',
    };
    setLocalFilters(resetFilters);
    onApply(resetFilters);
    setIsOpen(false);
  };

  // Verifica se há filtros ativos para mostrar o pontinho indicador
  const hasActiveFilters = Object.keys(filters).some(
    k => filters[k] && filters[k] !== 'all' && filters[k] !== '' && k !== 'orderBy' && k !== 'orderDir'
  );

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 transition-colors"
      >
        <SlidersHorizontal className="w-4 h-4" />
        Filtros
        {hasActiveFilters && (
          <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-xl p-6 overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-800">Filtros</h2>
                <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-slate-100 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-5">
                {/* Busca por texto */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Buscar por nome</label>
                  <input
                    type="text"
                    value={localFilters.search || ''}
                    onChange={e => handleChange('search', e.target.value)}
                    placeholder="Ex: Civic, Corolla..."
                    className="w-full border border-slate-300 rounded-lg p-2"
                  />
                </div>

                {/* Categoria */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Categoria</label>
                  <select
                    value={localFilters.category}
                    onChange={e => handleChange('category', e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2"
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                {/* Localização */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Cidade</label>
                  <input
                    type="text"
                    value={localFilters.city || ''}
                    onChange={e => handleChange('city', e.target.value)}
                    placeholder="São Paulo, Rio de Janeiro..."
                    className="w-full border border-slate-300 rounded-lg p-2"
                  />
                </div>

                {/* Preço mínimo / máximo */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Preço mín. (R$)</label>
                    <input
                      type="number"
                      value={localFilters.min_price || ''}
                      onChange={e => handleChange('min_price', e.target.value)}
                      placeholder="0"
                      className="w-full border border-slate-300 rounded-lg p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Preço máx. (R$)</label>
                    <input
                      type="number"
                      value={localFilters.max_price || ''}
                      onChange={e => handleChange('max_price', e.target.value)}
                      placeholder="1000"
                      className="w-full border border-slate-300 rounded-lg p-2"
                    />
                  </div>
                </div>

                {/* Combustível */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Combustível</label>
                  <select
                    value={localFilters.fuel_type}
                    onChange={e => handleChange('fuel_type', e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2"
                  >
                    {fuelTypes.map(ft => (
                      <option key={ft.value} value={ft.value}>{ft.label}</option>
                    ))}
                  </select>
                </div>

                {/* Câmbio */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Câmbio</label>
                  <select
                    value={localFilters.transmission}
                    onChange={e => handleChange('transmission', e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2"
                  >
                    {transmissions.map(trans => (
                      <option key={trans.value} value={trans.value}>{trans.label}</option>
                    ))}
                  </select>
                </div>

                {/* Número de assentos */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Assentos (mínimo)</label>
                  <input
                    type="number"
                    value={localFilters.seats || ''}
                    onChange={e => handleChange('seats', e.target.value)}
                    placeholder="2, 4, 5..."
                    className="w-full border border-slate-300 rounded-lg p-2"
                  />
                </div>

                {/* Ordenação */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Ordenar por</label>
                    <select
                      value={localFilters.orderBy}
                      onChange={e => handleChange('orderBy', e.target.value)}
                      className="w-full border border-slate-300 rounded-lg p-2"
                    >
                      <option value="created_at">Mais recentes</option>
                      <option value="price_per_day">Preço</option>
                      <option value="title">Nome</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Ordem</label>
                    <select
                      value={localFilters.orderDir}
                      onChange={e => handleChange('orderDir', e.target.value)}
                      className="w-full border border-slate-300 rounded-lg p-2"
                    >
                      <option value="desc">Decrescente</option>
                      <option value="asc">Crescente</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleReset}
                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50"
                  >
                    Limpar filtros
                  </button>
                  <button
                    onClick={handleApply}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Aplicar
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
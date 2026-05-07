import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ImageUpload } from './ImageUpload';
import { validateVehicle } from '../utils/vehicleValidation';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';

export function VehicleForm({ initialData = null, onSubmit, onCancel }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'car',
    subcategory: '',
    seats: 4,
    fuel_type: 'gasoline',
    transmission: 'manual',
    price_per_day: '',
    location_city: '',
    location_state: '',
    images: [],
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        category: initialData.category || 'car',
        subcategory: initialData.subcategory || '',
        seats: initialData.seats || 4,
        fuel_type: initialData.fuel_type || 'gasoline',
        transmission: initialData.transmission || 'manual',
        price_per_day: initialData.price_per_day || '',
        location_city: initialData.location_city || '',
        location_state: initialData.location_state || '',
        images: initialData.images || [],
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleImagesChange = (urls) => {
    setFormData((prev) => ({ ...prev, images: urls }));
    if (errors.images) setErrors((prev) => ({ ...prev, images: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...formData,
      price_per_day: parseFloat(formData.price_per_day),
      owner_id: user.id,
    };

    const result = validateVehicle(payload);
    if (!result.success) {
      const fieldErrors = {};
      result.error.errors.forEach((err) => {
        fieldErrors[err.path[0]] = err.message;
      });
      setErrors(fieldErrors);
      setLoading(false);
      toast.error('Corrija os erros do formulário');
      return;
    }

    await onSubmit(payload);
    setLoading(false);
  };

  const categories = [
    { value: 'car', label: 'Carro' },
    { value: 'motorcycle', label: 'Moto' },
  ];

  const fuelTypes = [
    { value: 'gasoline', label: 'Gasolina' },
    { value: 'ethanol', label: 'Etanol' },
    { value: 'diesel', label: 'Diesel' },
    { value: 'electric', label: 'Elétrico' },
  ];

  const transmissionTypes = [
    { value: 'manual', label: 'Manual' },
    { value: 'automatic', label: 'Automático' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200">
      <div className="flex justify-between items-center p-6 border-b border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800">
          {initialData ? 'Editar Veículo' : 'Novo Veículo'}
        </h2>
        <button
          onClick={onCancel}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-slate-500" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        {/* Título */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Título do veículo *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Ex: Honda Civic LX 2022"
            className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
        </div>

        {/* Descrição */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Descrição
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            placeholder="Descreva as características do veículo..."
            className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Linha: Categoria + Subcategoria */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Tipo *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-lg p-2"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
            {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Subcategoria *
            </label>
            <input
              type="text"
              name="subcategory"
              value={formData.subcategory}
              onChange={handleChange}
              placeholder="Ex: SUV, Sedan, Hatch, Sport"
              className="w-full border border-slate-300 rounded-lg p-2"
            />
            {errors.subcategory && <p className="text-red-500 text-sm mt-1">{errors.subcategory}</p>}
          </div>
        </div>

        {/* Linha: Preço + Assentos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Preço por dia (R$) *
            </label>
            <input
              type="number"
              step="0.01"
              name="price_per_day"
              value={formData.price_per_day}
              onChange={handleChange}
              placeholder="0,00"
              className="w-full border border-slate-300 rounded-lg p-2"
            />
            {errors.price_per_day && <p className="text-red-500 text-sm mt-1">{errors.price_per_day}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Número de assentos
            </label>
            <input
              type="number"
              name="seats"
              value={formData.seats}
              onChange={handleChange}
              min="1"
              max="15"
              className="w-full border border-slate-300 rounded-lg p-2"
            />
          </div>
        </div>

        {/* Linha: Combustível + Câmbio */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Combustível *
            </label>
            <select
              name="fuel_type"
              value={formData.fuel_type}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-lg p-2"
            >
              {fuelTypes.map((fuel) => (
                <option key={fuel.value} value={fuel.value}>
                  {fuel.label}
                </option>
              ))}
            </select>
            {errors.fuel_type && <p className="text-red-500 text-sm mt-1">{errors.fuel_type}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Câmbio *
            </label>
            <select
              name="transmission"
              value={formData.transmission}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-lg p-2"
            >
              {transmissionTypes.map((trans) => (
                <option key={trans.value} value={trans.value}>
                  {trans.label}
                </option>
              ))}
            </select>
            {errors.transmission && <p className="text-red-500 text-sm mt-1">{errors.transmission}</p>}
          </div>
        </div>

        {/* Linha: Cidade + UF */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Cidade *
            </label>
            <input
              type="text"
              name="location_city"
              value={formData.location_city}
              onChange={handleChange}
              placeholder="Ex: São Paulo"
              className="w-full border border-slate-300 rounded-lg p-2"
            />
            {errors.location_city && <p className="text-red-500 text-sm mt-1">{errors.location_city}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              UF *
            </label>
            <input
              type="text"
              name="location_state"
              value={formData.location_state}
              onChange={handleChange}
              placeholder="SP"
              maxLength={2}
              className="w-full border border-slate-300 rounded-lg p-2 uppercase"
            />
            {errors.location_state && <p className="text-red-500 text-sm mt-1">{errors.location_state}</p>}
          </div>
        </div>

        {/* Upload de Imagens */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Fotos do veículo *
          </label>
          <ImageUpload
            images={formData.images}
            onImagesChange={handleImagesChange}
            bucket="vehicles"
          />
          {errors.images && <p className="text-red-500 text-sm mt-1">{errors.images}</p>}
        </div>

        {/* Botões */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Salvando...' : initialData ? 'Atualizar' : 'Cadastrar'}
          </button>
        </div>
      </form>
    </div>
  );
}
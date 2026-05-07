import { z } from 'zod';

export const vehicleSchema = z.object({
  title: z.string()
    .min(3, 'Título deve ter pelo menos 3 caracteres')
    .max(100, 'Título muito longo'),
  description: z.string()
    .max(500, 'Descrição muito longa')
    .optional(),
  category: z.enum(['car', 'motorcycle'], {
    required_error: 'Selecione o tipo do veículo',
  }),
  subcategory: z.string()
    .min(2, 'Subcategoria é obrigatória'),
  seats: z.number()
    .int()
    .min(1, 'Mínimo 1 assento')
    .max(15, 'Máximo 15 assentos')
    .optional(),
  fuel_type: z.enum(['gasoline', 'ethanol', 'diesel', 'electric'], {
    required_error: 'Selecione o combustível',
  }),
  transmission: z.enum(['manual', 'automatic'], {
    required_error: 'Selecione o câmbio',
  }),
  price_per_day: z.number()
    .positive('Preço deve ser maior que zero')
    .max(99999, 'Preço muito alto'),
  location_city: z.string()
    .min(2, 'Cidade obrigatória'),
  location_state: z.string()
    .length(2, 'UF deve ter 2 caracteres')
    .toUpperCase(),
  images: z.array(z.string().url())
    .min(1, 'Pelo menos uma foto é obrigatória'),
});

export const validateVehicle = (data) => {
  return vehicleSchema.safeParse(data);
};
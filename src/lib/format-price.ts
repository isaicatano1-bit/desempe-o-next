export function formatPrice(value: number | string): string {
  const numericValue = typeof value === 'string' ? Number(value) : value;

  if (!Number.isFinite(numericValue)) {
    return '0 €';
  }

  const rounded = Number(numericValue.toFixed(2));
  const formatter = new Intl.NumberFormat('es-ES', {
    minimumFractionDigits: Number.isInteger(rounded) ? 0 : 2,
    maximumFractionDigits: 2,
  });

  return `${formatter.format(rounded)} €`;
}

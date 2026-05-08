export function Button({ children, variant = 'primary', className = '', ...props }) {
  const base = 'font-semibold py-2.5 px-5 rounded-xl transition-all duration-200';
  const variants = {
    primary: 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-md hover:shadow-lg',
    outline: 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50',
    ghost: 'text-slate-600 hover:bg-slate-100',
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
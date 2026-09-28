
export default function Button({ children, variant = 'primary', className = '',formAction = false, ...props }) {
  const base = 'px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50';
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-dark',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    process: 'bg-amber-500 text-white hover:bg-amber-600'
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} type={formAction ? 'submit' : 'button'} {...props} >
      {children}
      
    </button>

  );
}

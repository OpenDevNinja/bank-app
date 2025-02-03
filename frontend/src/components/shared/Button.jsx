// src/components/shared/Button.jsx
const Button = ({ 
    children, 
    variant = 'primary', 
    size = 'md', 
    disabled = false, 
    type = 'button',
    onClick,
    className = ''
  }) => {
    const baseClasses = "font-medium rounded-lg focus:ring-4 focus:outline-none";
    
    const variants = {
      primary: "bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-300 dark:focus:ring-primary-800",
      secondary: "bg-gray-500 text-white hover:bg-gray-600 focus:ring-gray-300 dark:focus:ring-gray-700",
      danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-300 dark:focus:ring-red-800"
    };
  
    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-5 py-2.5 text-sm",
      lg: "px-6 py-3 text-base"
    };
  
    return (
      <button
        type={type}
        disabled={disabled}
        onClick={onClick}
        className={`
          ${baseClasses}
          ${variants[variant]}
          ${sizes[size]}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${className}
        `}
      >
        {children}
      </button>
    );
  };
  export default Button;
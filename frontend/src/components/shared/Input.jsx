
  // src/components/shared/Input.jsx
  const Input = ({
    label,
    type = 'text',
    id,
    value,
    onChange,
    error,
    placeholder,
    required = false,
    className = ''
  }) => {
    return (
      <div className="mb-4">
        {label && (
          <label 
            htmlFor={id} 
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <input
          type={type}
          id={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`
            bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
            focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 
            dark:bg-dark-card dark:border-dark-border dark:text-white
            ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}
            ${className}
          `}
        />
        {error && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-500">
            {error}
          </p>
        )}
      </div>
    );
  };
  export default Input;
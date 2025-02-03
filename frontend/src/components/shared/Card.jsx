// src/components/shared/Card.jsx
const Card = ({ 
    title, 
    children, 
    className = '',
    headerAction
  }) => {
    return (
      <div className={`
        bg-white dark:bg-dark-card 
        border border-gray-200 dark:border-dark-border 
        rounded-lg shadow-sm 
        ${className}
      `}>
        {title && (
          <div className="border-b border-gray-200 dark:border-dark-border px-4 py-3 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {title}
            </h3>
            {headerAction}
          </div>
        )}
        <div className="p-4">
          {children}
        </div>
      </div>
    );
  };
export default Card;
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export const TransactionTable = ({ transactions }) => {
  const formatCurrency = (amount) => {
    // Conversion du montant en nombre si c'est une chaîne
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    
    if (isNaN(numAmount)) return '0,00 €';
    
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(numAmount);
  };

  const getTransactionTypeStyle = (type) => {
    return type === 'depot'
      ? 'text-green-600 bg-green-100'
      : 'text-red-600 bg-red-100';
  };

  const getTransactionTypeLabel = (type) => {
    switch (type) {
      case 'depot':
        return 'Dépôt';
      case 'retrait':
        return 'Retrait';
      default:
        return type;
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b dark:text-white">
            <th className="px-4 py-2 text-left">Date</th>
            <th className="px-4 py-2 text-left">Type</th>
            <th className="px-4 py-2 text-left">Montant</th>
            <th className="px-4 py-2 text-left">N° de compte</th>
            <th className="px-4 py-2 text-left">Titulaire</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id} className="border-b ">
              <td className="px-4 py-2 dark:text-white">
                {format(new Date(transaction.createdAt), 'dd MMMM yyyy', { locale: fr })}
              </td>
              <td className="px-4 py-2 ">
                <span className={`px-2 py-1 rounded text-xs ${getTransactionTypeStyle(transaction.type)}`}>
                  {getTransactionTypeLabel(transaction.type)}
                </span>
              </td>
              <td className="px-4 py-2">
                <span className={transaction.type === 'depot' ? 'text-green-600' : 'text-red-600'}>
                  {formatCurrency(transaction.amount)}
                </span>
              </td>
              <td className="px-4 py-2 dark:text-white">{transaction.account?.accountNumber}</td>
              <td className="px-4 py-2 dark:text-white">
                {transaction.account 
                  ? `${transaction.account.firstName} ${transaction.account.lastName}` 
                  : ''}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;
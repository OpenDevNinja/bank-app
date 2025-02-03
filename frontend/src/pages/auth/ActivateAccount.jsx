import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Input from '../../components/shared/Input';
import Button from '../../components/shared/Button';
import { useAuth } from '../../hooks/useAuth';

const ActivateAccount = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { activate, resendActivationCode } = useAuth();
  const email = new URLSearchParams(location.search).get('email');
  const [activationCode, setActivationCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      await activate({ 
        email, 
        activationCode 
      });
      setSuccessMessage('Compte activé avec succès !');
      // Rediriger vers la page de connexion après un court délai
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setError('');
    setSuccessMessage('');
    setResendLoading(true);

    try {
      await resendActivationCode(email);
      setSuccessMessage('Un nouveau code d\'activation vous a été envoyé');
    } catch (err) {
      setError(err.message);
    } finally {
      setResendLoading(false);
    }
  };

  if (!email) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-dark-bg flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Erreur: Email manquant. Veuillez recommencer l'inscription.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-dark-bg flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-dark-card p-8 rounded-lg shadow">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Activer votre compte
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Un code d'activation a été envoyé à {email}
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          {successMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              {successMessage}
            </div>
          )}
          <Input
            label="Code d'activation"
            type="text"
            required
            value={activationCode}
            onChange={(e) => setActivationCode(e.target.value)}
            maxLength={6}
            placeholder="Entrez le code à 6 chiffres"
          />
          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={loading || activationCode.length !== 6}
          >
            {loading ? 'Activation en cours...' : 'Activer le compte'}
          </Button>
          <div className="text-center">
            <button
              type="button"
              className="text-primary-600 hover:text-primary-500 disabled:opacity-50"
              onClick={handleResendCode}
              disabled={resendLoading}
            >
              {resendLoading ? 'Envoi en cours...' : 'Renvoyer le code'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ActivateAccount;
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/shared/Input';
import Button from '../../components/shared/Button';
import { useAuth } from '../../hooks/useAuth';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Règles de validation
  const validationRules = {
    email: {
      pattern: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      message: "L'adresse email n'est pas valide"
    },
    password: {
      minLength: 8,
      patterns: [
        { pattern: /[A-Z]/, message: 'Au moins une lettre majuscule' },
        { pattern: /[a-z]/, message: 'Au moins une lettre minuscule' },
        { pattern: /[0-9]/, message: 'Au moins un chiffre' },
        { pattern: /[!@#$%^&*(),.?":{}|<>]/, message: 'Au moins un caractère spécial' }
      ]
    },
    username: {
      pattern: /^[a-zA-Z0-9_-]{3,20}$/,
      message: "Le nom d'utilisateur doit contenir entre 3 et 20 caractères alphanumériques"
    }
  };

  // Validation en temps réel
  useEffect(() => {
    validateField('password', formData.password);
  }, [formData.password]);

  useEffect(() => {
    validateField('email', formData.email);
  }, [formData.email]);

  useEffect(() => {
    validateField('username', formData.username);
  }, [formData.username]);

  const validateField = (field, value) => {
    const newErrors = { ...errors };

    switch (field) {
      case 'email':
        if (!validationRules.email.pattern.test(value)) {
          newErrors.email = validationRules.email.message;
        } else {
          delete newErrors.email;
        }
        break;

      case 'password':
        const passwordErrors = [];
        if (value.length < validationRules.password.minLength) {
          passwordErrors.push(`Au moins ${validationRules.password.minLength} caractères`);
        }
        validationRules.password.patterns.forEach(({ pattern, message }) => {
          if (!pattern.test(value)) {
            passwordErrors.push(message);
          }
        });
        if (passwordErrors.length > 0) {
          newErrors.password = passwordErrors;
        } else {
          delete newErrors.password;
        }
        break;

      case 'username':
        if (!validationRules.username.pattern.test(value)) {
          newErrors.username = validationRules.username.message;
        } else {
          delete newErrors.username;
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Validation complete
    const isEmailValid = validateField('email', formData.email);
    const isPasswordValid = validateField('password', formData.password);
    const isUsernameValid = validateField('username', formData.username);

    if (formData.password !== formData.confirmPassword) {
      setErrors(prev => ({
        ...prev,
        confirmPassword: 'Les mots de passe ne correspondent pas'
      }));
      return;
    }

    if (!isEmailValid || !isPasswordValid || !isUsernameValid) {
      return;
    }

    setLoading(true);

    try {
      await register({
        email: formData.email,
        password: formData.password,
        username: formData.username
      });
      navigate(`/activate?email=${encodeURIComponent(formData.email)}`);
    } catch (err) {
      setErrors(prev => ({
        ...prev,
        submit: err.message
      }));
    } finally {
      setLoading(false);
    }
  };


  // Helper pour afficher les erreurs de mot de passe
  const renderPasswordErrors = () => {
    if (!errors.password) return null;
    return (
      <ul className="text-sm text-red-600 mt-1 list-disc list-inside">
        {Array.isArray(errors.password) && errors.password.map((error, index) => (
          <li key={index}>{error}</li>
        ))}
      </ul>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-dark-bg flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-dark-card p-8 rounded-lg shadow">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Créer un compte
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {errors.submit && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {errors.submit}
            </div>
          )}

          <Input
            label="Nom d'utilisateur"
            name="username"
            type="text"
            required
            value={formData.username}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              username: e.target.value
            }))}
            error={errors.username}
          />
          
          <Input
            label="Email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              email: e.target.value
            }))}
            error={errors.email}
          />
          
          <div>
            <Input
              label="Mot de passe"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                password: e.target.value
              }))}
              error={errors.password && 'Mot de passe invalide'}
            />
            {renderPasswordErrors()}
          </div>
          
          <Input
            label="Confirmer le mot de passe"
            name="confirmPassword"
            type="password"
            required
            value={formData.confirmPassword}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              confirmPassword: e.target.value
            }))}
            error={errors.confirmPassword}
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={loading || Object.keys(errors).length > 0}
          >
            {loading ? 'Inscription en cours...' : 'S\'inscrire'}
          </Button>

          <div className="text-center">
            <a
              href="/login"
              className="text-primary-600 hover:text-primary-500"
            >
              Déjà inscrit ? Se connecter
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
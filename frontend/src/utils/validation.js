// utils/validation.js
export const validationRules = {
    email: {
      pattern: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      message: "L'adresse email n'est pas valide"
    },
    password: {
      minLength: 8,
      patterns: [
        {
          pattern: /[A-Z]/,
          message: 'Au moins une lettre majuscule'
        },
        {
          pattern: /[a-z]/,
          message: 'Au moins une lettre minuscule'
        },
        {
          pattern: /[0-9]/,
          message: 'Au moins un chiffre'
        },
        {
          pattern: /[!@#$%^&*(),.?":{}|<>]/,
          message: 'Au moins un caractère spécial'
        }
      ]
    },
    username: {
      pattern: /^[a-zA-Z0-9_-]{3,20}$/,
      message: "Le nom d'utilisateur doit contenir entre 3 et 20 caractères alphanumériques"
    }
  }
  
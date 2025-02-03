// src/layouts/Footer.jsx
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-dark-card border-t border-gray-200 dark:border-dark-border">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} BankApp. Tous droits réservés.
          </p>
          <div className="flex space-x-6">
            <a
              href="#"
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
            >
              Confidentialité
            </a>
            <a
              href="#"
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
            >
              Conditions
            </a>
            <a
              href="#"
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
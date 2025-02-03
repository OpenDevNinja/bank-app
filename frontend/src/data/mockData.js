// src/data/mockData.js
export const users = [
    {
      id: "1",
      email: "admin@banque.com",
      password: "$2a$10$xxxxxxxxxxx", // "admin123" hashé
      role: "admin",
      isActivated: true,
      activationCode: null,
      lastLogout: null
    },
    {
      id: "2",
      email: "client1@example.com",
      password: "$2a$10$xxxxxxxxxxx", // "client123" hashé
      role: "client",
      isActivated: true,
      activationCode: null,
      lastLogout: null
    }
  ];
  
  export const accounts = [
    {
      id: "1",
      accountNumber: "FR7630001007941234567890185",
      firstName: "Jean",
      lastName: "Dupont",
      status: "actif",
      balance: 1500.00,
      userId: "2"
    },
    {
      id: "2",
      accountNumber: "FR7630001007941234567890186",
      firstName: "Marie",
      lastName: "Martin",
      status: "actif",
      balance: 2500.00,
      userId: "2"
    }
  ];
  
  export const transactions = [
    {
      id: "1",
      type: "depot",
      amount: 1000.00,
      accountId: "1",
      createdAt: "2024-01-15T10:30:00Z"
    },
    {
      id: "2",
      type: "retrait",
      amount: 500.00,
      accountId: "1",
      createdAt: "2024-01-16T14:20:00Z"
    }
  ];
  
  export const generateActivationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };
  
  export const findUserByEmail = (email) => {
    return users.find(user => user.email === email);
  };
  
  export const findAccountsByUserId = (userId) => {
    return accounts.filter(account => account.userId === userId);
  };
  
  export const findTransactionsByAccountId = (accountId) => {
    return transactions.filter(transaction => transaction.accountId === accountId);
  };
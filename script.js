// Une base clients
const client = [
  { idClient: "1", prenom: "Jean" },
  { idClient: "2", prenom: "Sophie" },
  { idClient: "3", prenom: "Paul" },
];
console.log(client);

// Une base de comptes bancaires
const comptes = [
  { idCompte: "1", idClient: client[0].idClient, solde: 1500 },
  { idCompte: "2", idClient: client[1].idClient, solde: 5000 },
  { idCompte: "3", idClient: client[2].idClient, solde: 2500 },
];
console.log(comptes);

// Une base d'historique des transactions
const historyOfTransactions = [];
console.log(historyOfTransactions);

// Possibilité de créer un nouveau client
function addNewClient(prenom) {
  let newIdClient = crypto.randomUUID();
  client.push({ idClient: newIdClient, prenom: prenom });
  return { client: client[client.length - 1] };
}
console.log(addNewClient("antoine"));


// Possibilité de créer un nouveau compte bancaire pour un client
function addNewCompte(idClient, solde) {
  let newIdCompte = crypto.randomUUID();
  comptes.push({
    idCompte: newIdCompte,
    idClient: idClient,
    solde: solde,
  });
  return { compte: comptes[comptes.length - 1] };
}
console.log(addNewCompte("6261f1e6-dd1d-40f5-858e-e8eda65deabc", 50));

// Possibilité de supprimer un compte bancaire (seulement si le solde est à 0)
function deleteCompte(idCompte) {
  let indexCompte = comptes.findIndex((compte) => compte.idCompte === idCompte);
  try {
    if (indexCompte === -1 && idCompte[indexCompte].solde === 0) {
      let deletedCompte = idCompte.splice(indexCompte, 1);
      return { message: "Compte supprimé", compte: deletedCompte};
    } else {
      return { message: "Compte non trouvé ou solde non nul" };
    }
  } catch (error) {
    return { message: "Une erreur est survenue", error: error.message };
  }
}
console.log(deleteCompte("1"));

// Possibilité de déposer de l'argent sur le compte d'un client
function depositeCash(idCompte, amount) {
  let account = comptes.find((compte) => compte.idCompte === idCompte);
  try {
    if (account) {
      account.solde += amount;
      let transactionId = crypto.randomUUID();
      historyOfTransactions.push({
        idTransaction: transactionId,
        idCompte: idAccountFrom,
        type: "deposite",
        amount,
        date: new Date(),
      });
      return { message: "Dépôt effectué", compte: account };
    } else {
      return { message: "Compte non trouvé" };
    }
  } catch (error) {
    return { message: "Une erreur est survenue", error: error.message };
  }
}
console.log(depositeCash("1", 50));

// Possibilité de retirer de l'argent du compte d'un client
function withdrawCash(idCompte, amount) {
  let account = comptes.find((compte) => compte.idCompte === idCompte);
  try {
    if (account) {
      if (account.solde >= amount) {
        account.solde -= amount;
        let transactionId = crypto.randomUUID();
        historyOfTransactions.push({
          idTransaction: transactionId,
          idCompte: idAccountFrom,
          type: "withdraw",
          amount,
          date: new Date(),
        });
        return { message: "Retrait effectué", compte: account };
      } else {
        return { message: "Fonds insuffisants" };
      }
    } else {
      return { message: "Compte non trouvé" };
    }
  } catch (error) {
    return { message: "Une erreur est survenue", error: error.message };
  }
}

console.log(withdrawCash("1", 50));

// Possibilité de transférer de l'argent entre deux comptes
function transfertCash(idAccountFrom, idAccountTo, amount) {
  let accountFrom = comptes.find((ompte) => ompte.idCompte === idAccountFrom);
  let accountTo = comptes.find((compte) => compte.idCompte === idAccountTo);
  try {
    if (!accountFrom || !accountTo) {
      return { message: "Un ou les deux comptes n'ont pas été trouvés" };
    }
    if (accountFrom.solde < amount) {
      return { message: "Fonds insuffisants pour le transfert" };
    }

    accountFrom.solde -= amount;
    accountTo.solde += amount;
    historyOfTransactions.push({
      idTransaction: crypto.randomUUID(),
      idCompte: idAccountFrom,
      type: "transfer out",
      amount,
      date: new Date(),
    });
    historyOfTransactions.push({
      idTransaction: crypto.randomUUID(),
      idCompte: idAccountTo,
      type: "transfer in",
      amount,
      date: new Date(),
    });

    return {
      message: "Transfert effectué",
      compteEmetteur: accountFrom,
      compteRecepteur: accountTo,
    };
  } catch (error) {
    return { message: "Une erreur est survenue", error: error.message };
  }
}

console.log(transfertCash("1", "2", 50));

function getClientAccounts(idClient) {
  let accounts = comptes.filter((compte) => compte.idClient === idClient);
  try {
    if (accounts.length > 0) {
      return { message: "Comptes trouvés", comptes: accounts };
    } else {
      return { message: "Aucun compte trouvé pour ce client" };
    }
  } catch (error) {
    return { message: "Une erreur est survenue", error: error.message };
  }
}
console.log(getClientAccounts("1"));

function getTotalBalance(idClient) {
  let accounts = getClientAccounts(idClient);
  if (accounts.message === "Comptes trouvés") {
    let totalBalance = accounts.comptes.reduce(
      (total, compte) => total + compte.solde,
      0
    );
    accounts.comptes.forEach((compte) => {
      console.log(`Solde du compte ${compte.idCompte}: ${compte.solde}`);
    });
    return { message: "Solde total trouvé", soldeTotal: totalBalance };
  }
  return { message: "Aucun compte trouvé pour ce client" };
}
console.log(getTotalBalance("1"));

// Possibilité d'afficher le solde d'un compte pour un client donné
function getViewSolde(idCompte) {
  let account = comptes.find((compte) => compte.idCompte === idCompte);
  try {
    if (account) {
      return { message: "Solde trouvé", solde: account.solde };
    } else {
      return { message: "Compte non trouvé" };
    }
  } catch (error) {
    return { message: "Une erreur est survenue", error: error.message };
  }
}
console.log(getViewSolde("1"));

// Possibilité d'afficher l'historique des transactions pour un compte donné

function getTransactionHistory(idCompte) {
  let transactions = historyOfTransactions.filter(
    (transaction) => transaction.idCompte === idCompte
  );
  try {
    if (transactions.length > 0) {
      return { message: "Transactions trouvées", transactions: transactions };
    } else {
      return { message: "Aucune transaction trouvée pour ce compte" };
    }
  } catch (error) {
    return { message: "Une erreur est survenue", error: error.message };
  }
}

console.log(getTransactionHistory("1"));

// Possibilité d'afficher l'argent total détenu par un client (tous comptes confondus)

function getTotalMoneyInBank(idClient) {
  let accounts = getClientAccounts(idClient);
  if (accounts.message === "Comptes trouvés") {
    let totalMoney = accounts.comptes.reduce(
      (total, compte) => total + compte.solde,
      0
    );
    return { message: "Argent total trouvé", argentTotal: totalMoney };
  }
  return { message: "Aucun compte trouvé pour ce client" };
}

console.log(getTotalMoneyInBank("1"));

// Possibilité d'afficher l'argent total détenu par la banque (tous clients confondus)

function getTotalMoneyInAllBank() {
  let totalMoney = comptes.reduce((total, compte) => total + compte.solde, 0);
  try {
    return { message: "Argent total en banque", argentTotal: totalMoney };
  } catch (error) {
    return { message: "Une erreur est survenue", error: error.message };
  }
}
console.log(getTotalMoneyInAllBank());
